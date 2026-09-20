"use client";

// The last resort: this replaces the whole document when the failure is in the
// root layout itself, so it can't use the locale provider, the header, or any
// translated string — none of that is mounted. Both languages are written out
// literally for that reason.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf6ec",
          color: "#221e16",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#2a3524" }}>
            Une erreur est survenue
          </h1>
          <p style={{ marginTop: "0.75rem", opacity: 0.7 }}>
            Le site a rencontré un problème inattendu. Réessayez dans un instant.
          </p>
          <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.55 }}>
            Something went wrong. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              border: "none",
              borderRadius: "9999px",
              background: "#ac4d15",
              color: "#f2e9d5",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Réessayer / Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "2rem", fontSize: "0.75rem", opacity: 0.4 }}>
              Référence : {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
