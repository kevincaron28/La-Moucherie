import { NextResponse } from "next/server";
import { z } from "zod";
import { FishSpecies } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// null clears the pick and falls back to the neutral avatar -- there's no
// requirement to choose one.
const schema = z.object({
  favoriteSpecies: z.nativeEnum(FishSpecies).nullable(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { favoriteSpecies: parsed.data.favoriteSpecies },
  });

  return NextResponse.json({ ok: true });
}
