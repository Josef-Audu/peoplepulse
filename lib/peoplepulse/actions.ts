"use server";

import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServiceClient } from "./server";
import { asQuestions, type Project, type ProjectCardData, type Pulse } from "./types";

/* ------------------------------------------------------------------ auth */

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("UNAUTHORIZED: creator sign-in required.");
  return userId;
}

async function requireOwnedProject(projectId: string, userId: string): Promise<Project> {
  const db = getServiceClient();
  const { data, error } = await db.from("projects").select("*").eq("id", projectId).single();
  if (error || !data) throw new Error("NOT_FOUND: research project does not exist.");
  const project = data as Project;
  if (project.owner_id !== userId) throw new Error("FORBIDDEN: this research belongs to another creator.");
  return project;
}

/* ------------------------------------------------------------------ validation */

const projectSchema = z.object({
  title: z.string().trim().min(3).max(120),
  decision: z.string().trim().min(10).max(500),
  assumption: z.string().trim().min(10).max(500),
  audience: z.string().trim().min(3).max(200),
});

const questionSchema = z.object({
  id: z.string().min(1).max(40),
  type: z.enum(["single_choice", "short_text"]),
  prompt: z.string().trim().min(3).max(500),
  options: z.array(z.string().trim().min(1).max(200)).min(2).max(6).optional(),
});

const pulseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(500).optional().default(""),
  questions: z.array(questionSchema).min(1).max(8),
});

/* ------------------------------------------------------------------ projects */

export async function createProject(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    decision: formData.get("decision"),
    assumption: formData.get("assumption"),
    audience: formData.get("audience"),
  });
  if (!parsed.success) throw new Error("INVALID: please complete every field (title, decision, assumption, audience).");

  const db = getServiceClient();
  const { data, error } = await db
    .from("projects")
    .insert({ owner_id: userId, ...parsed.data })
    .select("id")
    .single();
  if (error || !data) throw new Error("DB_ERROR: could not create the research project.");
  revalidatePath("/dashboard");
  revalidatePath("/research");
  redirect(`/research/${(data as { id: string }).id}`);
}

export async function listProjects(): Promise<ProjectCardData[]> {
  const userId = await requireUserId();
  const db = getServiceClient();
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error("DB_ERROR: could not load research projects.");
  const projects = (data ?? []) as Project[];

  const cards: ProjectCardData[] = [];
  for (const p of projects) {
    const { data: pulses } = await db.from("pulses").select("id,status").eq("project_id", p.id);
    const list = (pulses ?? []) as { id: string; status: Pulse["status"] }[];
    let responseCount = 0;
    for (const pu of list) {
      const { count } = await db.from("responses").select("id", { count: "exact", head: true }).eq("pulse_id", pu.id);
      responseCount += count ?? 0;
    }
    cards.push({ ...p, pulseStatus: list[0]?.status ?? null, responseCount });
  }
  return cards;
}

export async function getProject(projectId: string): Promise<{ project: Project; pulse: Pulse | null; responseCount: number }> {
  const userId = await requireUserId();
  const project = await requireOwnedProject(projectId, userId);
  const db = getServiceClient();
  const { data: pulseData } = await db.from("pulses").select("*").eq("project_id", projectId).limit(1);
  const raw = (pulseData ?? [])[0] as Omit<Pulse, "questions"> & { questions: unknown } | undefined;
  const pulse: Pulse | null = raw ? { ...raw, questions: asQuestions(raw.questions) } : null;
  let responseCount = 0;
  if (pulse) {
    const { count } = await db.from("responses").select("id", { count: "exact", head: true }).eq("pulse_id", pulse.id);
    responseCount = count ?? 0;
  }
  return { project, pulse, responseCount };
}

/* ------------------------------------------------------------------ pulses */

export async function savePulse(projectId: string, input: { title: string; description?: string; questions: unknown }): Promise<string> {
  const userId = await requireUserId();
  await requireOwnedProject(projectId, userId);
  const parsed = pulseSchema.safeParse(input);
  if (!parsed.success) throw new Error("INVALID: a Pulse needs a title and 1–8 questions (single_choice needs 2–6 options).");

  const db = getServiceClient();
  const { data: existing } = await db.from("pulses").select("id").eq("project_id", projectId).limit(1);
  if (existing && existing.length > 0) {
    const { error } = await db
      .from("pulses")
      .update({ title: parsed.data.title, description: parsed.data.description ?? "", questions: parsed.data.questions })
      .eq("id", (existing[0] as { id: string }).id);
    if (error) throw new Error("DB_ERROR: could not update the Pulse.");
    revalidatePath(`/research/${projectId}`);
    return (existing[0] as { id: string }).id;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await db
      .from("pulses")
      .insert({
        project_id: projectId,
        title: parsed.data.title,
        description: parsed.data.description ?? "",
        public_slug: nanoid(10),
        status: "draft",
        questions: parsed.data.questions,
      })
      .select("id")
      .single();
    if (!error && data) {
      revalidatePath(`/research/${projectId}`);
      return (data as { id: string }).id;
    }
  }
  throw new Error("DB_ERROR: could not create the Pulse.");
}

