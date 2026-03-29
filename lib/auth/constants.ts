/**
 * Auth cookie names, durations, and routing constants.
 *
 * This file must remain runtime-agnostic (no `import "server-only"`) so it
 * can be consumed by both server-only modules (lib/auth/cookies.ts) and the
 * Edge runtime (middleware.ts) and client components (e.g. Login).
 */

// ---------------------------------------------------------------------------
// Cookie names
// ---------------------------------------------------------------------------

export const AUTH_COOKIE = {
  /** JWT access token — short-lived (matches backend expiresIn). */
  AT: "pia_at",
  /** Refresh token — long-lived (30 days). */
  RT: "pia_rt",
  /** Access token expiry as a Unix timestamp (seconds). Used by middleware
   *  to detect expiry without decoding the JWT. */
  EXP: "pia_exp",
  /** Serialized AuthUser JSON. Non-sensitive; used by server layouts to
   *  read the current user without hitting the backend on every render. */
  USER: "pia_user",
} as const;

// ---------------------------------------------------------------------------
// Cookie durations (seconds)
// ---------------------------------------------------------------------------

export const COOKIE_MAX_AGE = {
  /** 30 days — applied to refresh token and user profile cookie. */
  THIRTY_DAYS: 60 * 60 * 24 * 30,
} as const;

// ---------------------------------------------------------------------------
// Refresh behaviour
// ---------------------------------------------------------------------------

/**
 * Milliseconds before actual expiry at which the middleware proactively
 * refreshes the access token. Prevents edge cases where a token expires
 * between the middleware check and the downstream API call.
 */
export const REFRESH_BUFFER_MS = 60 * 1_000; // 60 seconds

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

/**
 * The first authenticated route a user lands on after login or token refresh.
 * Used in middleware and Login to keep the redirect target consistent.
 */
export const APP_HOME = "/dashboard" as const;
