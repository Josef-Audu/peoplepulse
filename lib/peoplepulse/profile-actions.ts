"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createClerkSupabaseClient } from "@/lib/supabase/clerk-server";
import { getServiceClient } from "./server";
import { profileSchema, type Profile } from "./profile";

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED: creator sign-in required.");
  return userId;
}

/** Lazy server-side upsert: first profile need creates the row (RLS-owned). */
export async function getProfile(): Promise<{ profile: Profile; email: string | null }> {
  const userId = await requireUserId();
  const db = await createClerkSupabaseClient();
  const { data, error } = await db.from("profiles").select("*").eq("clerk_user_id", userId).single();
  if (data && !error) {
    const user = await currentUser();
    return { profile: data as Profile, email: user?.emailAddresses?.[0]?.emailAddress ?? null };
  }
  const { data: created, error: insertError } = await db
    .from("profiles")
    .insert({ clerk_user_id: userId })
    .select("*")
    .single();
  if (insertError || !created) throw new Error("DB_ERROR: could not load your profile.");
  const user = await currentUser();
  return { profile: created as Profile, email: user?.emailAddresses?.[0]?.emailAddress ?? null };
}

export async function saveProfile(input: unknown): Promise<void> {
  const userId = await requireUserId();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) throw new Error("INVALID: check display name, role, country, and age range.");
  const db = await createClerkSupabaseClient();
  const { error } = await db
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      role: parsed.data.role,
      country: parsed.data.country,
      age_range: parsed.data.age_range,
      interests: parsed.data.interests,
      contact_consent: parsed.data.contact_consent,
    })
    .eq("clerk_user_id", userId);
  if (error) throw new Error("DB_ERROR: could not save your profile.");
  revalidatePath("/profile");
  revalidatePath("/settings");
}

/** Owner data export: projects + pulses + responses, RLS-scoped to caller. */
export async function exportMyData(): Promise<string> {
  const userId = await requireUserId();
  const db = await createClerkSupabaseClient();
  const { data: projects, error } = await db.from("projects").select("*").eq("owner_id", userId);
  if (error) throw new Error("DB_ERROR: could not assemble your export.");
  const out: unknown[] = [];
  for (const p of (projects ?? []) as { id: string }[]) {
    const { data: pulses } = await db.from("pulses").select("*").eq("project_id", p.id);
    const withResponses = [];
    for (const pu of (pulses ?? []) as { id: string }[]) {
      const { data: responses } = await db.from("responses").select("*").eq("pulse_id", pu.id);
      withResponses.push({ ...pu, responses: responses ?? [] });
    }
    out.push({ ...p, pulses: withResponses });
  }
  const user = await currentUser();
  return JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      account: user?.emailAddresses?.[0]?.emailAddress ?? null,
      projects: out,
    },
    null,
    2
  );
}

/** Server-only audit write (privileged op; never participant PII, never secrets). */
export async function recordAudit(action: string, resourceType: string, resourceId?: string): Promise<void> {
  try {
    const { userId } = await auth();
    if (!userId) return;
    await getServiceClient()
      .from("audit_events")
      .insert({ actor_user_id: userId, action, resource_type: resourceType, resource_id: resourceId ?? null });
  } catch {
    /* audit must never break the product path */
  }
}
