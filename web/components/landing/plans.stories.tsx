import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import "./landing.css";
import { LandingPlans } from "./plans";

const meta = {
  title: "Landing/Plans",
  component: LandingPlans,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="landing-theme"><Story /></div>],
} satisfies Meta<typeof LandingPlans>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MembershipPreview: Story = {};
