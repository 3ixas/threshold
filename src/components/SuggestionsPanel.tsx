import type { Suggestion } from '../lib/suggestions'
import type { CalculatorInputs, Currency } from '../lib/types'
import { currencySymbol } from '../lib/format'

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
              'bg-surface-container-low border-b border-outline-variant/30',
              'transition-[background-color,border-color,transform] duration-150 group',
              'supports-[not_(hover:none)]:hover:bg-surface-container supports-[not_(hover:none)]:hover:border-accent/40',
              'active:scale-[0.96] active:transition-none',
            ].join(' ')}
            style={{ transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}
          >
            <span data-testid={`suggestion-${i}-label`} className="text-sm font-body text-on-surface transition-colors duration-150 group-hover:text-accent">
              {s.label}
            </span>
            <span className="flex items-center gap-2 ml-4 shrink-0">
              <span data-testid={`suggestion-${i}-saving`} className="text-sm font-headline tabular-nums text-accent">
                −{currencySymbol[currency]}{Math.round(s.saving).toLocaleString('en-GB')}
              </span>
              <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant">/mo</span>
              <span
                className="text-on-surface-variant group-hover:text-accent group-hover:translate-x-1 transition-[color,transform] duration-150 text-base leading-none"
                style={{ transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}
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
