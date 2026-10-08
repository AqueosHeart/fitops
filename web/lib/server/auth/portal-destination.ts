import { parseAdminReturnTo, parseReturnTo } from "@/lib/server/auth/return-to";

type PortalUser = {
  role: "MEMBER" | "TRAINER" | "ADMINISTRATOR";
  memberProfile: unknown;
};

export function getPortalDestination(user: PortalUser, requestedReturnTo: unknown): string {
  const adminDestination = parseAdminReturnTo(requestedReturnTo);
  if (adminDestination && user.role === "ADMINISTRATOR") return adminDestination;

  const memberDestination = parseReturnTo(requestedReturnTo);
  if (memberDestination && user.memberProfile) return memberDestination;

  if (user.memberProfile) return "/app";
  if (user.role === "ADMINISTRATOR") return "/admin";
  if (user.role === "TRAINER") return "/trainer/sessions";
  return "/app";
}
