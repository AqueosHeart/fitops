import "server-only";

import { updateClassSession } from "@/lib/server/scheduling/update-class-session";

export type ChangeSessionCapacityResult =
  | { code: "CAPACITY_UPDATED"; promotedMemberIds: string[] }
  | { code: "SESSION_NOT_FOUND" | "SESSION_UNAVAILABLE" | "INVALID_CAPACITY" | "CAPACITY_BELOW_CONFIRMED" | "CUTOFF_PASSED" | "CAPACITY_INCREASE_BLOCKED" };

export async function changeSessionCapacity(sessionId: string, capacity: number): Promise<ChangeSessionCapacityResult> {
  const result = await updateClassSession(sessionId, { capacity });
  if (result.code === "SESSION_UPDATED") return { code: "CAPACITY_UPDATED", promotedMemberIds: result.promotedMemberIds };
  switch (result.code) {
    case "SESSION_NOT_FOUND": return { code: "SESSION_NOT_FOUND" };
    case "SESSION_UNAVAILABLE": return { code: "SESSION_UNAVAILABLE" };
    case "INVALID_CAPACITY": return { code: "INVALID_CAPACITY" };
    case "CAPACITY_BELOW_CONFIRMED": return { code: "CAPACITY_BELOW_CONFIRMED" };
    case "CUTOFF_PASSED": return { code: "CUTOFF_PASSED" };
    case "CAPACITY_INCREASE_BLOCKED": return { code: "CAPACITY_INCREASE_BLOCKED" };
    default: throw new Error(`Unexpected capacity-only result: ${result.code}`);
  }
}
