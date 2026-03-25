import "server-only";

export type ApiRequestErrorDetails = {
  service: string;
  method: string;
  url: string;
  status: number;
  body: string;
};

export class ApiRequestError extends Error {
  readonly details: ApiRequestErrorDetails;

  constructor(details: ApiRequestErrorDetails) {
    super(
      `[${details.service}] ${details.method} ${details.url} failed with ${details.status}`,
    );
    this.name = "ApiRequestError";
    this.details = details;
  }
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected error";
}
