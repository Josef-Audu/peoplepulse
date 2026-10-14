import type { Metadata } from "next";
import Link from "next/link";
import { createProject } from "@/lib/peoplepulse/actions";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "New research project — PeoplePulse" };
export const dynamic = "force-dynamic";

const inputClass =
  "mt-2 min-h-[44px] w-full rounded-lg border border-border bg-white px-3 text-[15px] text-ink placeholder:text-slate-400";

/** Minimum creator fields: title, decision, assumption, audience. */
export default function NewProjectPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="New research project"
        description="Start from the decision you need to make — evidence comes after."
      />
      <form
        action={createProject}
        className="grid max-w-2xl gap-5 rounded-2xl border border-border bg-white p-6 sm:p-8"
      >
        <div>
          <label className="block text-sm font-bold" htmlFor="title">Title</label>
          <input id="title" name="title" required minLength={3} maxLength={120} placeholder="Student Meal Service" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-bold" htmlFor="decision">Decision — what must be decided?</label>
          <textarea
            id="decision" name="decision" required minLength={10} maxLength={500} rows={3}
            placeholder="Should we test a weekly student meal delivery service?"
            className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-[15px] placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-bold" htmlFor="assumption">Assumption — what do you currently believe?</label>
          <textarea
            id="assumption" name="assumption" required minLength={10} maxLength={500} rows={3}
            placeholder="Students would pay for convenient weekly meal delivery."
            className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-[15px] placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-sm font-bold" htmlFor="audience">Audience — who can provide the evidence?</label>
          <input id="audience" name="audience" required minLength={3} maxLength={200} placeholder="University students aged 18–25" className={inputClass} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="min-h-[48px] rounded-lg border border-pulse-dark bg-pulse px-8 text-[15px] font-bold text-white hover:bg-pulse-dark"
          >
            Create project
          </button>
          <Link
            href="/dashboard"
            className="flex min-h-[48px] items-center justify-center rounded-lg border border-border bg-white px-6 text-sm font-semibold text-ink hover:border-slate-400"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
