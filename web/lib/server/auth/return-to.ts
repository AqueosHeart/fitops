import "server-only";

const allowedPaths = new Set(["/app", "/app/schedule", "/app/bookings", "/app/profile/security"]);

export function parseReturnTo(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0 || value.length > 200) {
    return null;
  }

  // Reject ASCII controls in return paths; the control characters are intentional here.
  // eslint-disable-next-line no-control-regex
  if (value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(value);
    if (decoded !== value || decoded.startsWith("//") || decoded.includes("\\")) {
      return null;
    }
  } catch {
    return null;
  }

  return allowedPaths.has(value) ? value : null;
}
