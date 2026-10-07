import "server-only";

import { auth } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export type CurrentUser = NonNullable<
  Awaited<ReturnType<typeof prisma.user.findUnique>>
> & {
  memberProfile: Awaited<ReturnType<typeof prisma.memberProfile.findUnique>>;
  trainerProfile: Awaited<ReturnType<typeof prisma.trainerProfile.findUnique>>;
};

export async function resolveCurrentUser(headers: Headers): Promise<CurrentUser | null> {
  const resolved = await auth.api.getSession({ headers });

  if (!resolved) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: resolved.user.id },
    include: { memberProfile: true, trainerProfile: true },
  });

  if (!user || resolved.session.authVersion !== user.authVersion) {
    return null;
  }

  return user;
}
