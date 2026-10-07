import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authBaseUrl } from "@/lib/server/auth";

export async function MemberPageGuard({ returnTo, children }: { returnTo: string; children: React.ReactNode }) {
  const requestHeaders = await headers();
  let response: Response;
  try {
    response = await fetch(new URL("/api/v1/me/membership", authBaseUrl), {
      headers: { cookie: requestHeaders.get("cookie") ?? "" },
      cache: "no-store",
    });
  } catch {
    return <div className="schedule-state state-error" role="alert">We couldn’t confirm your member session. Refresh to try again.</div>;
  }

  if (response.status === 401) redirect(`/portal/login?returnTo=${encodeURIComponent(returnTo)}`);
  if (response.status === 403) return <div className="schedule-state state-error" role="alert">This account needs a member profile before it can use the member workspace.</div>;
  if (!response.ok) return <div className="schedule-state state-error" role="alert">The member workspace is temporarily unavailable. Refresh to try again.</div>;
  return children;
}
