import type { Currency } from './types'

export const currencySymbol: Record<Currency, string> = { GBP: '£', CHF: 'CHF ' }

export function fmt(n: number, currency: Currency): string {
  return `${currencySymbol[currency]}${Math.abs(Math.round(n)).toLocaleString('en-GB')}`
}
