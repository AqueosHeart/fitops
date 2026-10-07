import "server-only";

export function copySetCookies(source: Headers, destination: Headers) {
  const extended = source as Headers & { getSetCookie?: () => string[] };
  const cookies = extended.getSetCookie?.() ?? (source.get("set-cookie") ? [source.get("set-cookie")!] : []);
  for (const cookie of cookies) {
    destination.append("set-cookie", cookie);
  }
}
