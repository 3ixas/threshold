import { motion } from 'framer-motion'
import type { MonthlyCosts, UpfrontCosts, Currency } from '../lib/types'

interface Props {
  monthly: MonthlyCosts
  upfront: UpfrontCosts
  currency: Currency
  lastUpdated: string
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
}

function LineItem({ label, value, currency, testId }: LineItemProps) {
  return (
    <div className="flex justify-between items-baseline py-2.5">
      <span className="text-sm font-label uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <span data-testid={testId} className="text-sm font-body tabular-nums text-on-surface-variant">
        {fmt(value, currency)}
      </span>
    </div>
  )
}

interface TotalBlockProps {
  label: string
  value: number
  currency: Currency
  testId: string
}

function TotalBlock({ label, value, currency, testId }: TotalBlockProps) {
  const rounded = Math.round(value)
  return (
    /* Double-bezel: outer hairline frame + inner surface — editorial premium detail */
    <div className="total-block border border-outline-variant/20 p-[3px] mb-4">
      <div className="bg-surface-container-low px-5 py-6">
        <p
          className="text-[10px] font-label uppercase tracking-widest mb-3"
          style={{ color: '#b87941' }}
        >
          {label}
        </p>
        {/* key=rounded ensures animation fires only when the displayed value changes */}
        <motion.p
          key={rounded}
          data-testid={testId}
          initial={{ opacity: 0.5, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 38 }}
          className="text-5xl md:text-6xl font-headline tabular-nums text-on-surface leading-none"
        >
          {fmt(value, currency)}
        </motion.p>
      </div>
    </div>
  )
}

export default function ResultsPanel({ monthly, upfront, currency, lastUpdated, depositNote }: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* ── Upfront ───────────────────────────────── */}
      <section>
        <TotalBlock label="Total upfront" value={upfront.total} currency={currency} testId="upfront-total" />
        <div className="divide-y divide-outline-variant/15">
          <LineItem label="Security deposit" value={upfront.securityDeposit} currency={currency} testId="line-securityDeposit" />
          {depositNote && (
            <p className="text-[10px] font-body text-on-surface-variant/50 pb-2 pt-0.5">{depositNote}</p>
          )}
          <LineItem label="First month's rent" value={upfront.firstMonthRent} currency={currency} testId="line-firstMonthRent" />
          <LineItem label="Moving costs" value={upfront.movingCosts} currency={currency} testId="line-movingCosts" />
          <LineItem label="Furniture & setup" value={upfront.furnitureBudget} currency={currency} testId="line-furnitureBudget" />
        </div>
      </section>

      {/* ── Monthly ───────────────────────────────── */}
      <section>
        <TotalBlock label="Total monthly" value={monthly.total} currency={currency} testId="monthly-total" />
        <div className="divide-y divide-outline-variant/15">
          <LineItem label="Rent" value={monthly.rent} currency={currency} testId="line-rent" />
          {monthly.councilTax > 0 && (
            <LineItem label="Council tax" value={monthly.councilTax} currency={currency} testId="line-councilTax" />
          )}
          <LineItem label="Utilities" value={monthly.utilities} currency={currency} testId="line-utilities" />
          <LineItem label="Broadband" value={monthly.broadband} currency={currency} testId="line-broadband" />
          {monthly.tvLicence > 0 && (
            <LineItem label="TV licence" value={monthly.tvLicence} currency={currency} testId="line-tvLicence" />
          )}
          {monthly.mediaFee > 0 && (
            <LineItem label="Media fee (Serafe)" value={monthly.mediaFee} currency={currency} testId="line-mediaFee" />
          )}
          <LineItem label="Contents insurance" value={monthly.contentsInsurance} currency={currency} testId="line-contentsInsurance" />
          <LineItem label="Transport" value={monthly.transport} currency={currency} testId="line-transport" />
          <LineItem label="Food" value={monthly.food} currency={currency} testId="line-food" />
          {monthly.healthInsurance > 0 && (
            <LineItem label="Health insurance" value={monthly.healthInsurance} currency={currency} testId="line-healthInsurance" />
          )}
          {monthly.lifestyle > 0 && (
            <LineItem label="Lifestyle" value={monthly.lifestyle} currency={currency} testId="line-lifestyle" />
          )}
        </div>
      </section>

      <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">
        Cost data last updated: {lastUpdated}
      </p>
    </div>
  )
}
