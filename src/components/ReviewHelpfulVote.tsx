"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Vote = "up" | "down";

export function ReviewHelpfulVote({
  reviewId,
  helpfulCount,
  notHelpfulCount,
}: {
  reviewId: string;
  helpfulCount: number;
  notHelpfulCount: number;
}) {
  const t = useTranslations("Reviews");
  const storageKey = `review-vote:${reviewId}`;

  const [voted, setVoted] = useState<Vote | null>(null);
  const [counts, setCounts] = useState({ up: helpfulCount, down: notHelpfulCount });
  const [pending, setPending] = useState(false);

  // Read localStorage only after mount so server and first client render
  // match — reading it during render would desync from the SSR'd markup.
  // Deferred a tick (rather than set synchronously in the effect body) so
  // this doesn't trigger a cascading render during commit.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored === "up" || stored === "down") setVoted(stored);
      } catch {
        // Private browsing or blocked storage — voting still works, it just
        // won't be remembered as "already voted" on a future visit.
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  async function vote(helpful: boolean) {
    if (voted || pending) return;
    const mark: Vote = helpful ? "up" : "down";
    setPending(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful }),
      });
      if (res.ok) {
        const data = await res.json();
        setCounts({ up: data.helpfulCount, down: data.notHelpfulCount });
      }
      // Either way — a fresh count or a 409 for an already-recorded vote from
      // this connection — the visitor has now voted as far as this browser
      // is concerned, so lock the buttons and remember it.
      if (res.ok || res.status === 409) {
        setVoted(mark);
        try {
          localStorage.setItem(storageKey, mark);
        } catch {
          // Nothing to fall back to — the vote itself still went through.
        }
      }
    } catch {
      // Voting is a nice-to-have; a network hiccup isn't worth surfacing.
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-3 flex items-center gap-3 text-xs text-ink/55">
      <span>{t("wasHelpful")}</span>
      <button
        type="button"
        onClick={() => vote(true)}
        disabled={Boolean(voted) || pending}
        className={`rounded-full border px-2.5 py-1 font-medium transition disabled:cursor-not-allowed ${
          voted === "up"
            ? "border-halo bg-halo/10 text-halo"
            : "border-forest/15 text-ink/60 hover:border-forest/35 disabled:opacity-60"
        }`}
      >
        {t("helpfulYes")} · {counts.up}
      </button>
      <button
        type="button"
        onClick={() => vote(false)}
        disabled={Boolean(voted) || pending}
        className={`rounded-full border px-2.5 py-1 font-medium transition disabled:cursor-not-allowed ${
          voted === "down"
            ? "border-forest/40 bg-forest/10 text-forest"
            : "border-forest/15 text-ink/60 hover:border-forest/35 disabled:opacity-60"
        }`}
      >
        {t("helpfulNo")} · {counts.down}
      </button>
    </div>
  );
}
