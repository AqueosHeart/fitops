import { MemberDashboard } from "@/components/member-dashboard";
import { MemberPageGuard } from "@/components/member-page-guard";

export default function MemberHomePage() { return <MemberPageGuard returnTo="/app"><MemberDashboard /></MemberPageGuard>; }
