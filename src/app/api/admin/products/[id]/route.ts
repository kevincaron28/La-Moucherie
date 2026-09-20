import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { SPECIES, SEASONS, WATER_TYPES, TECHNIQUES } from "@/lib/angling";

// Everything a product carries that someone at the bench would reasonably
// change — which is everything except its recipe. Materials stay out on
// purpose: they exist for the production sheet, not for merchandising, and
// they're edited as a recipe rather than per product.
const variantSchema = z.object({
  // Absent on a hook size being added for the first time.
  id: z.string().min(1).optional(),
  nameFr: z.string().trim().min(1).max(80),
  nameEn: z.string().trim().min(1).max(80),
  sku: z.string().trim().min(1).max(40),
  // An empty override means "use the product's base price", which is null in
  // the database rather than zero — zero would be a free fly.
  priceCents: z.number().int().min(0).max(100_000).nullable(),
  stock: z.number().int().min(0).max(10_000),
});

const schema = z.object({
  nameFr: z.string().trim().min(1).max(120),
  nameEn: z.string().trim().min(1).max(120),
  descriptionFr: z.string().trim().min(1).max(4000),
  descriptionEn: z.string().trim().min(1).max(4000),
  basePriceCents: z.number().int().min(1).max(100_000),
  active: z.boolean(),
  featured: z.boolean(),
  images: z.array(z.string().trim().min(1).max(300)).max(10),
  howToFishFr: z.string().trim().max(1000),
  howToFishEn: z.string().trim().max(1000),
  proTipFr: z.string().trim().max(1000),
  proTipEn: z.string().trim().max(1000),
  imitatesFr: z.array(z.string().trim().min(1).max(60)).max(10),
  imitatesEn: z.array(z.string().trim().min(1).max(60)).max(10),
  species: z.array(z.enum(SPECIES)).max(SPECIES.length),
  seasons: z.array(z.enum(SEASONS)).max(SEASONS.length),
  waterTypes: z.array(z.enum(WATER_TYPES)).max(WATER_TYPES.length),
  techniques: z.array(z.enum(TECHNIQUES)).max(TECHNIQUES.length),
  waterSlugs: z.array(z.string().trim().min(1).max(80)).max(50),
  variants: z.array(variantSchema).max(12),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", detail: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }
  const body = parsed.data;

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { variants: { select: { id: true, sku: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // A SKU is unique across the whole catalogue, so a typo that collides with
  // another product's hook size would otherwise fail as a raw Prisma error.
  const keptIds = new Set(body.variants.map((v) => v.id).filter(Boolean) as string[]);
  const clashing = await prisma.productVariant.findFirst({
    where: {
      sku: { in: body.variants.map((v) => v.sku) },
      productId: { not: id },
    },
    select: { sku: true },
  });
  if (clashing) {
    return NextResponse.json(
      { error: "sku_taken", detail: clashing.sku },
      { status: 409 }
    );
  }

  // Removing a hook size that has already been ordered would cut the link
  // between that order and what was actually sold. The order keeps its own
  // name/price snapshot, but the variant is what the fulfilment list counts,
  // so refuse rather than quietly break a past order.
  const removed = existing.variants.filter((v) => !keptIds.has(v.id));
  if (removed.length > 0) {
    const ordered = await prisma.orderItem.findFirst({
      where: { variantId: { in: removed.map((v) => v.id) } },
      select: { variantId: true },
    });
    if (ordered) {
      const sku = removed.find((v) => v.id === ordered.variantId)?.sku;
      return NextResponse.json({ error: "variant_ordered", detail: sku }, { status: 409 });
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        nameFr: body.nameFr,
        nameEn: body.nameEn,
        descriptionFr: body.descriptionFr,
        descriptionEn: body.descriptionEn,
        basePriceCents: body.basePriceCents,
        active: body.active,
        featured: body.featured,
        images: body.images,
        // Empty string rather than null: the page templates check for a blank
        // string when deciding whether to render the section at all.
        howToFishFr: body.howToFishFr,
        howToFishEn: body.howToFishEn,
        proTipFr: body.proTipFr,
        proTipEn: body.proTipEn,
        imitatesFr: body.imitatesFr,
        imitatesEn: body.imitatesEn,
        species: body.species,
        seasons: body.seasons,
        waterTypes: body.waterTypes,
        techniques: body.techniques,
        waters: { set: body.waterSlugs.map((slug) => ({ slug })) },
      },
    });

    if (removed.length > 0) {
      await tx.productVariant.deleteMany({ where: { id: { in: removed.map((v) => v.id) } } });
    }

    for (const v of body.variants) {
      if (v.id) {
        await tx.productVariant.update({
          where: { id: v.id },
          data: {
            nameFr: v.nameFr,
            nameEn: v.nameEn,
            sku: v.sku,
            priceCents: v.priceCents,
            stock: v.stock,
          },
        });
      } else {
        await tx.productVariant.create({
          data: {
            productId: id,
            nameFr: v.nameFr,
            nameEn: v.nameEn,
            sku: v.sku,
            priceCents: v.priceCents,
            stock: v.stock,
          },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
