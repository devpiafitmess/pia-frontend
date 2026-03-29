import "server-only";

import { apiRequest } from "@lib/api/client";
import { getServerEnv } from "@lib/env";
import type { AuthResult, AuthSession, AuthUser } from "@/types/auth";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type Env = ReturnType<typeof getServerEnv>;

/**
 * Builds the base headers sent on every request to the backend auth API.
 * Accepts an optional `extra` map for request-specific headers (e.g.
 * Authorization for protected endpoints).
 */
function authHeaders(
  env: Env,
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    [env.internalApiKeyName]: env.internalApiKey,
    ...extra,
  };
}

function mapUser(raw: {
  id: string;
  email: string | null;
  phone: string | null;
  role: "subscriber" | "admin";
}): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    phone: raw.phone,
    role: raw.role,
  };
}

function mapSession(raw: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt?: number | null;
}): AuthSession {
  return {
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    expiresIn: raw.expiresIn,
    expiresAt: raw.expiresAt ?? null,
  };
}

async function parseAuthResult(response: Response): Promise<AuthResult> {
  const data = await response.json();
  return {
    user: mapUser(data.user),
    session: mapSession(data.session),
  };
}

// ---------------------------------------------------------------------------
// Auth service functions
// ---------------------------------------------------------------------------

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<AuthResult> {
  const env = getServerEnv();

  const response = await apiRequest({
    service: "auth",
    baseUrl: env.apiBaseUrl,
    path: "/v1/auth/login",
    method: "POST",
    headers: authHeaders(env),
    body: JSON.stringify({ email, password }),
  });

  return parseAuthResult(response);
}

export async function logoutSession(accessToken: string): Promise<void> {
  const env = getServerEnv();

  await apiRequest({
    service: "auth",
    baseUrl: env.apiBaseUrl,
    path: "/v1/auth/logout",
    method: "POST",
    headers: authHeaders(env, { Authorization: `Bearer ${accessToken}` }),
  });
}

export async function refreshSession(refreshToken: string): Promise<AuthResult> {
  const env = getServerEnv();

  const response = await apiRequest({
    service: "auth",
    baseUrl: env.apiBaseUrl,
    path: "/v1/auth/refresh",
    method: "POST",
    headers: authHeaders(env),
    body: JSON.stringify({ refreshToken }),
  });

  return parseAuthResult(response);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const env = getServerEnv();

  await apiRequest({
    service: "auth",
    baseUrl: env.apiBaseUrl,
    path: "/v1/auth/forgot-password",
    method: "POST",
    headers: authHeaders(env),
    body: JSON.stringify({ email }),
  });
}
