"use client";

import { useState } from "react";
import { submitResponse } from "@/lib/peoplepulse/actions";
import type { Question } from "@/lib/peoplepulse/types";

/**
 * Public participant flow (no login, mobile-first):
 * intro → Begin → one question at a time → submit → thank-you.
 */
export function ParticipantFlow({
  slug,
  pulseTitle,
  description,
  projectTitle,
  audience,
  questions,
}: {
  slug: string;
  pulseTitle: string;
  description: string;
  projectTitle: string;
  audience: string;
  questions: Question[];
}) {
  const [stage, setStage] = useState<"intro" | "answering" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  // Honeypot bot defense: humans never see/fill this; bots often do.
  const [website, setWebsite] = useState("");
  const [already] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(`pp-submitted-${slug}`) === "1";
    } catch {
      return false;
    }
  });

  const q = questions[index];
  const total = questions.length;
  const minutes = Math.max(1, Math.round(total / 3));

  function choose(value: string) {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function next() {
    if (!q) return;
    if (!answers[q.id] || answers[q.id].trim() === "") {
      setError("Please answer this question to continue.");
      return;
    }
    setError(null);
    if (index + 1 < total) setIndex(index + 1);
    else void send();
  }

  async function send() {
    setError(null);
    setSending(true);
    try {
      await submitResponse(slug, answers, website);
      try {
        window.localStorage.setItem(`pp-submitted-${slug}`, "1");
      } catch {
        /* storage unavailable — submission already persisted server-side */
      }
      setStage("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (stage === "done") {
    return (
      <section className="rounded-2xl border border-border bg-white p-6 text-center sm:p-8" aria-label="Thank you">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">Response recorded</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Thank you.</h1>
        <p className="mx-auto mt-3 max-w-[50ch] text-[15px] leading-relaxed text-slate-600">
          Your answers are now part of the human evidence for “{projectTitle}”. Findings are always
          reported with context — who was asked, how many answered, and what the sample cannot claim.
        </p>
      </section>
    );
  }

  if (stage === "intro") {
    return (
      <section className="rounded-2xl border border-border bg-white p-6 sm:p-8" aria-label="About this Pulse">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-signal-teal">You are invited to a Pulse</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{pulseTitle}</h1>
        {description ? <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{description}</p> : null}
        <dl className="mt-5 grid gap-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-border py-2">
            <dt className="font-semibold">Questions</dt>
            <dd className="text-slate-600">{total}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border py-2">
            <dt className="font-semibold">Estimated time</dt>
            <dd className="text-slate-600">about {minutes} min</dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="font-semibold">Anonymous</dt>
            <dd className="text-slate-600">no account needed</dd>
          </div>
        </dl>
        {already ? (
          <p className="mt-4 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink">
            You already submitted from this device. Please respond only once per person so the evidence stays honest.
          </p>
        ) : null}
        <div className="mt-4 rounded-xl border border-border bg-paper p-4 text-[13px] leading-relaxed text-slate-600">
          <p className="font-bold text-ink">Before you begin</p>
          <p className="mt-1">
            Participation is voluntary. We collect only your answers to these questions — no
            account, no name, no contact details. Answers are grouped into research evidence
            with context and never reported as population-level truth.{" "}
            <a href="/privacy" className="font-semibold text-pulse hover:text-pulse-dark">
              Privacy Policy
            </a>
          </p>
        </div>
        <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0" tabIndex={-1}>
          <label>
            Leave this field empty
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => setStage("answering")}
          className="mt-6 min-h-[48px] w-full rounded-lg border border-pulse-dark bg-pulse text-[15px] font-bold text-white hover:bg-pulse-dark"
        >
          Begin
        </button>
        <p className="mt-3 text-center text-xs text-muted">Evidence for: {audience}</p>
      </section>
    );
  }

  if (!q) return null;
  const progress = Math.round(((index + 1) / total) * 100);

  return (
    <section className="rounded-2xl border border-border bg-white p-6 sm:p-8" aria-label={`Question ${index + 1} of ${total}`}>
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.1em] text-muted">
        <span>Question {index + 1} of {total}</span>
        <span>{progress}%</span>
      </div>
      <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-[#EEF2FF]">
        <span className="block h-full rounded-full bg-pulse" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="mt-5 text-2xl font-extrabold tracking-tight">{q.prompt}</h1>

      <div className="mt-5 grid gap-2">
        {q.type === "single_choice" ? (
          (q.options ?? []).map((opt) => {
            const selected = answers[q.id] === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(opt)}
                aria-pressed={selected}
                className={`min-h-[48px] rounded-lg border px-4 text-left text-[15px] font-semibold ${
                  selected ? "border-pulse bg-pulse/5 text-ink" : "border-border bg-white text-ink hover:border-slate-400"
                }`}
              >
                {opt}
              </button>
            );
          })
        ) : (
          <textarea
            value={answers[q.id] ?? ""}
            onChange={(e) => choose(e.target.value)}
            rows={4}
            placeholder="In your own words…"
            aria-label={q.prompt}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-[15px] placeholder:text-slate-400"
          />
        )}
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm font-semibold text-error">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex gap-2">
        {index > 0 ? (
          <button
            type="button"
            onClick={() => { setIndex(index - 1); setError(null); }}
            className="min-h-[48px] rounded-lg border border-border bg-white px-5 text-sm font-semibold text-ink hover:border-slate-400"
          >
            Back
          </button>
        ) : null}
        <button
          type="button"
          onClick={next}
          disabled={sending}
          className="min-h-[48px] flex-1 rounded-lg border border-pulse-dark bg-pulse text-[15px] font-bold text-white hover:bg-pulse-dark disabled:opacity-60"
        >
          {sending ? "Submitting…" : index + 1 === total ? "Submit" : "Continue"}
        </button>
      </div>
    </section>
  );
}
