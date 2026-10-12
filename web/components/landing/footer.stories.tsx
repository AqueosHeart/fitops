import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LandingFooter } from "./footer";

const meta = {
  title: "Landing/Footer",
  component: LandingFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LandingFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicFooter: Story = {};
