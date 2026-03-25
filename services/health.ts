import "server-only";

import { apiRequest } from "@/lib/api/client";
import { getServerEnv } from "@/lib/env";
import type { HealthCheckResult } from "@/types/health";

async function readHealthPayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function getHealthStatus(): Promise<HealthCheckResult> {
  const env = getServerEnv();
  const response = await apiRequest({
    service: "health",
    baseUrl: env.apiBaseUrl,
    headers: {
      [env.internalApiKeyName]: env.internalApiKey,
    },
    path: "/health",
  });

  return {
    ok: true,
    status: response.status,
    upstreamUrl: response.url,
    checkedAt: new Date().toISOString(),
    payload: await readHealthPayload(response),
  };
}
