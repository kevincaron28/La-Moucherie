import { useTranslations } from "next-intl";

export function TrustBadges({ className = "" }: { className?: string }) {
  const t = useTranslations("Checkout");

  const items = [
    { icon: <LockIcon />, label: t("trustSecurePayment") },
    { icon: <HandIcon />, label: t("trustHandmade") },
    { icon: <TruckIcon />, label: t("trustShipping") },
  ];

  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-xs text-ink/60">
          <span className="text-forest/60">{item.icon}</span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function iconProps() {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    className: "h-4 w-4 shrink-0",
    "aria-hidden": true as const,
  };
}

function LockIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg {...iconProps()}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12V6a1.5 1.5 0 0 1 3 0v5m0-4a1.5 1.5 0 0 1 3 0v4m0-3a1.5 1.5 0 0 1 3 0v3m0-1a1.5 1.5 0 0 1 3 0v4c0 3.5-2 6-5.5 6S6 17.5 6 15v-1.5"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg {...iconProps()}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}
