import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LandingClosingInvitation } from "./closing";

const meta = {
  title: "Landing/Closing invitation",
  component: LandingClosingInvitation,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LandingClosingInvitation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Invitation: Story = {};
