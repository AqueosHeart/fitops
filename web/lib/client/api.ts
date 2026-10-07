export type ApiEnvelope<T> = { data: T };

export type ApiFailure = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string[]>;
    requestId?: string;
  };
};

export class ApiError extends Error {
  code: string;
  status: number;
  fields?: Record<string, string[]>;
  requestId?: string;

  constructor(status: number, body: ApiFailure) {
    super(body.error?.message ?? "Something went wrong. Please try again.");
    this.name = "ApiError";
    this.status = status;
    this.code = body.error?.code ?? "INTERNAL_ERROR";
    this.fields = body.error?.fields;
    this.requestId = body.error?.requestId;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        ...(init?.body ? { "content-type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, { error: { code: "NETWORK_ERROR", message: "We could not reach the club right now." } });
  }

  if (response.status === 204) return undefined as T;
  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T> & ApiFailure;
  if (!response.ok) throw new ApiError(response.status, body);
  return body.data;
}

export function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}

export function errorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "We could not complete that request. Please try again.";
  const messages: Record<string, string> = {
    UNAUTHENTICATED: "Your session has ended. Sign in again to continue.",
    FORBIDDEN: "This action needs an active member profile.",
    MEMBERSHIP_INACTIVE: "This demo membership is inactive. Booking is unavailable.",
    WAIVER_REQUIRED: "Please review and accept the liability waiver before booking.",
    SESSION_NOT_FOUND: "This session is no longer available.",
    ALREADY_BOOKED: "You already have a reservation for this session.",
    ALREADY_WAITING: "You are already on this session’s waitlist.",
    BOOKING_CONFLICT: "This session overlaps another confirmed reservation.",
    SESSION_FULL: "This session just filled. Refresh to join the waitlist.",
    SEAT_AVAILABLE: "A place just opened. Refresh the schedule to book it.",
    BOOKING_CUTOFF_PASSED: "The booking or cancellation cutoff has passed.",
    WAITLIST_ALREADY_PROMOTED: "You’ve been moved into a confirmed reservation.",
    INVALID_CREDENTIALS: "We couldn’t match that email and password.",
    EMAIL_ALREADY_REGISTERED: "That email already has a demo account. Try signing in.",
    INVALID_PLAN_CODE: "Choose one of the available demo plans.",
    CONSENT_REQUIRED: "Please accept the terms, privacy notice, and waiver to continue.",
    INVALID_RETURN_TO: "That destination is unavailable. Please start again from the schedule.",
    VALIDATION_FAILED: "Check the highlighted details and try again.",
  };
  return messages[error.code] ?? error.message;
}

export function friendlyError(error: unknown): string {
  if (!(error instanceof ApiError)) return errorMessage(error);
  const message = errorMessage(error);
  return error.requestId ? `${message} Reference: ${error.requestId}` : message;
}
