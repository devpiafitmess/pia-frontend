import { NextResponse } from "next/server";

import { logServerEvent } from "@lib/logger";
import { handleApiError } from "@lib/api/route-error";
import { loginWithCredentials } from "@services/auth";
import { setAuthCookies } from "@lib/auth/cookies";

export async function POST(request: Request) {
  let email: string | undefined;
  let password: string | undefined;

  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim() : undefined;
    password = typeof body.password === "string" ? body.password : undefined;
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la solicitud inválido", code: "invalid_json" },
      { status: 400 },
    );
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "Correo y contraseña son requeridos", code: "invalid_payload" },
      { status: 400 },
    );
  }

  try {
    const { user, session } = await loginWithCredentials(email, password);
    await setAuthCookies(user, session);
    logServerEvent("auth.login", { userId: user.id, role: user.role });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return handleApiError("auth.login", error, "Error al iniciar sesión");
  }
}
