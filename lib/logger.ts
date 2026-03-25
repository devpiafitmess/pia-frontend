import "server-only";

export function logServerEvent(
  event: string,
  metadata: Record<string, unknown>,
) {
  console.info(`[server] ${event}`, metadata);
}

export function logServerError(
  event: string,
  metadata: Record<string, unknown>,
) {
  console.error(`[server] ${event}`, metadata);
}
