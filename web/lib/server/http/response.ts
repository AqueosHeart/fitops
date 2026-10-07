import "server-only";

import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_FAILED"
  | "ORIGIN_FORBIDDEN"
  | "INTERNAL_ERROR";

export function jsonData(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonError(
  status: number,
  code: ApiErrorCode | string,
  message: string,
  fields?: Record<string, string[]>,
) {
  return NextResponse.json(
    { error: { code, message, ...(fields && Object.keys(fields).length ? { fields } : {}) } },
    { status },
  );
}

export function unexpectedError() {
  const requestId = randomUUID();
  console.error(JSON.stringify({ event: "api.unexpected_error", requestId }));
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred.", requestId } },
    { status: 500 },
  );
}
