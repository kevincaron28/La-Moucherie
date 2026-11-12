export const ADSENSE_CLIENT = "ca-pub-6948243189424271";
export const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

export const CONSENT_KEY = "lm-ad-consent";
export const CONSENT_CHANGE_EVENT = "lm-consent-change";
export const CONSENT_OPEN_EVENT = "lm-consent-open";

export type AdChoice = "granted" | "denied";

/**
 * Content and browsing pages only — an allowlist, so a new route never gets ads
 * by accident. Paths are locale-less (next-intl's usePathname strips /fr, /en).
 * Everything else — product pages, cart, checkout, orders, account, sign-in,
 * admin, forms, community submissions — never loads the ad script.
 */
const AD_ROUTES: RegExp[] = [
  /^\/$/,
  /^\/shop$/,
  /^\/shop\/species\/[^/]+$/,
  /^\/shop\/water$/,
  /^\/shop\/water\/[^/]+$/,
  /^\/hatches$/,
  /^\/hatches\/[^/]+$/,
];

export function adsAllowedOn(pathname: string): boolean {
  const p = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return AD_ROUTES.some((re) => re.test(p));
}
