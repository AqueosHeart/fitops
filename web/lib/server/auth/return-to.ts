import "server-only";

const allowedPaths = new Set(["/app", "/app/schedule", "/app/bookings", "/app/profile/security"]);
const adminSessionPath = /^\/admin\/sessions\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/(edit|participants)$/i;

function isSafeRelativePath(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 200) return false;

  // Reject ASCII controls in return paths; the control characters are intentional here.
  // eslint-disable-next-line no-control-regex
  if (value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) return false;

  try {
    const decoded = decodeURIComponent(value);
    return decoded === value && !decoded.startsWith("//") && !decoded.includes("\\");
  } catch {
    return false;
  }
}

export function parseReturnTo(value: unknown): string | null {
  return isSafeRelativePath(value) && allowedPaths.has(value) ? value : null;
}

export function parseAdminReturnTo(value: unknown): string | null {
  if (!isSafeRelativePath(value)) return null;
  return value === "/admin" || value === "/admin/sessions" || value === "/admin/sessions/new" || adminSessionPath.test(value)
    ? value
    : null;
}
