import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LandingCompletePreview } from "./complete-preview";

const meta = {
  title: "Landing/Complete preview",
  component: LandingCompletePreview,
  tags: ["autodocs"],
} satisfies Meta<typeof LandingCompletePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FullPage: Story = {};
