import type { PulseResponse, Question } from "./types";

export type ChoiceStat = {
  questionId: string;
  prompt: string;
  options: { label: string; count: number; share: number }[];
  answered: number;
};

export type WhyGroup = {
  questionId: string;
  prompt: string;
  texts: string[];
};

/**
 * Pure evidence computation shared by results + brief.
 * Language rule is structural: every share is "of respondents".
 */
export function computeStats(questions: Question[], responses: PulseResponse[]) {
  const total = responses.length;
  const choices: ChoiceStat[] = [];
  const whys: WhyGroup[] = [];

  for (const q of questions) {
    if (q.type === "single_choice") {
      const counts = new Map<string, number>();
      for (const opt of q.options ?? []) counts.set(opt, 0);
      let answered = 0;
      for (const r of responses) {
        const a = r.answers[q.id];
        if (typeof a === "string" && a !== "") {
          answered += 1;
          counts.set(a, (counts.get(a) ?? 0) + 1);
        }
      }
      choices.push({
        questionId: q.id,
        prompt: q.prompt,
        answered,
        options: [...counts.entries()].map(([label, count]) => ({
          label,
          count,
          share: answered > 0 ? Math.round((count / answered) * 100) : 0,
        })),
      });
    } else {
      const texts: string[] = [];
      for (const r of responses) {
        const a = r.answers[q.id];
        if (typeof a === "string" && a.trim() !== "") texts.push(a.trim());
      }
      whys.push({ questionId: q.id, prompt: q.prompt, texts });
    }
  }

  /** Signature Ask Why pair: top choice finding + last short-text explanations. */
  const topChoice = choices[0] ?? null;
  const topOption =
    topChoice != null
      ? [...topChoice.options].sort((a, b) => b.count - a.count)[0] ?? null
      : null;
  const signatureWhy = whys.length > 0 ? whys[whys.length - 1] : null;

  return { total, choices, whys, topChoice, topOption, signatureWhy };
}
