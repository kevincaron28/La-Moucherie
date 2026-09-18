import { NextResponse } from "next/server";
import { z } from "zod";
import { FishSpecies } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { instagramImageUrl, fetchInstagramInfo } from "@/lib/instagram";
import { checkRateLimit, tooManyRequests } from "@/lib/rate-limit";

// Unlike the admin route, there's no manual imageUrl fallback here: opening
// submission to the community means the Instagram link is the only thing
// that can ever become a hotlinked image, on purpose.
const schema = z.object({
  instagramUrl: z.string().trim().min(1).max(500),
  species: z.nativeEnum(FishSpecies).optional(),
  waterId: z.string().optional(),
  productId: z.string().optional(),
  sizeLabel: z.string().max(50).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const allowed = await checkRateLimit(`catch:${session.user.id}`, 5, 60 * 60 * 1000);
  if (!allowed) return tooManyRequests();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { instagramUrl, waterId, productId, ...data } = parsed.data;

  const imageUrl = instagramImageUrl(instagramUrl);
  if (!imageUrl) {
    return NextResponse.json({ error: "unsupported_url" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true },
  });
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [water, product] = await Promise.all([
    waterId
      ? prisma.fishingWater.findUnique({ where: { id: waterId }, select: { id: true } })
      : null,
    productId
      ? prisma.product.findUnique({ where: { id: productId }, select: { id: true } })
      : null,
  ]);
  if (waterId && !water) {
    return NextResponse.json({ error: "unknown_water" }, { status: 400 });
  }
  if (productId && !product) {
    return NextResponse.json({ error: "unknown_product" }, { status: 400 });
  }

  // Same backfill the admin form's "Fetch" button triggers by hand -- the
  // Instagram username, when we can get one, is a better credit than the
  // account name (it's who actually posted the catch).
  const info = await fetchInstagramInfo(instagramUrl);

  const catchPhoto = await prisma.catchPhoto.create({
    data: {
      ...data,
      imageUrl,
      instagramUrl,
      anglerName: info.username || user.name,
      captionFr: info.caption ?? null,
      userId: user.id,
      waterId: water?.id ?? null,
      productId: product?.id ?? null,
      // Never auto-published, same as every other user-submitted item.
      approved: false,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, catchPhoto });
}
