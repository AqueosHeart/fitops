import { LegalPage } from "@/components/legal-page";

export default function AboutPage() {
  return <LegalPage eyebrow="About Practice" title="A club built around showing up." intro="Practice Athletic Club is a fictional neighborhood training studio created as a portfolio product. It is not a real gym and does not take real memberships." sections={[{ title: "Our approach", body: <p>Clear coaching, small-group energy, and progress that respects the person doing the work. The sample schedule and member experience are powered by fictional data in a local demo environment.</p> }, { title: "A product in practice", body: <p>This project demonstrates a booking product with server-side authentication, class capacity, waitlists, and cancellation rules. It is not a service or offer for sale.</p> }]} />;
}
