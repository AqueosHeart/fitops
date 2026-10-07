import { jsonData } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const programs = await prisma.program.findMany({
    where: { isPublished: true },
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, description: true, intensity: true, durationMinutes: true },
  });
  return jsonData({ programs });
}
