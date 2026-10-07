import { PageIntro, PublicLayout } from "@/components/site-shell";
import { ScheduleExplorer } from "@/components/schedule-explorer";

export default function SchedulePage() {
  return <PublicLayout><PageIntro eyebrow="The club calendar" title="Find a session that fits." description="Browse upcoming classes by date, program, trainer, and availability. Your place is confirmed only when a booking succeeds." /><ScheduleExplorer /></PublicLayout>;
}
