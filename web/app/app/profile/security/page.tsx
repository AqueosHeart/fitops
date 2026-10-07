import { MemberProfile } from "@/components/member-profile";
import { MemberPageGuard } from "@/components/member-page-guard";

export default function ProfileSecurityPage() { return <MemberPageGuard returnTo="/app/profile/security"><MemberProfile /></MemberPageGuard>; }
