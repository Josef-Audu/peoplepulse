/** PeoplePulse MVP domain types. Questions/answers live in JSONB (demo-day scope). */

export type QuestionType = "single_choice" | "short_text";

export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  /** Required for single_choice (2–6 entries). Absent for short_text. */
  options?: string[];
};

export type Project = {
  id: string;
  owner_id: string;
  title: string;
  decision: string;
  assumption: string;
  audience: string;
  created_at: string;
};

export type PulseStatus = "draft" | "open" | "closed";

export type Pulse = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  public_slug: string;
  status: PulseStatus;
  questions: Question[];
  created_at: string;
};

/** answers: Record<questionId, answerText>. single_choice stores the option text. */
export type PulseResponse = {
  id: string;
  pulse_id: string;
  answers: Record<string, string>;
  submitted_at: string;
};

export type ProjectCardData = Project & {
  pulseStatus: PulseStatus | null;
  responseCount: number;
};

export function isQuestion(value: unknown): value is Question {
  if (typeof value !== "object" || value === null) return false;
  const q = value as Record<string, unknown>;
  if (typeof q.id !== "string" || typeof q.prompt !== "string") return false;
  if (q.type !== "single_choice" && q.type !== "short_text") return false;
  if (q.type === "single_choice") {
    if (!Array.isArray(q.options)) return false;
    const opts = q.options as unknown[];
    if (opts.length < 2 || opts.some((o) => typeof o !== "string" || o.trim() === "")) return false;
  }
  return true;
}

export function asQuestions(value: unknown): Question[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isQuestion);
}
