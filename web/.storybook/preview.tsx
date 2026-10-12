import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";
import "../components/landing/landing.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
    a11y: { test: "error" },
    backgrounds: { options: { ink: { name: "Practice ink", value: "#111310" } } },
  },
  initialGlobals: { backgrounds: { value: "ink" } },
  decorators: [(Story) => <div className="landing-theme"><Story /></div>],
};

export default preview;
