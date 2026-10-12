import { LandingHero } from "./hero";
import { LandingPrinciples } from "./principles";
import { LandingFacilities } from "./facilities";
import { LandingActivities } from "./activities";
import { LandingPlans } from "./plans";
import { LandingTeam } from "./team";
import { LandingClosingInvitation } from "./closing";

/** Shared section composition for the real homepage and its Storybook preview. */
export function LandingContent() {
  return <>
    <LandingHero />
    <LandingPrinciples />
    <LandingFacilities />
    <LandingActivities />
    <LandingPlans />
    <LandingTeam />
    <LandingClosingInvitation />
  </>;
}
