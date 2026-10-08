import { AdminSessionForm } from "@/components/admin-workspace";
import { AdminPageGuard } from "@/components/admin-page-guard";

export default function NewAdminSessionPage() {
  return <AdminPageGuard returnTo="/admin/sessions/new"><AdminSessionForm /></AdminPageGuard>;
}
