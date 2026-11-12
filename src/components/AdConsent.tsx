"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  ADSENSE_SRC,
  CONSENT_CHANGE_EVENT,
  CONSENT_KEY,
  CONSENT_OPEN_EVENT,
  adsAllowedOn,
  type AdChoice,
} from "@/lib/ads";

type AdsWindow = Window & { adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number } };

// What the ad script was loaded with in this page load. Auto ads cannot be
// unloaded, so a later change of choice or a move onto a no-ads route reloads
// the page instead of leaving a script running that should not be.
let loadedWith: AdChoice | null = null;

function readChoice(): AdChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function subscribeNever() {
  return () => {};
}

function saveChoice(choice: AdChoice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Storage blocked: the choice lasts until the tab closes, nothing loads.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

/** Footer link: reopens the banner so the choice can be changed. */
export function AdConsentLink({ className }: { className?: string }) {
  const t = useTranslations("Consent");
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      {t("manage")}
    </button>
  );
}

export function AdConsent() {
  const t = useTranslations("Consent");
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const choice = useSyncExternalStore(subscribe, readChoice, () => null);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  const allowed = adsAllowedOn(pathname);

  useEffect(() => {
    if (!choice) return;
    if (!allowed || (loadedWith && loadedWith !== choice)) {
      if (loadedWith) window.location.reload();
      return;
    }
    if (loadedWith) return;
    loadedWith = choice;
    const w = window as AdsWindow;
    w.adsbygoogle = w.adsbygoogle || [];
    // Must be set before the loader is inserted.
    if (choice === "denied") w.adsbygoogle.requestNonPersonalizedAds = 1;
    const s = document.createElement("script");
    s.async = true;
    s.src = ADSENSE_SRC;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }, [choice, allowed]);

  if (!hydrated || (choice && !reopened)) return null;

  function decide(c: AdChoice) {
    setReopened(false);
    saveChoice(c);
  }

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-forest/20 bg-cream px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex-1 text-sm text-ink/80">
          <p className="font-display font-semibold text-forest">{t("title")}</p>
          <p className="mt-1">
            {t("body")}{" "}
            <Link href="/privacy" className="font-medium text-rust underline underline-offset-2">
              {t("learnMore")}
            </Link>
          </p>
          {choice && (
            <p className="mt-1 text-xs text-ink/60">
              {t("current", { choice: t(choice === "granted" ? "accepted" : "declined") })}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {(["denied", "granted"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => decide(c)}
              className="flex-1 rounded-full border border-forest bg-forest px-6 py-2 text-sm font-semibold text-cream transition hover:bg-forest/90 sm:flex-none"
            >
              {t(c === "granted" ? "accept" : "decline")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
