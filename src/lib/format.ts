export function formatPrice(cents: number, locale: string, currency = "cad") {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
