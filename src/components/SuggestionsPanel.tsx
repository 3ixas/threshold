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
            className="flex items-center justify-between w-full text-left px-4 py-3.5 bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container hover:border-primary/40 transition-all duration-300 group"
          >
            <span className="text-sm font-body text-on-surface group-hover:text-primary transition-colors">
              {s.label}
            </span>
            <span className="flex items-center gap-2 ml-4 shrink-0">
              <span className="text-sm font-headline tabular-nums text-primary">
                −{symbol[currency]}{Math.round(s.saving).toLocaleString('en-GB')}
              </span>
              <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant">/mo</span>
              <span className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 text-base leading-none">
                →
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
