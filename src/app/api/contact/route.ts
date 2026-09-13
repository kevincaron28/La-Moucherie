import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { checkRateLimit, clientIp, tooManyRequests } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  const allowed = await checkRateLimit(
    `contact:${clientIp(request)}`,
    5,
    60 * 60 * 1000
  );
  if (!allowed) return tooManyRequests();

  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  await prisma.contactMessage.create({ data: parsed.data });
  await sendContactNotification(parsed.data);

  return NextResponse.json({ ok: true });
}
