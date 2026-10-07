import { MemberBookings } from "@/components/member-bookings";
import { MemberPageGuard } from "@/components/member-page-guard";

export default function BookingsPage() { return <MemberPageGuard returnTo="/app/bookings"><MemberBookings /></MemberPageGuard>; }
