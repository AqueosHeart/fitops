import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionLink } from "./action-link";
import { LandingHeader } from "./header";
import { LandingHero } from "./hero";

const meta = {
  title: "Landing/First section",
  component: LandingHero,
  tags: ["autodocs"],
} satisfies Meta<typeof LandingHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hero: Story = {};
export const Navigation: Story = { render: () => <LandingHeader /> };
export const NavigationAndHero: Story = { render: () => <div className="landing-page"><LandingHeader /><main><LandingHero /></main></div> };
export const Actions: Story = {
  render: () => <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 32 }}>
    <ActionLink href="/join" size="medium">Join now</ActionLink>
    <ActionLink href="/#programs">Explore activities</ActionLink>
    <ActionLink href="/#facilities" variant="outline">Explore the club</ActionLink>
  </div>,
};
