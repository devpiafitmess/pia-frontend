import { NextResponse } from "next/server";

import { logServerEvent, logServerError } from "@lib/logger";
import { logoutSession } from "@services/auth";
import { clearAuthCookies, getAuthCookies } from "@lib/auth/cookies";

export async function POST() {
  const { accessToken } = await getAuthCookies();

  try {
    if (accessToken) {
      await logoutSession(accessToken);
    }
    await clearAuthCookies();
    logServerEvent("auth.logout", {});
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Always clear local cookies even if the backend call fails (e.g. expired
    // token). The user ends up logged out regardless.
    await clearAuthCookies();
    logServerError("auth.logout", { error: String(error) });
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
