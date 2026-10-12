import { LandingContent } from "@/components/landing/content";
import { PublicLayout } from "@/components/site-shell";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { signedOut } = await searchParams;
  return <PublicLayout landing>
    {signedOut === "1" && <p className="schedule-state state-success landing-signout" role="status">You’ve signed out securely.</p>}
    <LandingContent />
  </PublicLayout>;
}
