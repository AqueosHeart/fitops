import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LandingTeam } from "./team";

const meta = {
  title: "Landing/Team",
  component: LandingTeam,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LandingTeam>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CoachCarousel: Story = {};
