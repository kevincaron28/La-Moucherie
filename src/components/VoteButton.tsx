"use client";

import { useState } from "react";

export function VoteButton({
  endpoint,
  initialCount,
  initialVoted,
  /** Why voting isn't available right now (not signed in, own content) --
   * shown as the button's tooltip. Votable when omitted. */
  disabledReason,
  label,
}: {
  endpoint: string;
  initialCount: number;
  initialVoted: boolean;
  disabledReason?: string;
  /** aria-label, e.g. "Upvote this report" -- the count is the visible text. */
  label: string;
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [busy, setBusy] = useState(false);

  async function handleVote() {
    if (voted || disabledReason || busy) return;
    setBusy(true);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setVoted(true);
        setCount(typeof data.upvoteCount === "number" ? data.upvoteCount : count + 1);
      } else if (res.status === 409) {
        // Someone else's tab already recorded this vote -- reflect it rather
        // than leaving the button in a stuck "still pending" state.
        setVoted(true);
      }
    } finally {
      setBusy(false);
    }
  }

  const disabled = voted || Boolean(disabledReason) || busy;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleVote}
      title={disabledReason}
      aria-label={label}
      aria-pressed={voted}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        voted
          ? "border-forest/40 bg-forest/10 text-forest"
          : "border-forest/20 text-forest/70 hover:border-forest/40 hover:bg-forest/5"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      {count}
    </button>
  );
}
