"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/peoplepulse/profile-actions";
import { PROFILE_AGE_RANGES, PROFILE_ROLES, type Profile } from "@/lib/peoplepulse/profile";

const inputClass =
  "mt-2 min-h-[44px] w-full rounded-lg border border-border bg-white px-3 text-[15px] text-ink placeholder:text-slate-400";

/** Editable creator profile. Identity (email) comes from Clerk, read-only. */
export function ProfileForm({ profile, email }: { profile: Profile; email: string | null }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [role, setRole] = useState<string>(profile.role ?? PROFILE_ROLES[0]);
  const [country, setCountry] = useState(profile.country ?? "");
  const [ageRange, setAgeRange] = useState<string>(profile.age_range ?? PROFILE_AGE_RANGES[0]);
  const [interests, setInterests] = useState((profile.interests ?? []).join(", "));
  const [consent, setConsent] = useState(profile.contact_consent);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setStatus(null);
    setSaving(true);
    try {
      await saveProfile({
        display_name: displayName.trim(),
        role,
        country: country.trim(),
        age_range: ageRange,
        interests,
        contact_consent: consent,
      });
      setStatus({ kind: "ok", text: "Profile saved." });
      router.refresh();
    } catch (e) {
      setStatus({ kind: "err", text: e instanceof Error ? e.message : "Could not save your profile." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid max-w-2xl gap-5 rounded-2xl border border-border bg-white p-6 sm:p-8">
      <div>
        <p className="text-sm font-bold">Account email (from sign-in)</p>
        <p className="mt-2 min-h-[44px] w-full truncate rounded-lg border border-border bg-paper px-3 py-2.5 text-[15px] text-slate-600">
          {email ?? "—"}
        </p>
      </div>
      <div>
        <label className="block text-sm font-bold" htmlFor="pf-name">Display name</label>
        <input id="pf-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ada Lovelace" className={inputClass} autoComplete="nickname" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-bold" htmlFor="pf-role">Role</label>
          <select id="pf-role" value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
            {PROFILE_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold" htmlFor="pf-age">Age range</label>
          <select id="pf-age" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={inputClass}>
            {PROFILE_AGE_RANGES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold" htmlFor="pf-country">Country</label>
        <input id="pf-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Nigeria" className={inputClass} autoComplete="country-name" />
      </div>
      <div>
        <label className="block text-sm font-bold" htmlFor="pf-interests">Interests (comma-separated, up to 10)</label>
        <input id="pf-interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="food services, student life" className={inputClass} />
      </div>
      <div className="flex items-start gap-3">
        <input id="pf-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-[#2563EB]" />
        <label htmlFor="pf-consent" className="text-sm leading-relaxed text-slate-600">
          I&apos;m happy to be contacted about my research and relevant PeoplePulse updates.
        </label>
      </div>
      {status ? (
        <p
          role={status.kind === "err" ? "alert" : "status"}
          className={`rounded-lg border px-4 py-3 text-sm font-semibold ${status.kind === "err" ? "border-error/30 bg-error/5 text-error" : "border-signal-teal/30 bg-signal-teal/5 text-signal-teal"}`}
        >
          {status.text}
        </p>
      ) : null}
      <div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="min-h-[48px] rounded-lg border border-pulse-dark bg-pulse px-8 text-[15px] font-bold text-white hover:bg-pulse-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
