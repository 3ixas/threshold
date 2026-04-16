import { useState } from 'react'
import type { CityConfig, CalculatorInputs, PropertyType } from '../lib/types'

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'room',   label: 'Room' },
  { value: 'studio', label: 'Studio' },
  { value: '1bed',   label: '1-bed' },
  { value: '2bed',   label: '2-bed' },
  { value: '3bed',   label: '3-bed' },
]

const ARRANGEMENTS: { value: 1 | 2 | 3 | 4; label: string }[] = [
  { value: 1, label: 'Just me' },
  { value: 2, label: 'With a partner' },
  { value: 2, label: 'With 1 flatmate' },
  { value: 3, label: 'With 2 flatmates' },
  { value: 4, label: 'With 3 flatmates' },
]

interface Props {
  config: CityConfig
  inputs: CalculatorInputs
  onChange: (inputs: CalculatorInputs) => void
}

interface NumberInputProps {
  label: string
  id: string
  value: number
  prefix?: string
  onChange: (value: number) => void
}

function NumberInput({ label, id, value, prefix = '£', onChange }: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
        {label}
      </label>
      <div className="flex items-center bg-surface-container border-b border-outline-variant focus-within:border-primary">
        <span className="text-sm font-body text-on-surface-variant px-2">{prefix}</span>
        <input
          id={id}
          type="number"
          min={0}
          value={value}
          onChange={e => onChange(Math.max(0, Number(e.target.value)))}
          className="flex-1 bg-transparent text-sm font-body tabular-nums text-on-surface py-2 pr-2 focus:outline-none text-right"
        />
      </div>
    </div>
  )
}

export default function ConfigPanel({ config, inputs, onChange }: Props) {
  const [lifestyleOpen, setLifestyleOpen] = useState(false)

  const d = config.defaults

  const set = (patch: Partial<CalculatorInputs>) => onChange({ ...inputs, ...patch })
  const setLifestyle = (patch: Partial<CalculatorInputs['lifestyle']>) =>
    set({ lifestyle: { ...inputs.lifestyle, ...patch } })

  return (
    <div className="flex flex-col gap-6">
      {/* Property type */}
      <div className="flex flex-col gap-1">
        <label htmlFor="property-type" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          Property type
        </label>
        <select
          id="property-type"
          value={inputs.propertyType}
          onChange={e => set({ propertyType: e.target.value as PropertyType })}
          className="bg-surface-container border-b border-outline-variant text-on-surface font-body text-sm px-2 py-2 focus:outline-none focus:border-primary"
        >
          {PROPERTY_TYPES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Living arrangement */}
      <div className="flex flex-col gap-1">
        <label htmlFor="living-arrangement" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          Living arrangement
        </label>
        <select
          id="living-arrangement"
          value={String(inputs.occupants)}
          onChange={e => set({ occupants: Number(e.target.value) as 1 | 2 | 3 | 4 })}
          className="bg-surface-container border-b border-outline-variant text-on-surface font-body text-sm px-2 py-2 focus:outline-none focus:border-primary"
        >
          {ARRANGEMENTS.map((a, i) => (
            <option key={i} value={String(a.value)}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* Adjustable cost inputs */}
      <NumberInput
        label="Monthly food budget"
        id="food"
        value={inputs.food ?? d.food}
        onChange={v => set({ food: v })}
      />
      <NumberInput
        label="Moving costs"
        id="moving-costs"
        value={inputs.movingCostsOverride ?? d.movingCosts}
        onChange={v => set({ movingCostsOverride: v })}
      />
      <NumberInput
        label="Furniture & setup"
        id="furniture"
        value={inputs.furnitureBudgetOverride ?? d.furnitureBudget}
        onChange={v => set({ furnitureBudgetOverride: v })}
      />
      <NumberInput
        label="Broadband"
        id="broadband"
        value={inputs.broadbandOverride ?? d.broadband}
        onChange={v => set({ broadbandOverride: v })}
      />

      {/* Lifestyle costs — collapsible */}
      <div>
        <button
          type="button"
          onClick={() => setLifestyleOpen(o => !o)}
          className="flex w-full items-center justify-between py-2 text-xs font-label uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/20"
        >
          <span>Lifestyle costs</span>
          <span className="text-lg leading-none">{lifestyleOpen ? '−' : '+'}</span>
        </button>

        {lifestyleOpen && (
          <div className="flex flex-col gap-4 pt-4">
            <NumberInput label="Phone bill" id="phone" value={inputs.lifestyle.phone} onChange={v => setLifestyle({ phone: v })} />
            <NumberInput label="Subscriptions" id="subscriptions" value={inputs.lifestyle.subscriptions} onChange={v => setLifestyle({ subscriptions: v })} />
            <NumberInput label="Gym" id="gym" value={inputs.lifestyle.gym} onChange={v => setLifestyle({ gym: v })} />
            <NumberInput label="Eating out" id="eating-out" value={inputs.lifestyle.eatingOut} onChange={v => setLifestyle({ eatingOut: v })} />
            <NumberInput label="Personal care" id="personal-care" value={inputs.lifestyle.personalCare} onChange={v => setLifestyle({ personalCare: v })} />
            <NumberInput label="Savings target" id="savings-target" value={inputs.lifestyle.savingsTarget} onChange={v => setLifestyle({ savingsTarget: v })} />
          </div>
        )}
      </div>
    </div>
  )
}
