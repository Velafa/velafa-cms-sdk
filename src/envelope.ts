import { CLIENT_ERRORS } from "./constants/index.js";
import { throwClientError } from "./errors.js";
import type { ApiEnvelope } from "./types/index.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseEnvelope(body: unknown): ApiEnvelope<unknown> {
  if (!isRecord(body)) {
    throwClientError(CLIENT_ERRORS.INVALID_RESPONSE);
  }

  if (typeof body.success !== "boolean" || typeof body.message !== "string") {
    throwClientError(CLIENT_ERRORS.INVALID_RESPONSE);
  }

  return {
    success: body.success,
    message: body.message,
    data: "data" in body ? body.data : undefined,
    code: typeof body.code === "string" ? body.code : undefined,
  };
}

export function unwrapEnvelope<T>(
  envelope: ApiEnvelope<unknown>,
  status: number,
): T {
  if (!envelope.success) {
    throwClientError({
      code: envelope.code ?? CLIENT_ERRORS.INVALID_RESPONSE.code,
      status,
      message: envelope.message,
    });
  }
  if (envelope.data === undefined) {
    throwClientError(CLIENT_ERRORS.EMPTY_DATA);
  }
  // Trusted boundary: Atlas envelope `data` matches the caller's expected DTO.
  return envelope.data as T;
}
