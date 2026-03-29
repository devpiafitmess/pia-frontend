import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getAuthCookies } from "@lib/auth/cookies";

/**
 * Authoritative session guard for all routes inside the (app)/ group.
 *
 * The edge middleware performs a fast cookie-presence check and handles
 * silent token refresh. This layout is the second layer: it reads the
 * stored user cookie and redirects to "/" if the session is missing or
 * corrupt (e.g. the cookie was manually deleted after middleware ran).
 *
 * Child layouts and pages can obtain the authenticated user by calling
 * getAuthCookies() directly. Once the app shell grows, replace this with
 * a React context provider that passes the user down the tree.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const { user } = await getAuthCookies();

  if (!user) {
    redirect("/");
  }

  return <>{children}</>;
}
