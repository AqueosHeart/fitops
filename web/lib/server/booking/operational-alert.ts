import "server-only";

export function reportParticipationInvariant(input: { operation: "book" | "waitlist"; sessionId: string; memberId: string; confirmedCount: number; waitingCount: number }) {
  console.error("FITOPS_PARTICIPATION_INVARIANT_BROKEN", input);
}
