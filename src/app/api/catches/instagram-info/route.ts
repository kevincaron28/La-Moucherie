import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { fetchInstagramInfo } from "@/lib/instagram";

/** Same lookup as the admin form's "Fetch" button, open to any signed-in
 * angler so the community submission form can preview a post before sending
 * it in. */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "missing_url" }, { status: 400 });
  }

  const info = await fetchInstagramInfo(url);
  return NextResponse.json(info);
}
