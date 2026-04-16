import type { CityConfig, CalculatorInputs, PropertyType } from '../lib/types'
import { PROPERTY_TYPE_OPTIONS } from '../lib/types'

const OCCUPANT_OPTIONS: { value: 1 | 2 | 3 | 4; label: string }[] = [
  { value: 1, label: 'Just me' },
  { value: 2, label: 'With a partner' },
  { value: 3, label: 'With 2 flatmates' },
  { value: 4, label: 'With 3 flatmates' },
]

interface Props {
  config: CityConfig
  inputs: CalculatorInputs
  onChange: (inputs: CalculatorInputs) => void
  onExit: () => void
}

export default function ScenarioBConfig({ config, inputs, onChange, onExit }: Props) {
  const set = (patch: Partial<CalculatorInputs>) => onChange({ ...inputs, ...patch })

  return (
    <div className="flex flex-col gap-4 p-5 bg-surface-container-low border border-outline-variant/30">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
          Scenario B
        </p>
        <button
          type="button"
          onClick={onExit}
          className="text-xs font-label uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors duration-150 active:opacity-60 active:transition-none"
          aria-label="Exit comparison mode"
        >
          Exit comparison
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="b-borough" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          Borough
        </label>
        <select
          id="b-borough"
          value={inputs.districtId}
          onChange={e => set({ districtId: e.target.value })}
          className="bg-background border-b border-outline-variant text-on-surface font-body text-sm px-2 py-2 focus:outline-none focus:border-accent"
        >
          {config.districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="b-property" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          Property type
        </label>
        <select
          id="b-property"
          value={inputs.propertyType}
          onChange={e => set({ propertyType: e.target.value as PropertyType })}
          className="bg-background border-b border-outline-variant text-on-surface font-body text-sm px-2 py-2 focus:outline-none focus:border-accent"
        >
          {PROPERTY_TYPE_OPTIONS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="b-living" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          Living arrangement
        </label>
        <select
          id="b-living"
          value={String(inputs.occupants)}
          onChange={e => set({ occupants: Number(e.target.value) as 1 | 2 | 3 | 4 })}
          className="bg-background border-b border-outline-variant text-on-surface font-body text-sm px-2 py-2 focus:outline-none focus:border-accent"
        >
          {OCCUPANT_OPTIONS.map(o => (
            <option key={o.value} value={String(o.value)}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
