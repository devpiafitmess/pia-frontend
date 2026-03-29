import "server-only";

import { cookies } from "next/headers";

import type { AuthUser, AuthSession } from "@/types/auth";
import { AUTH_COOKIE, COOKIE_MAX_AGE } from "@lib/auth/constants";

// ---------------------------------------------------------------------------
// Cookie options
// ---------------------------------------------------------------------------

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function setAuthCookies(
  user: AuthUser,
  session: AuthSession,
): Promise<void> {
  const store = await cookies();

  store.set(AUTH_COOKIE.AT, session.accessToken, cookieOptions(session.expiresIn));
  store.set(AUTH_COOKIE.RT, session.refreshToken, cookieOptions(COOKIE_MAX_AGE.THIRTY_DAYS));

  if (session.expiresAt != null) {
    store.set(
      AUTH_COOKIE.EXP,
      String(session.expiresAt),
      cookieOptions(COOKIE_MAX_AGE.THIRTY_DAYS),
    );
  }

  store.set(
    AUTH_COOKIE.USER,
    JSON.stringify(user),
    cookieOptions(COOKIE_MAX_AGE.THIRTY_DAYS),
  );
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  for (const name of Object.values(AUTH_COOKIE)) {
    store.set(name, "", cookieOptions(0));
  }
}

export type StoredAuthCookies = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: AuthUser | null;
};

export async function getAuthCookies(): Promise<StoredAuthCookies> {
  const store = await cookies();

  const accessToken = store.get(AUTH_COOKIE.AT)?.value ?? null;
  const refreshToken = store.get(AUTH_COOKIE.RT)?.value ?? null;
  const expRaw = store.get(AUTH_COOKIE.EXP)?.value ?? null;
  const userRaw = store.get(AUTH_COOKIE.USER)?.value ?? null;

  const expiresAt = expRaw != null ? Number(expRaw) : null;

  let user: AuthUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as AuthUser;
    } catch {
      // Malformed cookie — treat as unauthenticated
    }
  }

  return { accessToken, refreshToken, expiresAt, user };
}
