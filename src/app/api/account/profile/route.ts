import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      shippingLine1: true,
      shippingLine2: true,
      shippingCity: true,
      shippingProvince: true,
      shippingPostalCode: true,
      shippingCountry: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

const profileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  shippingLine1: z.string().max(200).optional(),
  shippingLine2: z.string().max(200).optional(),
  shippingCity: z.string().max(120).optional(),
  shippingProvince: z.string().max(120).optional(),
  shippingPostalCode: z.string().max(20).optional(),
  shippingCountry: z.string().max(2).optional(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true });
}
