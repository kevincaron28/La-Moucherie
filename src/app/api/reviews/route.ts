import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(1).max(200),
  email: z.string().email(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(3000),
  locale: z.enum(["fr", "en"]),
});

export async function POST(request: Request) {
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { productId, customerName, email, rating, title, body, locale } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) {
    return NextResponse.json({ error: "product_not_found" }, { status: 400 });
  }

  const purchase = await prisma.order.findFirst({
    where: {
      email,
      status: "PAID",
      items: { some: { productId } },
    },
  });

  await prisma.review.create({
    data: {
      productId,
      customerName,
      email,
      rating,
      title,
      body,
      locale,
      verifiedPurchase: Boolean(purchase),
    },
  });

  return NextResponse.json({ ok: true });
}
