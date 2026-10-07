import { PageIntro, PublicLayout } from "@/components/site-shell";
import { PublicPrograms } from "@/components/public-programs";

export default function ProgramsPage() {
  return <PublicLayout><PageIntro eyebrow="Explore the studio" title="Programs for your week." description="A simple demo catalog of the sessions Practice Athletic Club offers. Every listing is fictional." /><section className="schedule-wrap"><PublicPrograms /></section></PublicLayout>;
}
