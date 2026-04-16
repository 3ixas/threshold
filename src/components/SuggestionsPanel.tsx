import type { Suggestion } from '../lib/suggestions'
import type { CalculatorInputs, Currency } from '../lib/types'

const symbol: Record<Currency, string> = { GBP: '£', CHF: 'CHF ' }

interface Props {
  suggestions: Suggestion[]
  currency: Currency
  onApply: (inputs: CalculatorInputs) => void
}

export default function SuggestionsPanel({ suggestions, currency, onApply }: Props) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
        What if…
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onApply(s.updatedInputs)}
            className={[
              'flex items-center justify-between w-full text-left px-4 py-3.5',
              'bg-surface-container-low border border-outline-variant/30',
              // Specific transition properties only
              'transition-[background-color,border-color,transform] duration-150 group',
              // Hover gated by pointer capability
              'supports-[not_(hover:none)]:hover:bg-surface-container supports-[not_(hover:none)]:hover:border-primary/40',
              // Press feedback
              'active:scale-[0.97] active:transition-none',
            ].join(' ')}
            style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            <span className="text-sm font-body text-on-surface transition-colors duration-150 group-hover:text-primary">
              {s.label}
            </span>
            <span className="flex items-center gap-2 ml-4 shrink-0">
              <span className="text-sm font-headline tabular-nums text-primary">
                −{symbol[currency]}{Math.round(s.saving).toLocaleString('en-GB')}
              </span>
              <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant">/mo</span>
              {/* Arrow: 4px translate at 150ms — visible and snappy */}
              <span className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-[color,transform] duration-150 text-base leading-none"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                →
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
