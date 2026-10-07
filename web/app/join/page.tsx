import { PageIntro, PublicLayout } from "@/components/site-shell";
import { JoinPicker } from "@/components/join-picker";

export default async function JoinPage({ searchParams }: PageProps<"/join">) {
  const query = await searchParams;
  return <PublicLayout><PageIntro eyebrow="Welcome to Practice" title="Find your way into the club." description="Choose a fictional plan to create a demo member account, or sign in if you already have one." /><JoinPicker returnTo={typeof query.returnTo === "string" ? query.returnTo : "/app"} initialPlan={typeof query.plan === "string" ? query.plan : ""} /></PublicLayout>;
}
