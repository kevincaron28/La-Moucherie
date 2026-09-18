import { auth } from "@/lib/auth";
import { adminEmails } from "@/lib/admin-emails";

export { adminEmails };

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
