// Shared formatting helpers keep display rules consistent across dashboard sections.
export const numberFormatter = new Intl.NumberFormat('en-ZA');

export function formatNumber(value: number | string) {
  return numberFormatter.format(Number(value));
}

export function formatPercent(value: number | string) {
  return `${Number(value).toFixed(1)}%`;
}

