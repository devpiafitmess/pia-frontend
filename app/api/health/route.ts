import { getHealthStatus } from "@/services/health";
import { ApiRequestError, getErrorMessage } from "@/lib/api/errors";
import { logServerError, logServerEvent } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getHealthStatus();

    logServerEvent("health.success", {
      upstreamUrl: result.upstreamUrl,
      status: result.status,
    });

    return Response.json(result);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      logServerError("health.upstream_failure", error.details);

      return Response.json(
        {
          ok: false,
          message: "Health check failed",
          status: error.details.status,
          upstreamUrl: error.details.url,
          details:
            process.env.NODE_ENV === "development"
              ? error.details.body
              : undefined,
        },
        { status: 502 },
      );
    }

    const message = getErrorMessage(error);

    logServerError("health.unexpected_failure", { message });

    return Response.json(
      {
        ok: false,
        message,
      },
      { status: 500 },
    );
  }
}
