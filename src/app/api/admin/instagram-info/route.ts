import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { fetchInstagramInfo } from "@/lib/instagram";

/** Lets the "Add a catch" form autofill angler name and caption from a
 * pasted Instagram link before the admin submits, so they can see and edit
 * what came back rather than discovering it only after saving. */
export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "missing_url" }, { status: 400 });
  }

  const info = await fetchInstagramInfo(url);
  return NextResponse.json(info);
}
