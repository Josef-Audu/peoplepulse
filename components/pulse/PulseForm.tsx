"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePulse } from "@/lib/peoplepulse/actions";
import type { Question, QuestionType } from "@/lib/peoplepulse/types";

type Draft = { id: string; type: QuestionType; prompt: string; optionsText: string };

function toDrafts(questions: Question[]): Draft[] {
  return questions.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    optionsText: (q.options ?? []).join("\n"),
  }));
}

const STARTER: Draft[] = [
  { id: "q1", type: "single_choice", prompt: "How do you currently get most of your meals?", optionsText: "Cook at home\nBuy on campus\nOrder delivery\nSkip meals" },
  { id: "q2", type: "single_choice", prompt: "Would you consider using a weekly student meal delivery service?", optionsText: "Yes, definitely\nMaybe, depends on price\nProbably not\nNo" },
  { id: "q3", type: "single_choice", prompt: "What would make you most likely to use it?", optionsText: "Low price\nTaste and variety\nSpeed and convenience\nHealthiness" },
  { id: "q4", type: "short_text", prompt: "Why did you choose that answer?", optionsText: "" },
];

/**
 * Pulse builder (demo scope): title, description, 1–8 questions of
 * single_choice / short_text. The last short-text question is the MVP Ask Why.
 */
export function PulseForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: { title: string; description: string; questions: Question[] };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [drafts, setDrafts] = useState<Draft[]>(() =>
    initial && initial.questions.length > 0 ? toDrafts(initial.questions) : STARTER
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function patch(index: number, next: Partial<Draft>) {
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, ...next } : d)));
  }

  function addQuestion() {
    if (drafts.length >= 8) return;
    setDrafts((prev) => [...prev, { id: `q${Date.now()}`, type: "short_text", prompt: "", optionsText: "" }]);
  }

  function removeQuestion(index: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSave() {
    setError(null);
    setSaving(true);
    try {
      const questions: Question[] = drafts.map((d, i) => ({
        id: `q${i + 1}`,
        type: d.type,
        prompt: d.prompt.trim(),
        ...(d.type === "single_choice"
          ? { options: d.optionsText.split("\n").map((o) => o.trim()).filter(Boolean) }
          : {}),
      }));
      await savePulse(projectId, { title: title.trim(), description: description.trim(), questions });
      router.push(`/research/${projectId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the Pulse.");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-border bg-white p-6">
        <label className="block text-sm font-bold" htmlFor="pulse-title">Pulse title</label>
        <input
          id="pulse-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Student meals — weekly delivery test"
          className="mt-2 min-h-[44px] w-full rounded-lg border border-border bg-white px-3 text-[15px] text-ink placeholder:text-slate-400"
        />
        <label className="mt-4 block text-sm font-bold" htmlFor="pulse-desc">Short purpose (shown to participants)</label>
        <input
          id="pulse-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. 4 quick questions, about 1 minute"
          className="mt-2 min-h-[44px] w-full rounded-lg border border-border bg-white px-3 text-[15px] text-ink placeholder:text-slate-400"
        />
      </section>

      {drafts.map((d, i) => (
        <section key={d.id} className="rounded-2xl border border-border bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.1em] text-signal-teal">Question {i + 1}</h2>
            <button
              type="button"
              onClick={() => removeQuestion(i)}
              disabled={drafts.length <= 1}
              className="min-h-[44px] rounded-lg border border-border px-3 text-sm font-semibold text-error hover:border-error disabled:opacity-40"
            >
              Remove
            </button>
          </div>
          <label className="mt-3 block text-sm font-bold" htmlFor={`q-${i}-type`}>Type</label>
          <select
            id={`q-${i}-type`}
            value={d.type}
            onChange={(e) => patch(i, { type: e.target.value as QuestionType })}
            className="mt-2 min-h-[44px] w-full rounded-lg border border-border bg-white px-3 text-[15px]"
          >
            <option value="single_choice">Single choice</option>
            <option value="short_text">Short text (Ask Why)</option>
          </select>
          <label className="mt-3 block text-sm font-bold" htmlFor={`q-${i}-prompt`}>Question</label>
          <input
            id={`q-${i}-prompt`}
            value={d.prompt}
            onChange={(e) => patch(i, { prompt: e.target.value })}
            placeholder={d.type === "short_text" ? "Why did you choose that answer?" : "What should we ask?"}
            className="mt-2 min-h-[44px] w-full rounded-lg border border-border bg-white px-3 text-[15px] placeholder:text-slate-400"
          />
          {d.type === "single_choice" ? (
            <>
              <label className="mt-3 block text-sm font-bold" htmlFor={`q-${i}-opts`}>Options (one per line, 2–6)</label>
              <textarea
                id={`q-${i}-opts`}
                value={d.optionsText}
                onChange={(e) => patch(i, { optionsText: e.target.value })}
                rows={4}
                className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-[15px] placeholder:text-slate-400"
                placeholder={"Yes, definitely\nMaybe, depends on price\nNo"}
              />
            </>
          ) : null}
        </section>
      ))}

      <div>
        <button
          type="button"
          onClick={addQuestion}
          disabled={drafts.length >= 8}
          className="min-h-[44px] rounded-lg border border-dashed border-slate-300 bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400 disabled:opacity-40"
        >
          + Add question ({drafts.length}/8)
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </p>
      ) : null}

      <div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="min-h-[48px] rounded-lg border border-pulse-dark bg-pulse px-8 text-[15px] font-bold text-white hover:bg-pulse-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Pulse"}
        </button>
      </div>
    </div>
  );
}
