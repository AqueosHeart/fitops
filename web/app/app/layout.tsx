import { SiteHeader } from "@/components/site-shell";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return <><SiteHeader member /><main className="member-main">{children}</main></>;
}
