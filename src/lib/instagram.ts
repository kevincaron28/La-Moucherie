// Turns a pasted Instagram post URL into a directly hotlinkable image URL, so
// the admin only ever has to paste one link — no more finding and copying a
// separate "photo URL" by hand.
//
// `/p/{shortcode}/media/?size=l` is an unofficial but long-standing Instagram
// endpoint: a plain, unauthenticated GET 302-redirects to that post's own
// image, which is exactly what an <img src> needs and works with zero API
// key or app review. It isn't a documented contract, so it can stop working
// without notice (private accounts, carousels, reels, or Instagram changing
// behaviour) — that's why the admin form keeps a manual "Photo URL" fallback
// next to it rather than replacing it outright.
export function instagramShortcode(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)instagram\.com$/i.test(parsed.hostname)) return null;
  const match = parsed.pathname.match(/^\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)\/?/);
  return match ? match[1] : null;
}

export function instagramImageUrl(postUrl: string): string | null {
  const code = instagramShortcode(postUrl);
  return code ? `https://www.instagram.com/p/${code}/media/?size=l` : null;
}

export type InstagramPostInfo = {
  username: string | null;
  caption: string | null;
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2f;/gi, "/")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&");
}

/**
 * Best-effort username + caption from a public post's own <meta
 * property="og:title"> tag, which Instagram has long rendered as
 * `"Username on Instagram: "caption text""` for a logged-out request. Same
 * unofficial, logged-out surface the image derivation above relies on, and
 * just as liable to break without notice (private accounts, a login wall
 * instead of the real page, or Instagram changing the tag's format) — this
 * is autofill for the admin form, never something the rest of the app can
 * depend on succeeding, so every failure path returns nulls rather than
 * throwing.
 */
export async function fetchInstagramInfo(postUrl: string): Promise<InstagramPostInfo> {
  const empty: InstagramPostInfo = { username: null, caption: null };
  const code = instagramShortcode(postUrl);
  if (!code) return empty;

  try {
    const res = await fetch(`https://www.instagram.com/p/${code}/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return empty;
    const html = await res.text();

    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"/);
    if (!titleMatch) return empty;
    const title = decodeHtmlEntities(titleMatch[1]);

    // Caption is optional in the tag itself -- a post Instagram serves
    // without one (login wall, or a bare profile card) still yields a
    // username on its own.
    const parsed = title.match(/^(.*?)\s+on Instagram(?::\s*"([\s\S]*)")?\s*$/i);
    if (!parsed) return empty;

    return {
      username: parsed[1]?.trim() || null,
      caption: parsed[2]?.trim() || null,
    };
  } catch {
    return empty;
  }
}
