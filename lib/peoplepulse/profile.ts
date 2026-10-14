import { z } from "zod";

/** Creator profile (identity from Clerk; PeoplePulse data in Supabase). */

export type Profile = {
  id: string;
  clerk_user_id: string;
  display_name: string | null;
  role: string | null;
  country: string | null;
  age_range: string | null;
  interests: string[];
  contact_consent: boolean;
  created_at: string;
  updated_at: string;
};

export const PROFILE_ROLES = [
  "Founder",
  "Product manager",
  "Researcher",
  "Designer",
  "Student",
  "Other",
] as const;

export const PROFILE_AGE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55+"] as const;

/** Shared server/client validation: same rules on both sides. */
export const profileSchema = z.object({
  display_name: z.string().trim().min(2).max(80),
  role: z.enum(PROFILE_ROLES),
  country: z.string().trim().min(2).max(80),
  age_range: z.enum(PROFILE_AGE_RANGES),
  interests: z
    .string()
    .trim()
    .max(300)
    .transform((s) =>
      s
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, 10)
    ),
  contact_consent: z.boolean(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
