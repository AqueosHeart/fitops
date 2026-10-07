import { AdminParticipants } from "@/components/admin-workspace";
import { AdminPageGuard } from "@/components/admin-page-guard";

export default async function AdminParticipantsPage({ params }: PageProps<"/admin/sessions/[sessionId]/participants">) {
  const { sessionId } = await params;
  return <AdminPageGuard returnTo={`/admin/sessions/${sessionId}/participants`}><AdminParticipants sessionId={sessionId} /></AdminPageGuard>;
}
