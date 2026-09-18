"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SPECIES, type Species } from "@/lib/angling";
import { FishAvatar } from "@/components/FishAvatar";

export function AvatarPicker({ initial }: { initial: Species | null }) {
  const t = useTranslations("Account");
  const tAngling = useTranslations("Angling");

  const [species, setSpecies] = useState<Species | null>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function pick(next: Species) {
    // Tap the one you've already picked to clear it back to the neutral
    // avatar, rather than needing a separate "none" option in the grid.
    const value = next === species ? null : next;
    setSpecies(value);
    setStatus("saving");
    try {
      const res = await fetch("/api/account/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteSpecies: value }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <FishAvatar
          species={species}
          size="lg"
          title={species ? tAngling(`species.${species}`) : undefined}
        />
        <p className="text-sm text-ink/70">
          {species ? tAngling(`species.${species}`) : t("noAvatar")}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SPECIES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => pick(s)}
            title={tAngling(`species.${s}`)}
            aria-pressed={species === s}
            className={`rounded-full transition ${
              species === s ? "ring-2 ring-forest ring-offset-2 ring-offset-parchment" : ""
            }`}
          >
            <FishAvatar species={s} size="md" />
          </button>
        ))}
      </div>

      {status === "error" && <p className="mt-2 text-sm text-rust">{t("errorGeneric")}</p>}
    </div>
  );
}
