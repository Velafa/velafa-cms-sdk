import { ERROR_CODE, HTTP_STATUS } from "./constants/index.js";

export type ClientErrorDef = {
  code: string;
  status: number;
  message: string;
};

export class CmsApiError extends Error {
  readonly code: string | undefined;
  readonly status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "CmsApiError";
    this.status = status;
    this.code = code;
  }
}

export function throwClientError(
  error: ClientErrorDef,
  message?: string,
): never {
  throw new CmsApiError(message ?? error.message, error.status, error.code);
}

export function isCmsApiError(error: unknown): error is CmsApiError {
  return error instanceof CmsApiError;
}

export function isNotFoundError(error: unknown): boolean {
  if (!isCmsApiError(error)) {
    return false;
  }
  return (
    error.code === ERROR_CODE.RESOLVE_NOT_FOUND ||
    error.code === ERROR_CODE.DATA_FEED_NOT_FOUND ||
    error.code === ERROR_CODE.ARTIFACT_NOT_FOUND ||
    error.status === HTTP_STATUS.NOT_FOUND
  );
}

export function isResolveNotFound(error: unknown): boolean {
  return (
    isCmsApiError(error) && error.code === ERROR_CODE.RESOLVE_NOT_FOUND
  );
}
