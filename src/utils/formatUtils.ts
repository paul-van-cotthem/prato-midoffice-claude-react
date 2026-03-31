const currencyFormatter = new Intl.NumberFormat('nl-BE', {
  style: 'currency',
  currency: 'EUR',
})

const numberFormatter = new Intl.NumberFormat('nl-BE')

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '\u2014'
  return currencyFormatter.format(amount)
}

export function formatNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '\u2014'
  return numberFormatter.format(amount)
}

export function formatIBAN(iban: string | null | undefined): string {
  if (!iban) return '\u2014'
  return iban.replace(/(.{4})/g, '$1 ').trim()
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '\u2014'
  return `${value.toFixed(2)}%`
}
