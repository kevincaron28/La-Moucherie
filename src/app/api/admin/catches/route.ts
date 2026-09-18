import { NextResponse } from "next/server";
import { z } from "zod";
import { FishSpecies } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { instagramImageUrl } from "@/lib/instagram";

const schema = z
  .object({
    anglerName: z.string().min(1).max(100),
    // Neither is required on its own — an Instagram URL alone is enough,
    // since the image gets derived from it below. A manual Photo URL stays
    // available for anything not on Instagram, or if that derivation fails.
    imageUrl: z.string().max(500).optional(),
    instagramUrl: z.string().max(500).optional(),
    captionFr: z.string().max(500).optional(),
    captionEn: z.string().max(500).optional(),
    species: z.nativeEnum(FishSpecies).optional(),
    waterId: z.string().optional(),
    productId: z.string().optional(),
    sizeLabel: z.string().max(50).optional(),
    conditionsFr: z.string().max(200).optional(),
    conditionsEn: z.string().max(200).optional(),
    approved: z.boolean().default(true),
  })
  .refine((d) => d.imageUrl || d.instagramUrl, {
    message: "image_or_instagram_required",
    path: ["imageUrl"],
  });

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { waterId, productId, imageUrl, instagramUrl, ...data } = parsed.data;

  // A pasted Instagram URL alone derives its own image — the admin never has
  // to go find that URL by hand. The manual imageUrl, when given, always wins
  // (it means the derivation didn't work for this post).
  const finalImageUrl = imageUrl || (instagramUrl ? instagramImageUrl(instagramUrl) : null);
  if (!finalImageUrl) {
    return NextResponse.json({ error: "no_image_derivable" }, { status: 400 });
  }

  const catchPhoto = await prisma.catchPhoto.create({
    data: {
      ...data,
      imageUrl: finalImageUrl,
      instagramUrl: instagramUrl || undefined,
      ...(waterId ? { water: { connect: { id: waterId } } } : {}),
      ...(productId ? { product: { connect: { id: productId } } } : {}),
    },
  });
  return NextResponse.json({ ok: true, catchPhoto });
}
