import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return <LegalPage eyebrow="Fictional portfolio notice" title="Privacy in this demo." intro="This portfolio experience is designed for fictional data only. It does not represent a real gym, membership, or privacy policy for a commercial service." sections={[
    { title: "Account and reservation data", body: <p>A demo account stores the name and email you enter, a securely hashed password, selected fictional plan, consent timestamps, and booking or waitlist records needed to demonstrate the product.</p> },
    { title: "No health or payment data", body: <p>The demo does not ask for PAR-Q answers or store health information. Plan selection does not collect card details or create a payment, bill, or real subscription.</p> },
    { title: "Session cookie", body: <p>An essential HTTP-only session cookie maintains sign-in for the member workspace. The application does not need advertising or cross-site tracking cookies for the demo journey.</p> },
    { title: "Your choices", body: <p>Use a fictional email and password. Do not enter information belonging to a real member or customer. Demo data may be reset as part of development.</p> },
  ]} />;
}
