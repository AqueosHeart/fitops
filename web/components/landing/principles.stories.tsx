import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import "./landing.css";
import { LandingPrinciples } from "./principles";

const meta = {
  title: "Landing/Principles",
  component: LandingPrinciples,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <div className="landing-theme"><Story /></div>],
} satisfies Meta<typeof LandingPrinciples>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PracticeRibbon: Story = {};
