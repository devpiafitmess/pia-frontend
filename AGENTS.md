<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:architecture -->
# Architecture

Modular domain architecture with a services layer. Every new domain follows the same three-file pattern — no exceptions.

## Directory structure

```
app/
  (auth)/                        # Unauthenticated routes (login, register)
  (app)/                         # Protected routes — require valid session
    layout.tsx                   # Server component: validates session, redirects if missing
  api/
    [domain]/route.ts            # Thin route handler — delegates to services/, never contains logic
  layout.tsx
  globals.css

lib/
  api/
    client.ts                    # Base fetch wrapper (apiRequest). Server-only.
    errors.ts                    # ApiRequestError, getErrorMessage. Server-only.
  env.ts                         # getServerEnv() — reads and validates env vars. Server-only.
  logger.ts                      # logServerEvent, logServerError. Server-only.

services/
  [domain].ts                    # All server-side data access for a domain. Server-only.
                                 # One file per domain. Contains fetch logic + return types mapping.

types/
  [domain].ts                    # Shared TypeScript types for a domain (used by both server and client)

components/
  ui/                            # Shared UI components (Chakra UI based)

hooks/
  use-[domain].ts                # Client-side React hooks (SWR / React Query) per domain

middleware.ts                    # Edge middleware: refreshes Supabase session, redirects unauthenticated
                                 # requests away from (app)/ routes
```

## Adding a new domain

Create exactly three files:

1. `types/[domain].ts` — define the types
2. `services/[domain].ts` — implement server-side fetch functions using `apiRequest` from `lib/api/client`
3. `app/api/[domain]/route.ts` — thin handler that calls `services/[domain]` and returns `Response.json(...)`

If client-side data fetching is needed, add a fourth file: `hooks/use-[domain].ts`.

## Route protection

Two-layer model:

- **`middleware.ts` (Edge):** fast check — refreshes Supabase session cookie, redirects to `/login` if no valid session for `(app)/` routes.
- **`app/(app)/layout.tsx` (Server Component):** authoritative check — calls `services/auth` to verify session and role, redirects to `/unauthorized` if insufficient. Also provides the authenticated user to child layouts/pages.

Never protect routes only at the page level. Both layers must be present.

## Rules

- All files under `services/`, `lib/` must start with `import "server-only"`.
- Route handlers (`app/api/`) must contain no business logic — only call a service function, log, and return a response.
- Never import from `services/` or `lib/` in client components or hooks. Only `types/` is shared across boundaries.
- Env vars are read exclusively through `lib/env.ts` — never access `process.env` directly outside of it.
<!-- END:architecture -->

<!-- BEGIN:ui -->
# UI

Chakra UI is the mandatory frontend library. Always reach for Chakra first — layouts, typography, forms, modals, drawers, tables, skeletons, spinners, toasts, icons — if Chakra provides it natively, use it. Only go outside Chakra when it provably cannot satisfy the requirement (e.g. a canvas-based chart, a map, a rich-text editor). Document the reason in a comment when you do.

## Decision order

1. **Chakra UI built-in component** — first choice, always.
2. **Chakra UI + custom CSS** — when a Chakra component exists but needs a style that its props don't expose.
3. **Third-party library** — only when Chakra has no equivalent component at all. Add a comment explaining why.
4. **Custom component from scratch** — last resort. Must be placed in `components/ui/` and styled with Chakra tokens (`useToken`, `useColorModeValue`, CSS variables from the theme).

## Rules

- Never install a UI library (e.g. shadcn, MUI, Ant Design, Radix standalone) without explicit approval — Chakra already covers their use cases.
- Never write raw inline `style={{}}` objects for layout or spacing — use Chakra's shorthand props (`px`, `mt`, `gap`, `w`, etc.).
- Responsive styles use Chakra's array or object syntax: `fontSize={{ base: "sm", md: "md" }}`.
- Dark mode support is built-in via `useColorModeValue` or semantic tokens — never hardcode hex colors.
- Custom shared components live in `components/ui/` and must accept and forward Chakra's `BoxProps` or the relevant base component props so callers can override styles.
<!-- END:ui -->
