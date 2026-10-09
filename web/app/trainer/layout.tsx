import { SiteHeader } from "@/components/site-shell";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader mode="trainer" /><main className="trainer-main">{children}</main></>;
}
