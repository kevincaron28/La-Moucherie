import { notFound } from "next/navigation";

// A URL that matches no route at all is resolved by the router, not by a
// segment — so it looks for a *root* `app/not-found.tsx`, and this app has no
// root layout to hang one off (the root layout is `[locale]/layout.tsx`, a
// dynamic segment). The result was that every mistyped URL fell through to
// Next's built-in 404: black on white, system font, English only, no header
// and no way back into the site.
//
// This catch-all pulls those URLs back inside the locale segment so the real
// `not-found.tsx` renders, with the header, the footer and the right language.
// More specific routes still win — App Router matches a catch-all last — so
// nothing above it is shadowed.
//
// The alternative, `global-not-found.tsx`, is still experimental in Next 16 and
// bypasses the layout, which would mean re-importing the stylesheet and fonts
// and maintaining a second copy of the chrome. Not worth it for this.
export default function CatchAllNotFound() {
  notFound();
}
