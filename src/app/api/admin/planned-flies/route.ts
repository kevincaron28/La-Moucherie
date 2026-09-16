import { NextResponse } from "next/server";
import { z } from "zod";
import { ProductCategory, FishSpecies } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

const schema = z.object({
  nameFr: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  category: z.nativeEnum(ProductCategory),
  species: z.array(z.nativeEnum(FishSpecies)).default([]),
  notes: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const planned = await prisma.plannedFly.create({ data: parsed.data });
  return NextResponse.json({ ok: true, planned });
}
