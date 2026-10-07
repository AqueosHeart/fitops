import { NextRequest } from "next/server";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { jsonData, jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: NextRequest) {
  const user = await resolveCurrentUser(request.headers);
  if (!user) return jsonError(401, "UNAUTHENTICATED", "Authentication is required.");
  if (user.role !== "ADMINISTRATOR") return jsonError(403, "FORBIDDEN", "Administrator access is required.");

  const [programs, trainers] = await Promise.all([
    prisma.program.findMany({ where: { isPublished: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.trainerProfile.findMany({ where: { user: { role: "TRAINER" } }, orderBy: { user: { name: "asc" } }, select: { id: true, user: { select: { name: true } } } }),
  ]);

  return jsonData({ programs, trainers: trainers.map(({ id, user: trainer }) => ({ id, name: trainer.name })) });
}
