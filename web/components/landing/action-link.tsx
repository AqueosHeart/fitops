import Link from "next/link";
import type { ComponentProps } from "react";

type ActionLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "outline";
  size?: "medium" | "large";
};

export function ActionLink({ variant = "primary", size = "large", className = "", ...props }: ActionLinkProps) {
  return <Link className={`button landing-action landing-action-${variant} landing-action-${size} ${className}`} {...props} />;
}
