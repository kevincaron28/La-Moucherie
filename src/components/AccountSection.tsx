/**
 * A collapsible section of the account page.
 *
 * Built on native <details>/<summary> rather than React state: it opens before
 * any JavaScript arrives, the browser gives keyboard and screen-reader
 * behaviour for free, and the page stays a server component.
 */
export function AccountSection({
  title,
  hint,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  hint?: string;
  /** Shown beside the title, so a collapsed section still says what's inside. */
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group mt-4 rounded-2xl border border-forest/10 bg-cream/30 open:bg-cream/40"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-forest/50 transition-transform duration-200 group-open:rotate-90"
        >
          <path
            d="M7 4l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="flex-1 font-display text-lg font-semibold text-forest">
          {title}
        </span>
        {typeof count === "number" && (
          <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-medium text-forest">
            {count}
          </span>
        )}
      </summary>
      <div className="border-t border-forest/10 px-5 pb-6 pt-5">
        {hint && <p className="-mt-1 mb-4 text-sm text-ink/60">{hint}</p>}
        {children}
      </div>
    </details>
  );
}
