import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { AuthCard } from "@/components/auth/AuthCard";
import { clerkAuthAppearance } from "@/components/auth/clerkAppearance";

export const metadata: Metadata = { title: "Sign up — PeoplePulse" };

/**
 * Clerk prebuilt sign-up (email verification included). Framed in the
 * PeoplePulse AuthCard brand shell; Clerk appearance carries the brand tokens.
 */
export default function ClerkSignUpPage() {
  return (
    <AuthCard
      headingId="sign-up-heading"
      title="Create your account"
      description="Create an account, run a short Pulse, and decide with real human evidence."
    >
      <SignUp appearance={clerkAuthAppearance} />
    </AuthCard>
  );
}
