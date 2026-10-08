import { AdminSessions } from "@/components/admin-workspace";
import { AdminPageGuard } from "@/components/admin-page-guard";

export default function AdminSessionsPage() {
  return <AdminPageGuard returnTo="/admin/sessions"><AdminSessions /></AdminPageGuard>;
}
