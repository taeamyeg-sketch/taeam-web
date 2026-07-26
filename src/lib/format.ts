const cad = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

export function money(amount: number): string {
  return cad.format(amount);
}

export function etaLabel(min: number | null, max: number | null): string | null {
  if (!min || !max) return null;
  return `${min}-${max} min`;
}
