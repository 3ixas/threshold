import { AffordabilityStatus } from '../lib/affordability'
import type { AffordabilityResult } from '../lib/affordability'
import type { CityId, Currency } from '../lib/types'

const symbol: Record<Currency, string> = { GBP: '£', CHF: 'CHF ' }

function fmt(n: number, currency: Currency) {
  return `${symbol[currency]}${Math.abs(Math.round(n)).toLocaleString('en-GB')}`
}

interface Props {
  takeHome: number
  savings: number
  result: AffordabilityResult | null
  currency: Currency
  cityId: CityId
  onTakeHomeChange: (value: number) => void
  onSavingsChange: (value: number) => void
}

export default function AffordabilityPanel({
  takeHome, savings, result, currency, cityId,
  onTakeHomeChange, onSavingsChange,
}: Props) {
  const isSwiss = cityId === 'basel' || cityId === 'zurich'
  const prefix = symbol[currency]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">
          Can I afford this?
        </p>
        <p className="text-sm font-body text-on-surface-variant leading-relaxed">
          Optional — enter your income and savings to see your surplus and move-in timeline.
        </p>
      </div>

      {/* Income input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="take-home" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          Monthly take-home pay
        </label>
        <div className="flex items-center bg-surface-container border-b border-outline-variant focus-within:border-primary">
          <span className="text-sm font-body text-on-surface-variant px-2">{prefix}</span>
          <input
            id="take-home"
            type="number"
            min={0}
            value={takeHome || ''}
            placeholder="0"
            onChange={e => onTakeHomeChange(Math.max(0, Number(e.target.value)))}
            className="flex-1 bg-transparent text-sm font-body tabular-nums text-on-surface py-2 pr-2 focus:outline-none text-right"
          />
        </div>
        {isSwiss && (
          <p className="text-xs font-body text-on-surface-variant mt-1">
            Don't include health insurance in your take-home — we've already counted it above.
          </p>
        )}
      </div>

      {/* Savings input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="savings-input" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          Current savings
        </label>
        <div className="flex items-center bg-surface-container border-b border-outline-variant focus-within:border-primary">
          <span className="text-sm font-body text-on-surface-variant px-2">{prefix}</span>
          <input
            id="savings-input"
            type="number"
            min={0}
            value={savings || ''}
            placeholder="0"
            onChange={e => onSavingsChange(Math.max(0, Number(e.target.value)))}
            className="flex-1 bg-transparent text-sm font-body tabular-nums text-on-surface py-2 pr-2 focus:outline-none text-right"
          />
        </div>
      </div>

      {/* Result display — only shown when inputs are non-zero */}
      {result && (
        <div className="border-t border-outline-variant/20 pt-4 flex flex-col gap-3">
          {result.status === AffordabilityStatus.CAN_AFFORD_NOW && (
            <>
              <p data-testid="affordability-status" className="text-sm font-body text-tertiary">
                You can afford to move in now.
              </p>
              <p data-testid="surplus-amount" className="text-sm font-body text-on-surface-variant">
                Monthly surplus: {fmt(result.surplus, currency)}
              </p>
            </>
          )}

          {result.status === AffordabilityStatus.NOT_YET && (
            <>
              <p data-testid="affordability-status" className="text-sm font-body text-on-surface">
                Not quite yet.
              </p>
              <p data-testid="surplus-amount" className="text-sm font-body text-on-surface-variant">
                Monthly surplus: {fmt(result.surplus, currency)}
              </p>
              <p className="text-sm font-body text-on-surface-variant">
                Months until you can move in:{' '}
                <span data-testid="months-to-move-in" className="font-body text-on-surface tabular-nums">
                  {result.monthsToMoveIn}
                </span>
              </p>
            </>
          )}

          {result.status === AffordabilityStatus.INCOME_INSUFFICIENT && (
            <p data-testid="affordability-status" className="text-sm font-body text-error">
              Your income doesn't cover the monthly costs.
              Shortfall: {fmt(result.surplus, currency)}/month.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
