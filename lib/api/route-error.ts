import "server-only";

import { NextResponse } from "next/server";

import { ApiRequestError } from "@lib/api/errors";
import { logServerError } from "@lib/logger";

type BackendErrorBody = { error: string; code: string };

function parseBackendError(raw: ApiRequestError): BackendErrorBody | null {
  try {
    return JSON.parse(raw.details.body) as BackendErrorBody;
  } catch {
    return null;
  }
}

/**
 * Converts any thrown error from a service call into an appropriate
 * NextResponse.
 *
 * - If the error is an ApiRequestError with a parseable backend body,
 *   that body (error + code) is forwarded with the original HTTP status.
 * - If the body cannot be parsed, `fallback` is returned with the original
 *   HTTP status.
 * - Any other error is logged and returned as a generic 500.
 *
 * @param context  Short label used in server logs (e.g. "auth.login").
 * @param error    The caught error value.
 * @param fallback Human-readable message when the backend body is unreadable.
 */
export function handleApiError(
  context: string,
  error: unknown,
  fallback = "Error al procesar la solicitud",
): NextResponse {
  if (error instanceof ApiRequestError) {
    const body = parseBackendError(error);
    if (body) {
      return NextResponse.json(body, { status: error.details.status });
    }
    return NextResponse.json(
      { error: fallback, code: "internal_error" },
      { status: error.details.status },
    );
  }

  logServerError(context, { error: String(error) });
  return NextResponse.json(
    { error: "Error interno del servidor", code: "internal_error" },
    { status: 500 },
  );
}
