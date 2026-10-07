import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Practice Athletic Club — Move with purpose",
    template: "%s | Practice Athletic Club",
  },
  description:
    "A fictional neighborhood training club. Explore classes and try the complete member booking journey in a safe demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
