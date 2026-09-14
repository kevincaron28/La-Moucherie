import { auth } from "@/lib/auth";

/**
 * Who may see the operational pages.
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

/** True when the current session belongs to an operator. */
export async function isAdmin(): Promise<boolean> {
  const allowed = adminEmails();
  if (allowed.length === 0) return false;

  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  return Boolean(email && allowed.includes(email));
}

/**
 * Cron and curl authenticate with the shared secret instead of a session, since
 * neither has a browser to sign in with.
 */
export function hasCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/** Either route in: a signed-in operator, or the shared secret. */
export async function isAuthorizedOperator(request: Request): Promise<boolean> {
  return hasCronSecret(request) || (await isAdmin());
}
