export type HealthCheckResult = {
  ok: boolean;
  status: number;
  upstreamUrl: string;
  checkedAt: string;
  payload: unknown;
};