export async function setPulseStatus(projectId: string, pulseId: string, status: "open" | "closed" | "draft"): Promise<void> {
  const userId = await requireUserId();
  await requireOwnedProject(projectId, userId);
  const db = getServiceClient();
  const { data: pulse } = await db.from("pulses").select("id,project_id").eq("id", pulseId).single();
  if (!pulse || (pulse as { project_id: string }).project_id !== projectId) throw new Error("FORBIDDEN: pulse does not belong to this project.");
  const { error } = await db.from("pulses").update({ status }).eq("id", pulseId);
  if (error) throw new Error("DB_ERROR: could not update Pulse status.");
  revalidatePath(`/research/${projectId}`);
  revalidatePath("/dashboard");
}

/* ------------------------------------------------------------------ results */

export async function getResults(projectId: string) {
  const { project, pulse, responseCount } = await getProject(projectId);
  if (!pulse) return { project, pulse: null, responses: [], responseCount };
  const db = getServiceClient();
  const { data, error } = await db
    .from("responses")
    .select("*")
    .eq("pulse_id", pulse.id)
    .order("submitted_at", { ascending: true });
  if (error) throw new Error("DB_ERROR: could not load responses.");
  return { project, pulse, responses: (data ?? []) as import("./types").PulseResponse[], responseCount };
}

export async function listPulses(): Promise<{ pulse: Pulse; projectTitle: string; responseCount: number }[]> {
  const userId = await requireUserId();
  const db = getServiceClient();
  const { data: projects } = await db.from("projects").select("id,title").eq("owner_id", userId);
  const rows: { pulse: Pulse; projectTitle: string; responseCount: number }[] = [];
  for (const p of ((projects ?? []) as { id: string; title: string }[])) {
    const { data: pulses } = await db.from("pulses").select("*").eq("project_id", p.id).order("created_at", { ascending: false });
    for (const raw of ((pulses ?? []) as (Omit<Pulse, "questions"> & { questions: unknown })[])) {
      const { count } = await db.from("responses").select("id", { count: "exact", head: true }).eq("pulse_id", raw.id);
      rows.push({ pulse: { ...raw, questions: asQuestions(raw.questions) }, projectTitle: p.title, responseCount: count ?? 0 });
    }
  }
  return rows;
}

/* ------------------------------------------------------------------ public participant (no login) */

export async function getPublicPulse(slug: string): Promise<{ pulse: Pulse; projectTitle: string; audience: string } | null> {
  // Service-role (server-only): the anon role was not granted table
  // privileges in this project, so public reads go through the same
  // validated server layer as everything else. Only OPEN pulses are
  // returned, and only title/audience context is exposed.
  const db = getServiceClient();
  const { data, error } = await db.from("pulses").select("*").eq("public_slug", slug).eq("status", "open").single();
  if (error || !data) return null;
  const raw = data as Omit<Pulse, "questions"> & { questions: unknown };
  const { data: proj } = await db.from("projects").select("title,audience").eq("id", raw.project_id).single();
  const meta = (proj ?? { title: "", audience: "" }) as { title: string; audience: string };
  return { pulse: { ...raw, questions: asQuestions(raw.questions) }, projectTitle: meta.title, audience: meta.audience };
}

export async function submitResponse(slug: string, answers: Record<string, string>): Promise<void> {
  const target = await getPublicPulse(slug);
  if (!target) throw new Error("CLOSED: this Pulse is not open for responses.");
  const cleaned: Record<string, string> = {};
  for (const q of target.pulse.questions) {
    const raw = answers[q.id];
    if (typeof raw !== "string" || raw.trim() === "") throw new Error("INVALID: please answer every question before submitting.");
    const value = raw.trim().slice(0, 1000);
    if (q.type === "single_choice" && !(q.options ?? []).includes(value)) throw new Error("INVALID: unknown choice submitted.");
    cleaned[q.id] = value;
  }
  const db = getServiceClient();
  const { error } = await db.from("responses").insert({ pulse_id: target.pulse.id, answers: cleaned });
  if (error) throw new Error("DB_ERROR: could not save your response. Please try again.");
}
