import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const schema = z.object({
  titleFr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  bodyFr: z.string().min(1).max(5000),
  bodyEn: z.string().min(1).max(5000),
  conditionsFr: z.string().min(1).max(500),
  conditionsEn: z.string().min(1).max(500),
  waterId: z.string().optional(),
  published: z.boolean().default(false),
});

// Slugs only ever come from this form, never user input, so a plain
// lowercase/ASCII/hyphen pass plus a short suffix (avoids a uniqueness
// round-trip) is all "unique enough" needs to be.
function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { waterId, ...data } = parsed.data;
  const report = await prisma.fishingReport.create({
    data: {
      ...data,
      slug: slugify(parsed.data.titleEn),
      ...(waterId ? { water: { connect: { id: waterId } } } : {}),
      publishedAt: new Date(),
    },
  });
  return NextResponse.json({ ok: true, report });
}
