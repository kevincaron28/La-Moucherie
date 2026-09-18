// Water temperature is always stored in Celsius (HatchReport.waterTempC) — the
// unit Québec anglers' stream thermometers are marked in, and the one every
// hatch note in insect-articles.ts already reasons in. Fahrenheit only exists
// at the edges: an input toggle for anyone who thinks in °F, and a dual-unit
// display so nobody has to convert in their head either way.

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/** "14°C · 57°F" */
export function formatDualTemp(celsius: number): string {
  return `${Math.round(celsius)}°C · ${Math.round(celsiusToFahrenheit(celsius))}°F`;
}
