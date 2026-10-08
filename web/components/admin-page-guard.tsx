import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authBaseUrl } from "@/lib/server/auth";

export async function AdminPageGuard({ returnTo, children }: { returnTo: string; children: React.ReactNode }) {
  const requestHeaders = await headers();
  let response: Response;
  try {
    response = await fetch(new URL("/api/v1/admin/sessions", authBaseUrl), {
      headers: { cookie: requestHeaders.get("cookie") ?? "" },
      cache: "no-store",
    });
  } catch {
    return <div className="admin-state admin-state-error" role="alert">We couldn’t confirm administrator access. Refresh to try again.</div>;
  }

  if (response.status === 401) redirect(`/portal/login?returnTo=${encodeURIComponent(returnTo)}`);
  if (response.status === 403) return <div className="admin-state admin-state-error" role="alert">Administrator access is required for this workspace.</div>;
  if (!response.ok) return <div className="admin-state admin-state-error" role="alert">The operations workspace is temporarily unavailable. Refresh to try again.</div>;
  return children;
}
