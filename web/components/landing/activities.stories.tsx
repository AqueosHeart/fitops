import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LandingActivities } from "./activities";

const meta = {
  title: "Landing/Activities",
  component: LandingActivities,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LandingActivities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditorialCarousel: Story = {};
