import "server-only";

import { z } from "zod";

export async function parseJsonBody<T extends z.ZodType>(request: Request, schema: T) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && (!Number.isSafeInteger(Number(contentLength)) || Number(contentLength) > 16_384)) {
    return { success: false as const, fields: { body: ["Request body is too large."] } };
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (Buffer.byteLength(text, "utf8") > 16_384) {
      return { success: false as const, fields: { body: ["Request body is too large."] } };
    }
    body = JSON.parse(text);
  } catch {
    return { success: false as const, fields: { body: ["Request body must be valid JSON."] } };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { success: false as const, fields: z.flattenError(parsed.error).fieldErrors };
  }

  return { success: true as const, data: parsed.data };
}
