/**
 * Who may see the operational pages. Split out from src/lib/admin.ts so that
 * src/lib/auth.ts (which needs this to compute isAdmin into the session
 * token) doesn't have to import admin.ts — which itself imports `auth` from
 * auth.ts, and would otherwise be a circular import.
 *
 * `ADMIN_EMAILS` is a comma-separated list; it falls back to `OWNER_EMAIL` so
 * there's always exactly one owner without extra configuration. Matching is on
 * the signed-in session's email rather than a role column: there's one operator,
 * and a whole permissions system would be machinery without a user.
 */
export function adminEmails(): string[] {
  const configured = process.env.ADMIN_EMAILS ?? process.env.OWNER_EMAIL ?? "";
  return configured
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
