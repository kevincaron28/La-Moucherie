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
