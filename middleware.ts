import { NextRequest, NextResponse } from "next/server";

import type { AuthUser, AuthSession } from "@/types/auth";
import {
  APP_HOME,
  AUTH_COOKIE,
  COOKIE_MAX_AGE,
  REFRESH_BUFFER_MS,
} from "@lib/auth/constants";

// ---------------------------------------------------------------------------
// Route classification
// ---------------------------------------------------------------------------

/**
 * URL path prefixes that require an authenticated session.
 * Add new protected sections here as the (app)/ route group grows.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/perfil",
  "/entrenos",
  "/planes",
  "/retos",
  "/progreso",
];

/**
 * Exact paths that belong to the unauthenticated auth flow.
 * Authenticated users are redirected away from these.
 */
const AUTH_PATHS = new Set(["/", "/register", "/forgot", "/reset-password"]);

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.has(pathname);
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

/**
 * Builds cookie options. Cannot import from lib/auth/cookies.ts because that
 * file is server-only and the middleware runs in the Edge runtime.
 */
function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

/**
 * Writes refreshed auth cookies onto a NextResponse.
 * Extracted to keep tryRefresh readable.
 */
function writeAuthCookies(
  response: NextResponse,
  user: AuthUser,
  session: AuthSession,
) {
  response.cookies.set(
    AUTH_COOKIE.AT,
    session.accessToken,
    cookieOptions(session.expiresIn),
  );
  response.cookies.set(
    AUTH_COOKIE.RT,
    session.refreshToken,
    cookieOptions(COOKIE_MAX_AGE.THIRTY_DAYS),
  );
  if (session.expiresAt != null) {
    response.cookies.set(
      AUTH_COOKIE.EXP,
      String(session.expiresAt),
      cookieOptions(COOKIE_MAX_AGE.THIRTY_DAYS),
    );
  }
  response.cookies.set(
    AUTH_COOKIE.USER,
    JSON.stringify(user),
    cookieOptions(COOKIE_MAX_AGE.THIRTY_DAYS),
  );
}

/**
 * Copies all cookies from `source` onto `target`.
 * Used to carry refreshed cookies through to a redirect response.
 */
function transferCookies(source: NextResponse, target: NextResponse) {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite as "strict" | "lax" | "none",
      path: cookie.path ?? "/",
      maxAge: cookie.maxAge,
    });
  }
}

// ---------------------------------------------------------------------------
// Silent token refresh
// ---------------------------------------------------------------------------

type RefreshApiResponse = {
  user: AuthUser;
  session: AuthSession & { expiresAt: number | null };
};

/**
 * Calls the backend refresh endpoint and, on success, returns a NextResponse
 * with the updated auth cookies already set.
 *
 * Returns null if the refresh fails for any reason (expired refresh token,
 * network error, missing env vars, etc.).
 *
 * This runs in the Edge runtime so it cannot import server-only modules —
 * env vars and fetch are used directly instead of lib/env and lib/api/client.
 */
async function tryRefresh(refreshToken: string): Promise<NextResponse | null> {
  const baseUrl = process.env.API_BASE_URL;
  const keyName = process.env.INTERNAL_API_KEY_NAME;
  const keyValue = process.env.INTERNAL_API_KEY;

  if (!baseUrl || !keyName || !keyValue) return null;

  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [keyName]: keyValue,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const { user, session } = (await res.json()) as RefreshApiResponse;

    const response = NextResponse.next();
    writeAuthCookies(response, user, session);
    return response;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const at = request.cookies.get(AUTH_COOKIE.AT)?.value;
  const rt = request.cookies.get(AUTH_COOKIE.RT)?.value;
  const expRaw = request.cookies.get(AUTH_COOKIE.EXP)?.value;

  // Proactively consider the token expired REFRESH_BUFFER_MS before its
  // actual expiry. This prevents a token from expiring between the middleware
  // check and the downstream API call.
  const expiresAtMs = expRaw != null ? Number(expRaw) * 1_000 : null;
  const isExpired =
    expiresAtMs != null
      ? Date.now() >= expiresAtMs - REFRESH_BUFFER_MS
      : !at; // no EXP cookie → assume missing/expired

  let isAuthenticated = !!at && !isExpired;

  // ---------------------------------------------------------------------------
  // Silent refresh — attempt when the session looks stale but a refresh token
  // is available. Keeps users logged in across the 1-hour access token window
  // without any client-side JavaScript.
  // ---------------------------------------------------------------------------
  if (!isAuthenticated && rt) {
    const refreshed = await tryRefresh(rt);

    if (refreshed) {
      if (isAuthPath(pathname)) {
        // Refresh succeeded on an auth page — move user into the app.
        const redirect = NextResponse.redirect(
          new URL(APP_HOME, request.url),
        );
        transferCookies(refreshed, redirect);
        return redirect;
      }
      // Refresh succeeded on a protected or neutral route — continue with
      // the updated cookies.
      return refreshed;
    }

    // Refresh failed (expired RT, revoked session, network error).
    // Fall through as unauthenticated.
    isAuthenticated = false;
  }

  // ---------------------------------------------------------------------------
  // Route guards
  // ---------------------------------------------------------------------------

  // Redirect authenticated users away from auth pages → app home.
  if (isAuthPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_HOME, request.url));
  }

  // Gate protected routes — redirect unauthenticated users to login and
  // preserve the intended destination so Login can redirect back after auth.
  if (isProtected(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon, icons, images, fonts served from /public
     *  - api/ routes (handled by their own route handlers)
     */
    "/((?!_next/static|_next/image|api/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|eot)).*)",
  ],
};
