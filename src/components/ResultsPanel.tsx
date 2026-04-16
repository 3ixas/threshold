import type { MonthlyCosts, UpfrontCosts, Currency } from '../lib/types'

interface Props {
  monthly: MonthlyCosts
  upfront: UpfrontCosts
  currency: Currency
  lastUpdated: string
  /** Optional note shown under the security deposit line (e.g. Swiss blocked account requirement) */
  depositNote?: string
}

const symbol: Record<Currency, string> = { GBP: '£', CHF: 'CHF ' }

function fmt(n: number, currency: Currency): string {
  return `${symbol[currency]}${Math.round(n).toLocaleString('en-GB')}`
}

interface LineItemProps {
  label: string
  value: number
  currency: Currency
  testId: string
  muted?: boolean
}

function LineItem({ label, value, currency, testId, muted }: LineItemProps) {
  return (
    <div className="flex justify-between items-baseline py-2">
      <span className={`text-sm font-label uppercase tracking-wider ${muted ? 'text-on-surface-variant' : 'text-on-surface'}`}>
        {label}
      </span>
      <span data-testid={testId} className="text-sm font-body tabular-nums text-on-surface">
        {fmt(value, currency)}
      </span>
    </div>
  )
}

export default function ResultsPanel({ monthly, upfront, currency, lastUpdated, depositNote }: Props) {
  return (
    <div className="flex flex-col gap-10">
      {/* ── Upfront section ─────────────────────── */}
      <section>
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">
          Total upfront
        </p>
        <p data-testid="upfront-total" className="text-4xl font-headline text-on-surface mb-6">
          {fmt(upfront.total, currency)}
        </p>
        <div className="border-t border-outline-variant/20">
          <LineItem label="Security deposit" value={upfront.securityDeposit} currency={currency} testId="line-securityDeposit" muted />
          {depositNote && (
            <p className="text-[10px] font-body text-on-surface-variant/60 pb-1 -mt-1">{depositNote}</p>
          )}
          <LineItem label="First month's rent" value={upfront.firstMonthRent} currency={currency} testId="line-firstMonthRent" muted />
          <LineItem label="Moving costs" value={upfront.movingCosts} currency={currency} testId="line-movingCosts" muted />
          <LineItem label="Furniture & setup" value={upfront.furnitureBudget} currency={currency} testId="line-furnitureBudget" muted />
        </div>
      </section>

      {/* ── Monthly section ──────────────────────── */}
      <section>
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">
          Total monthly
        </p>
        <p data-testid="monthly-total" className="text-4xl font-headline text-on-surface mb-6">
          {fmt(monthly.total, currency)}
        </p>
        <div className="border-t border-outline-variant/20">
          <LineItem label="Rent" value={monthly.rent} currency={currency} testId="line-rent" muted />
          {monthly.councilTax > 0 && (
            <LineItem label="Council tax" value={monthly.councilTax} currency={currency} testId="line-councilTax" muted />
          )}
          <LineItem label="Utilities" value={monthly.utilities} currency={currency} testId="line-utilities" muted />
          <LineItem label="Broadband" value={monthly.broadband} currency={currency} testId="line-broadband" muted />
          {monthly.tvLicence > 0 && (
            <LineItem label="TV licence" value={monthly.tvLicence} currency={currency} testId="line-tvLicence" muted />
          )}
          {monthly.mediaFee > 0 && (
            <LineItem label="Media fee (Serafe)" value={monthly.mediaFee} currency={currency} testId="line-mediaFee" muted />
          )}
          <LineItem label="Contents insurance" value={monthly.contentsInsurance} currency={currency} testId="line-contentsInsurance" muted />
          <LineItem label="Transport" value={monthly.transport} currency={currency} testId="line-transport" muted />
          <LineItem label="Food" value={monthly.food} currency={currency} testId="line-food" muted />
          {monthly.healthInsurance > 0 && (
            <LineItem label="Health insurance" value={monthly.healthInsurance} currency={currency} testId="line-healthInsurance" muted />
          )}
          {monthly.lifestyle > 0 && (
            <LineItem label="Lifestyle" value={monthly.lifestyle} currency={currency} testId="line-lifestyle" muted />
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
        Cost data last updated: {lastUpdated}
      </p>
    </div>
  )
}
