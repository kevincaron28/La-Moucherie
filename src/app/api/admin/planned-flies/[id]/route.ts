import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

// No status flag to flip — once a pattern is actually tied, priced and
// photographed as a real Product, the planned-fly row's job is done, so
// "tied it" just deletes the row rather than toggling a state nothing reads.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.plannedFly.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
