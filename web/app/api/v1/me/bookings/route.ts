import { NextRequest } from "next/server";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { requireMemberProfile } from "@/lib/server/http/member-guard";
import { jsonData } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: NextRequest) {
  const membership = requireMemberProfile(await resolveCurrentUser(request.headers));
  if ("error" in membership) return membership.error;
  const [bookings, waitlist] = await Promise.all([
    prisma.booking.findMany({ where: { memberId: membership.memberProfile.id, status: "CONFIRMED", session: { startsAt: { gte: new Date() } } }, include: { session: { include: { program: true } } }, orderBy: { session: { startsAt: "asc" } } }),
    prisma.waitlistEntry.findMany({ where: { memberId: membership.memberProfile.id, status: "WAITING" }, include: { session: { include: { program: true } } }, orderBy: { positionKey: "asc" } }),
  ]);
  return jsonData({ bookings: bookings.map((booking) => ({ bookingId: booking.id, sessionId: booking.sessionId, program: booking.session.program.name, startsAt: booking.session.startsAt.toISOString() })), waitlist: waitlist.map((entry) => ({ entryId: entry.id, sessionId: entry.sessionId, program: entry.session.program.name, position: entry.positionKey.toString(), startsAt: entry.session.startsAt.toISOString() })) });
}
