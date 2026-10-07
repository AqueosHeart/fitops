import { NextRequest } from "next/server";
import { z } from "zod";

import { jsonData, jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

const querySchema = z.object({
  from: z.iso.datetime().optional(), to: z.iso.datetime().optional(), program: z.string().max(100).optional(), trainer: z.string().max(120).optional(), availability: z.enum(["available", "full"]).optional(), cursor: z.uuid().optional(),
});

export async function GET(request: NextRequest) {
  const query = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!query.success) return jsonError(400, "VALIDATION_FAILED", "Invalid session query.", z.flattenError(query.error).fieldErrors);
  const sessions = await prisma.classSession.findMany({
    where: { status: "SCHEDULED", startsAt: { gte: query.data.from ? new Date(query.data.from) : undefined, lte: query.data.to ? new Date(query.data.to) : undefined }, program: { isPublished: true, slug: query.data.program }, trainer: { user: { name: query.data.trainer } } },
    include: { program: true, trainer: { include: { user: { select: { name: true } } } }, _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } }, orderBy: [{ startsAt: "asc" }, { id: "asc" }], cursor: query.data.cursor ? { id: query.data.cursor } : undefined, skip: query.data.cursor ? 1 : undefined, take: 51,
  });
  const page = sessions.slice(0, 50);
  const data = page.map((session) => ({ sessionId: session.id, program: session.program.name, trainer: session.trainer.user.name, startsAt: session.startsAt.toISOString(), endsAt: session.endsAt.toISOString(), capacity: session.capacity, confirmedCount: session._count.bookings, availability: session._count.bookings < session.capacity ? "available" : "full", bookingCutoffMinutes: session.bookingCutoffMinutes }));
  const filtered = query.data.availability ? data.filter((item) => item.availability === query.data.availability) : data;
  return jsonData({ sessions: filtered, nextCursor: sessions.length > 50 ? page.at(-1)?.id ?? null : null });
}
