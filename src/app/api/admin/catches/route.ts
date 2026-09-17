import { NextResponse } from "next/server";
import { z } from "zod";
import { FishSpecies } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const schema = z.object({
  anglerName: z.string().min(1).max(100),
  imageUrl: z.string().min(1).max(500),
  captionFr: z.string().max(500).optional(),
  captionEn: z.string().max(500).optional(),
  species: z.nativeEnum(FishSpecies).optional(),
  waterId: z.string().optional(),
  productId: z.string().optional(),
  sizeLabel: z.string().max(50).optional(),
  conditionsFr: z.string().max(200).optional(),
  conditionsEn: z.string().max(200).optional(),
  approved: z.boolean().default(true),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { waterId, productId, ...data } = parsed.data;
  const catchPhoto = await prisma.catchPhoto.create({
    data: {
      ...data,
      ...(waterId ? { water: { connect: { id: waterId } } } : {}),
      ...(productId ? { product: { connect: { id: productId } } } : {}),
    },
  });
  return NextResponse.json({ ok: true, catchPhoto });
}
