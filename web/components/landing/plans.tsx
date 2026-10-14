import { ActionLink } from "./action-link";
import "./plans.css";
import { ScrollHeading } from "./scroll-heading";

const plans = [
  {
    code: "base",
    name: "Base",
    subheading: "A place to begin.",
    featured: false,
  },
  {
    code: "complete",
    name: "Complete",
    subheading: "Make room for more.",
    featured: true,
  },
  {
    code: "training_plus",
    name: "Training Plus",
    subheading: "Keep building your practice.",
    featured: false,
  },
] as const;

export function LandingPlans() {
  return <section className="landing-plans" aria-labelledby="landing-plans-title">
    <div className="landing-plans-inner">
      <ScrollHeading id="landing-plans-title" lines={["Find your rhythm."]} />
      <p className="landing-plans-intro">Three ways into Practice. Choose your starting point.</p>

      <div className="landing-plans-grid">
        {plans.map((plan) => <article className={`landing-plan-card${plan.featured ? " landing-plan-card-featured" : ""}`} key={plan.code}>
          <h3>{plan.name}</h3>
          <p className="landing-plan-subheading">{plan.subheading}</p>
          <p className="landing-plan-description">Choose this fictional plan to create your demo member account.</p>
          <div className="landing-plan-divider" aria-hidden="true" />
          <ActionLink className="landing-plan-action" href={`/join?plan=${plan.code}`} size="large">Choose {plan.name}</ActionLink>
        </article>)}
      </div>
    </div>
  </section>;
}
