import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ExportDataButton } from "@/components/profile/ExportDataButton";

export const metadata: Metadata = { title: "Settings — PeoplePulse" };
export const dynamic = "force-dynamic";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-signal-teal">{title}</h2>
      <div className="mt-3 grid gap-3 text-[15px]">{children}</div>
    </section>
  );
}

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in?redirect_url=/settings");
  const email = user.emailAddresses?.[0]?.emailAddress ?? "—";

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your sign-in identity, your data controls, and privacy options."
      />
      <div className="grid max-w-2xl gap-4">
        <Section title="Account">
          <p className="text-sm text-slate-600">Signed in as</p>
          <p className="truncate text-base font-bold" title={email}>{email}</p>
          <div className="max-w-xs">
            <SignOutButton />
          </div>
        </Section>

        <Section title="Data">
          <p className="text-sm leading-relaxed text-slate-600">
            Download everything you have created: projects, Pulses, and collected responses.
          </p>
          <ExportDataButton />
        </Section>

        <Section title="Privacy">
          <p className="text-sm leading-relaxed text-slate-600">
            Participant responses are stored as grouped research evidence without respondent accounts.
            Your profile holds only what you entered on the{" "}
            <Link href="/profile" className="font-semibold text-pulse hover:text-pulse-dark">Profile</Link> page.
          </p>
          <div className="rounded-xl border border-border bg-paper p-4">
            <p className="font-bold">Delete my account</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Account deletion is currently unavailable: deleting a creator also destroys their
              published research evidence, and that decision needs founder review first. To request
              deletion or export help, reply to any PeoplePulse email from {email}.
            </p>
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Unavailable — see explanation above"
              className="mt-3 min-h-[44px] cursor-not-allowed rounded-lg border border-border bg-white px-5 text-sm font-semibold text-muted opacity-60"
            >
              Delete my account (unavailable)
            </button>
          </div>
        </Section>
      </div>
    </>
  );
}
