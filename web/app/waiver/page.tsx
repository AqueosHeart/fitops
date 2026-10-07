import { LegalPage } from "@/components/legal-page";

export default function WaiverPage() {
  return <LegalPage eyebrow="Fictional portfolio notice" title="Liability waiver demo." intro="This screen demonstrates a consent step only. It is not a real release, medical form, or substitute for advice from a qualified professional." sections={[
    { title: "Participation information", body: <p>Exercise involves physical activity and may carry risk. In a real facility, members would receive appropriate information and make an informed decision with the club before participating.</p> },
    { title: "Readiness acknowledgement", body: <p>For this demo, accepting the acknowledgement records a timestamp on the fictional profile. It does not ask about symptoms or store health answers.</p> },
    { title: "Sample release", body: <p>Because Practice Athletic Club is fictional, this page does not create a legal release or authorize participation at any real location.</p> },
  ]} />;
}
