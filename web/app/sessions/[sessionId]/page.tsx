import { PublicLayout } from "@/components/site-shell";
import { SessionDetail } from "@/components/session-detail";

export default async function SessionPage({ params }: PageProps<"/sessions/[sessionId]">) {
  const { sessionId } = await params;
  return <PublicLayout><SessionDetail sessionId={sessionId} /></PublicLayout>;
}
