import { AdminSessions } from "@/components/admin-workspace";
import { AdminPageGuard } from "@/components/admin-page-guard";

export default function AdminOverviewPage() {
  return <AdminPageGuard returnTo="/admin"><AdminSessions overview /></AdminPageGuard>;
}
