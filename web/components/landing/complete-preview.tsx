import { LandingHeader } from "./header";
import { LandingContent } from "./content";
import { LandingFooter } from "./footer";

/** Composed design review; individual sections use the same production-ready components. */
export function LandingCompletePreview() {
  return <div className="landing-page">
    <LandingHeader />
    <main>
      <LandingContent />
    </main>
    <LandingFooter />
  </div>;
}
