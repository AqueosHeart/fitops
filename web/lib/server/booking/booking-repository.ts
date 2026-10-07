import "server-only";

import { prisma } from "@/lib/server/prisma";

export async function findSessionForBooking(sessionId: string) {
    return prisma.classSession.findUnique({
        where: { id: sessionId },
        include: {
            program: true,
            trainer: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            bookings: {
                where: { status: "CONFIRMED" },
                select: {
                    id: true,
                    memberId: true,
                    bookedAt: true,
                },
            },
            waitlistEntries: {
                where: { status: "WAITING" },
                orderBy: { positionKey: "asc" },
                select: {
                    id: true,
                    memberId: true,
                    positionKey: true,
                    joinedAt: true,
                },
            },
        },
    });
}