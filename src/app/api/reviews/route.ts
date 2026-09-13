import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(3000),
  locale: z.enum(["fr", "en"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { productId, rating, title, body, locale } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) {
    return NextResponse.json({ error: "product_not_found" }, { status: 400 });
  }

  // Only someone who actually bought this product, on this account, may review it.
  // Identity comes from the session — never from client-supplied name/email.
  const purchase = await prisma.order.findFirst({
    where: {
      userId: user.id,
      status: { in: ["PAID", "FULFILLED"] },
      items: { some: { productId } },
    },
  });
  if (!purchase) {
    return NextResponse.json({ error: "not_a_purchaser" }, { status: 403 });
  }

  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId, userId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "already_reviewed" }, { status: 409 });
  }

  await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      customerName: user.name,
      email: user.email,
      rating,
      title,
      body,
      locale,
      verifiedPurchase: true,
    },
  });

  return NextResponse.json({ ok: true });
}
