"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

/** Real sign-out: ends the Clerk session, then returns to /sign-in. */
export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await signOut({ redirectUrl: "/sign-in" });
    } finally {
      router.push("/sign-in");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="flex min-h-[44px] w-full items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-semibold text-ink hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
