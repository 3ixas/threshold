import type { MonthlyCosts, UpfrontCosts, Currency } from '../lib/types'
import { calculateMonthlyCostsDiff } from '../lib/calculate'

interface Props {
  monthlyA: MonthlyCosts
  monthlyB: MonthlyCosts
  upfrontA: UpfrontCosts
  upfrontB: UpfrontCosts
  currency: Currency
}

const symbol: Record<Currency, string> = { GBP: '£', CHF: 'CHF ' }

function fmt(n: number, currency: Currency) {
  return `${symbol[currency]}${Math.abs(Math.round(n)).toLocaleString('en-GB')}`
}

function DiffBadge({ diff, currency }: { diff: number; currency: Currency }) {
  if (Math.abs(diff) < 0.5) return <span className="text-xs text-on-surface-variant">—</span>
  const cheaper = diff < 0
  return (
    <span className={`text-xs font-label tabular-nums ${cheaper ? 'text-tertiary' : 'text-error'}`}>
      {cheaper ? '−' : '+'}{fmt(diff, currency)}
    </span>
  )
}

interface RowProps {
  label: string
  a: number
  b: number
  currency: Currency
  testPrefix: string
}

function ComparisonRow({ label, a, b, currency, testPrefix }: RowProps) {
  const diff = b - a
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-baseline py-2">
      <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant truncate">{label}</span>
      <span data-testid={`${testPrefix}-a`} className="text-xs font-body tabular-nums text-on-surface text-right">{fmt(a, currency)}</span>
      <span data-testid={`${testPrefix}-b`} className="text-xs font-body tabular-nums text-on-surface text-right">{fmt(b, currency)}</span>
      <DiffBadge diff={diff} currency={currency} />
    </div>
  )
}

export default function ComparisonResults({ monthlyA, monthlyB, upfrontA, upfrontB, currency }: Props) {
  const diff = calculateMonthlyCostsDiff(monthlyA, monthlyB)

  return (
    <div className="flex flex-col gap-8">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 pb-2 border-b border-outline-variant/30">
        <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant">Cost</span>
        <span className="text-xs font-label uppercase tracking-wider text-on-surface text-right">A</span>
        <span className="text-xs font-label uppercase tracking-wider text-on-surface text-right">B</span>
        <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant text-right">Diff</span>
      </div>

      {/* Monthly section */}
      <section>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-baseline mb-3">
          <span className="text-sm font-headline text-on-surface">Monthly total</span>
          <span data-testid="total-a-monthly" className="text-sm font-body tabular-nums font-medium text-on-surface text-right">{fmt(monthlyA.total, currency)}</span>
          <span data-testid="total-b-monthly" className="text-sm font-body tabular-nums font-medium text-on-surface text-right">{fmt(monthlyB.total, currency)}</span>
          <span data-testid="diff-monthly-total"><DiffBadge diff={diff.total} currency={currency} /></span>
        </div>
        <div className="border-t border-outline-variant/20">
          <ComparisonRow label="Rent" a={monthlyA.rent} b={monthlyB.rent} currency={currency} testPrefix="rent" />
          {(monthlyA.councilTax > 0 || monthlyB.councilTax > 0) && (
            <ComparisonRow label="Council tax" a={monthlyA.councilTax} b={monthlyB.councilTax} currency={currency} testPrefix="councilTax" />
          )}
          <ComparisonRow label="Utilities" a={monthlyA.utilities} b={monthlyB.utilities} currency={currency} testPrefix="utilities" />
          <ComparisonRow label="Broadband" a={monthlyA.broadband} b={monthlyB.broadband} currency={currency} testPrefix="broadband" />
          {(monthlyA.tvLicence > 0 || monthlyB.tvLicence > 0) && (
            <ComparisonRow label="TV licence" a={monthlyA.tvLicence} b={monthlyB.tvLicence} currency={currency} testPrefix="tvLicence" />
          )}
          <ComparisonRow label="Contents ins." a={monthlyA.contentsInsurance} b={monthlyB.contentsInsurance} currency={currency} testPrefix="contentsInsurance" />
          <ComparisonRow label="Transport" a={monthlyA.transport} b={monthlyB.transport} currency={currency} testPrefix="transport" />
          <ComparisonRow label="Food" a={monthlyA.food} b={monthlyB.food} currency={currency} testPrefix="food" />
          {(monthlyA.lifestyle > 0 || monthlyB.lifestyle > 0) && (
            <ComparisonRow label="Lifestyle" a={monthlyA.lifestyle} b={monthlyB.lifestyle} currency={currency} testPrefix="lifestyle" />
          )}
        </div>
      </section>

      {/* Upfront section */}
      <section>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-baseline mb-3">
          <span className="text-sm font-headline text-on-surface">Upfront total</span>
          <span data-testid="total-a-upfront" className="text-sm font-body tabular-nums font-medium text-on-surface text-right">{fmt(upfrontA.total, currency)}</span>
          <span data-testid="total-b-upfront" className="text-sm font-body tabular-nums font-medium text-on-surface text-right">{fmt(upfrontB.total, currency)}</span>
          <DiffBadge diff={upfrontB.total - upfrontA.total} currency={currency} />
        </div>
      </section>
    </div>
  )
}
