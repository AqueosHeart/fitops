import Link from "next/link";

import { SiteHeader } from "@/components/site-shell";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <>
    <SiteHeader />
    <nav className="admin-nav" aria-label="Administrator navigation">
      <Link href="/admin">Overview</Link>
      <Link href="/admin/sessions">Sessions</Link>
      <span>Operations workspace</span>
    </nav>
    <main className="admin-main">{children}</main>
  </>;
}
