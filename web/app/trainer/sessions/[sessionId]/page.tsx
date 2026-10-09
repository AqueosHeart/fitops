import { TrainerSessionDetail } from "@/components/trainer-workspace";
import { TrainerPageGuard } from "@/components/trainer-page-guard";

export default async function TrainerSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const returnTo = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)
    ? `/trainer/sessions/${sessionId}`
    : "/trainer/sessions";
  return <TrainerPageGuard returnTo={returnTo}><TrainerSessionDetail sessionId={sessionId} /></TrainerPageGuard>;
}
