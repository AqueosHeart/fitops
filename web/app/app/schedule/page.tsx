import { PageIntro } from "@/components/site-shell";
import { ScheduleExplorer } from "@/components/schedule-explorer";
import { MemberPageGuard } from "@/components/member-page-guard";

export default async function MemberSchedulePage({ searchParams }: PageProps<"/app/schedule">) {
  const query = await searchParams;
  const sessionId = typeof query.sessionId === "string" ? query.sessionId : undefined;
  const returnTo = sessionId ? `/app/schedule?sessionId=${encodeURIComponent(sessionId)}` : "/app/schedule";
  return <MemberPageGuard returnTo={returnTo}><PageIntro eyebrow="Member schedule" title="Make a place for movement." description="Book an available class or join the waitlist. The server rechecks membership, cutoff, duplicates, overlap, and capacity when you submit." /><ScheduleExplorer member initialSessionId={sessionId} /></MemberPageGuard>;
}
