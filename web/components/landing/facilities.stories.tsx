import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LandingFacilities } from "./facilities";

const meta = {
  title: "Landing/Facilities",
  component: LandingFacilities,
  tags: ["autodocs"],
} satisfies Meta<typeof LandingFacilities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spaces: Story = {};
