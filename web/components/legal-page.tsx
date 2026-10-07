import Link from "next/link";
import { PublicLayout } from "@/components/site-shell";

export type LegalSection = { title: string; body: React.ReactNode };
export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: React.ReactNode; sections: LegalSection[] }) {
  return <PublicLayout><article className="legal-page"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><div>{section.body}</div></section>)}<p><Link className="inline-link" href="/">Return to Practice Athletic Club ↗</Link></p></article></PublicLayout>;
}
