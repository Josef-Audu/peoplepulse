import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/peoplepulse/profile-actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = { title: "Profile — PeoplePulse" };
export const dynamic = "force-dynamic";

/** Authenticated creator profile. Middleware guarantees a session; a missing
 *  session here redirects rather than rendering contradictory shell copy. */
export default async function ProfilePage() {
  let data: Awaited<ReturnType<typeof getProfile>> | null = null;
  try {
    data = await getProfile();
  } catch {
    redirect("/sign-in?redirect_url=/profile");
  }
  if (!data) redirect("/sign-in?redirect_url=/profile");

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Who you are as a researcher. Your sign-in email identifies your account; everything else here shapes your PeoplePulse workspace."
      />
      <ProfileForm profile={data.profile} email={data.email} />
    </>
  );
}
