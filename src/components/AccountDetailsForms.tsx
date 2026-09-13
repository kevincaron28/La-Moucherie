"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type Status = "idle" | "saving" | "saved" | "error";

const inputClass =
  "mt-1 w-full rounded-lg border border-forest/25 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-forest";
const buttonClass =
  "rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60";

export function AccountDetailsForms({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const t = useTranslations("Account");

  return (
    <div className="mt-4 space-y-8">
      <NameForm initialName={initialName} />
      <div className="border-t border-forest/10 pt-8">
        <EmailForm initialEmail={initialEmail} />
      </div>
      <div className="border-t border-forest/10 pt-8">
        <PasswordForm />
      </div>
      <p className="text-xs text-ink/50">{t("detailsSecurityNote")}</p>
    </div>
  );
}

function NameForm({ initialName }: { initialName: string }) {
  const t = useTranslations("Account");
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      // The greeting above is rendered on the server from the database, so it
      // only picks up the new name once this route re-renders.
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-forest">{t("name")}</label>
        <input
          type="text"
          value={name}
          required
          maxLength={200}
          onChange={(e) => {
            setName(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
      </div>
      {status === "saved" && (
        <p className="text-sm font-medium text-forest">{t("nameUpdated")}</p>
      )}
      {status === "error" && <p className="text-sm text-rust">{t("errorGeneric")}</p>}
      <button type="submit" disabled={status === "saving"} className={buttonClass}>
        {status === "saving" ? t("saving") : t("saveName")}
      </button>
    </form>
  );
}

function EmailForm({ initialEmail }: { initialEmail: string }) {
  const t = useTranslations("Account");
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/account/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === "wrong_password"
            ? t("wrongPassword")
            : data.error === "email_in_use"
              ? t("emailInUse")
              : res.status === 429
                ? t("rateLimited")
                : t("errorGeneric")
        );
        setStatus("error");
        return;
      }
      setCurrentPassword("");
      setStatus("saved");
      router.refresh();
    } catch {
      setError(t("errorGeneric"));
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-forest">{t("email")}</label>
        <input
          type="email"
          value={email}
          required
          autoComplete="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-forest">{t("currentPassword")}</label>
        <input
          type="password"
          value={currentPassword}
          required
          autoComplete="current-password"
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
      </div>
      {status === "saved" && (
        <p className="text-sm font-medium text-forest">{t("emailUpdated")}</p>
      )}
      {status === "error" && error && <p className="text-sm text-rust">{error}</p>}
      <button type="submit" disabled={status === "saving"} className={buttonClass}>
        {status === "saving" ? t("saving") : t("saveEmail")}
      </button>
    </form>
  );
}

function PasswordForm() {
  const t = useTranslations("Account");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error === "wrong_password"
            ? t("wrongPassword")
            : res.status === 429
              ? t("rateLimited")
              : t("errorGeneric")
        );
        setStatus("error");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatus("saved");
    } catch {
      setError(t("errorGeneric"));
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-forest">{t("currentPassword")}</label>
        <input
          type="password"
          value={currentPassword}
          required
          autoComplete="current-password"
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-forest">{t("newPassword")}</label>
        <input
          type="password"
          value={newPassword}
          required
          minLength={8}
          autoComplete="new-password"
          onChange={(e) => {
            setNewPassword(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink/50">{t("passwordHint")}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-forest">{t("confirmPassword")}</label>
        <input
          type="password"
          value={confirmPassword}
          required
          minLength={8}
          autoComplete="new-password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setStatus("idle");
          }}
          className={inputClass}
        />
      </div>
      {status === "saved" && (
        <p className="text-sm font-medium text-forest">{t("passwordUpdated")}</p>
      )}
      {status === "error" && error && <p className="text-sm text-rust">{error}</p>}
      <button type="submit" disabled={status === "saving"} className={buttonClass}>
        {status === "saving" ? t("saving") : t("savePassword")}
      </button>
    </form>
  );
}
