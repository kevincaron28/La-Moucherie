import { prisma } from "@/lib/prisma";

// Database-backed rather than in-memory: on serverless each request may land on
// a different instance, so an in-process counter would reset constantly and
// enforce nothing. This trades a couple of queries for a limit that actually
// holds across instances, which is the right call at this traffic level.
export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<boolean> {
  const since = new Date(Date.now() - windowMs);

  try {
    const recent = await prisma.rateLimitHit.count({
      where: { key, createdAt: { gte: since } },
    });
    if (recent >= max) return false;

    await prisma.rateLimitHit.create({ data: { key } });

    // Opportunistic cleanup so the table can't grow without bound. Cheap
    // because of the (key, createdAt) index, and only fires occasionally.
    if (Math.random() < 0.02) {
      await prisma.rateLimitHit.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      });
    }
    return true;
  } catch (err) {
    // Never let the limiter itself take down the endpoint it protects.
    console.error("[rate-limit:failed]", key, err);
    return true;
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function tooManyRequests() {
  return Response.json({ error: "rate_limited" }, { status: 429 });
}
