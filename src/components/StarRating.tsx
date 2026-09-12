"use client";

import { useState } from "react";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-full w-full"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.2}
      aria-hidden
    >
      <path
        strokeLinejoin="round"
        d="M10 1.6l2.5 5.2 5.6.8-4 4 1 5.7-5.1-2.8-5.1 2.8 1-5.7-4-4 5.6-.8z"
      />
    </svg>
  );
}

export function StarRating({
  value,
  size = "md",
  className = "",
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  const pct = Math.max(0, Math.min(5, value)) * 20;

  return (
    <span className={`relative inline-flex ${className}`} aria-hidden>
      <span className="flex gap-0.5 text-forest/20">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={dim}>
            <Star filled={false} />
          </span>
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden whitespace-nowrap text-gold"
        style={{ width: `${pct}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`${dim} shrink-0`}>
            <Star filled />
          </span>
        ))}
      </span>
    </span>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onClick={() => onChange(n)}
            aria-label={`${n} / 5`}
            className={`h-7 w-7 transition ${n <= display ? "text-gold" : "text-forest/20"}`}
          >
            <Star filled={n <= display} />
          </button>
        );
      })}
    </div>
  );
}
