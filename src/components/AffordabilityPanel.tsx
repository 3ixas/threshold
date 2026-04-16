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
          Enter your income and savings to see your monthly surplus and how long until you can move in.
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
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
            <p className="text-xs font-body text-on-surface-variant/60 mt-0.5">
              Don't include health insurance in your take-home — we've already counted it above.
            </p>
          )}
        </div>

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
      </div>

      {/* Result */}
      {result && (
        <div className="border-t border-outline-variant/20 pt-5">
          {result.status === AffordabilityStatus.CAN_AFFORD_NOW && (
            <div className="bg-surface-container-low px-5 py-5">
              <p className="text-[10px] font-label uppercase tracking-widest text-tertiary mb-2">
                You can move in now
              </p>
              <p data-testid="affordability-status" className="text-4xl font-headline tabular-nums text-tertiary leading-none">
                {fmt(result.surplus, currency)}
                <span className="text-base font-label ml-2 tracking-wider">/mo surplus</span>
              </p>
            </div>
          )}

          {result.status === AffordabilityStatus.NOT_YET && (
            <div className="flex flex-col gap-5">
              <div className="bg-surface-container-low px-5 py-5">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">
                  Months until you can move in
                </p>
                <p data-testid="months-to-move-in" className="text-5xl font-headline tabular-nums text-on-surface leading-none">
                  {result.monthsToMoveIn}
                </p>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant">Monthly surplus</span>
                <span data-testid="surplus-amount" className="text-sm font-body tabular-nums text-on-surface">
                  {fmt(result.surplus, currency)}
                </span>
              </div>
              <p data-testid="affordability-status" className="sr-only">Not quite yet</p>
            </div>
          )}

          {result.status === AffordabilityStatus.INCOME_INSUFFICIENT && (
            <div className="bg-surface-container-low px-5 py-5">
              <p className="text-[10px] font-label uppercase tracking-widest text-error mb-2">
                Income insufficient
              </p>
              <p data-testid="affordability-status" className="text-2xl font-headline tabular-nums text-error leading-none">
                −{fmt(result.surplus, currency)}
                <span className="text-sm font-label ml-2 tracking-wider">/mo shortfall</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
