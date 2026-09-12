import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      amountTotalCents: true,
      currency: true,
      createdAt: true,
      items: {
        select: {
          nameSnapshotFr: true,
          nameSnapshotEn: true,
          quantity: true,
          unitPriceCents: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
