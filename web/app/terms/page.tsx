import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return <LegalPage eyebrow="Fictional portfolio notice" title="Terms of the demo." intro="Practice Athletic Club is fictional. These plain-language demo terms explain the limited behavior of this portfolio experience; they are not a real membership agreement or legal advice." sections={[
    { title: "Demo membership", body: <p>Choosing a plan creates a fictional member profile for testing the application only. No payment is collected and there is no charge, card, invoice, billing, or recurring subscription.</p> },
    { title: "Reservations", body: <p>Class availability may change. The server checks eligibility, capacity, duplicate reservations, schedule conflicts, and the configured booking cutoff when you submit an action.</p> },
    { title: "Waitlist", body: <p>Waitlist order is managed by the application. A position is a snapshot and may change as eligible members are promoted.</p> },
    { title: "Cancellation", body: <p>Each class has its own configured cutoff. A cancellation request is accepted or rejected by the server using the current class state.</p> },
    { title: "Fictional data", body: <p>Names, classes, trainers, and membership information are fictional examples. Do not enter real health information, payment details, or sensitive personal data.</p> },
  ]} />;
}
