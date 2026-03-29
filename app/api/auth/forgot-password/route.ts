import { NextResponse } from "next/server";

import { ApiRequestError } from "@lib/api/errors";
import { handleApiError } from "@lib/api/route-error";
import { logServerEvent } from "@lib/logger";
import { requestPasswordReset } from "@services/auth";

export async function POST(request: Request) {
  let email: string | undefined;

  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim() : undefined;
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la solicitud inválido", code: "invalid_json" },
      { status: 400 },
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "El correo es requerido", code: "invalid_payload" },
      { status: 400 },
    );
  }

  try {
    await requestPasswordReset(email);
    logServerEvent("auth.forgot-password", {});
    // Always return success to avoid leaking whether an email is registered.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Surface genuine payload errors (400) but swallow everything else to
    // avoid user enumeration — consistent with the backend's behaviour.
    if (error instanceof ApiRequestError && error.details.status === 400) {
      return handleApiError("auth.forgot-password", error);
    }
    // Any non-400 error (including network failures) is treated as success
    // from the client's perspective.
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
