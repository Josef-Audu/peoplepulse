import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthCard } from "@/components/auth/AuthCard";
import { clerkAuthAppearance } from "@/components/auth/clerkAppearance";

export const metadata: Metadata = { title: "Sign in — PeoplePulse" };

/**
 * Clerk prebuilt sign-in (email verification, password recovery, and session
 * creation are Clerk's responsibility). Framed in the PeoplePulse AuthCard
 * brand shell; Clerk appearance carries the brand tokens.
 */
export default function ClerkSignInPage() {
  return (
    <AuthCard
      headingId="sign-in-heading"
      title="Sign in"
      description="Welcome back. Sign in to continue to your research."
    >
      <SignIn appearance={clerkAuthAppearance} />
    </AuthCard>
  );
}
