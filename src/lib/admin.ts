import { createHash, timingSafeEqual } from "crypto";
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

  const header = request.headers.get("authorization");
  if (!header) return false;

  // Compared as digests rather than as strings: `===` gives up the secret one
  // byte at a time to anything that can measure the response, and comparing the
  // raw values in constant time still gives up their length. A SHA-256 of each
  // side is always 32 bytes, so neither the contents nor the length leak.
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(`Bearer ${secret}`), digest(header));
}

/** Either route in: a signed-in operator, or the shared secret. */
export async function isAuthorizedOperator(request: Request): Promise<boolean> {
  return hasCronSecret(request) || (await isAdmin());
}
