import { SiteHeader } from "@/components/site-shell";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <>
    <SiteHeader mode="admin" />
    <main className="admin-main">{children}</main>
  </>;
}
