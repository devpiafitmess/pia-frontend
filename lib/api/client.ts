import "server-only";

import { ApiRequestError } from "@lib/api/errors";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  baseUrl: string;
  path: string;
  service: string;
};

function buildUrl(baseUrl: string, path: string) {
  return new URL(path, `${baseUrl.replace(/\/+$/, "")}/`).toString();
}

export async function apiRequest({
  baseUrl,
  path,
  service,
  headers,
  method = "GET",
  ...init
}: ApiRequestOptions) {
  const url = buildUrl(baseUrl, path);
  const response = await fetch(url, {
    ...init,
    method,
    cache: "no-store",
    headers: {
      Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
      ...headers,
    },
  });

  if (!response.ok) {
    throw new ApiRequestError({
      service,
      method,
      url,
      status: response.status,
      body: await response.text(),
    });
  }

  return response;
}
