import { AdminSessionForm } from "@/components/admin-workspace";
import { AdminPageGuard } from "@/components/admin-page-guard";

export default async function EditAdminSessionPage({ params }: PageProps<"/admin/sessions/[sessionId]/edit">) {
  const { sessionId } = await params;
  return <AdminPageGuard returnTo={`/admin/sessions/${sessionId}/edit`}><AdminSessionForm sessionId={sessionId} /></AdminPageGuard>;
}
