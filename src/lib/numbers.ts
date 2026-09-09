const tauxFormatter = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const euroFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const nombreFormatter = new Intl.NumberFormat('fr-FR');

export function formatTaux(value: number): string {
  return `${tauxFormatter.format(value)} %`;
}

export function formatEuros(value: number): string {
  return euroFormatter.format(value);
}

export function formatNombre(value: number): string {
  return nombreFormatter.format(value);
}
