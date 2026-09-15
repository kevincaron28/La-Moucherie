"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream shadow transition hover:bg-forest/90"
    >
      🖨️ {label}
    </button>
  );
}
