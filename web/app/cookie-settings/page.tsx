import { LegalPage } from "@/components/legal-page";

export default function CookieSettingsPage() {
  return <LegalPage eyebrow="Your privacy choices" title="Cookie preferences." intro="This demo uses an essential, HTTP-only session cookie for member sign-in. It does not use advertising or cross-site analytics cookies." sections={[{ title: "Essential session cookie", body: <p>Required to maintain a secure member session. It is set only when you sign in or register and is controlled by the server.</p> }, { title: "Optional tracking", body: <p>No optional advertising or cross-site tracking cookies are used by this demo, so there is nothing extra to enable or disable here.</p> }]} />;
}
