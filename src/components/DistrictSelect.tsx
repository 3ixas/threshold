import type { CityConfig } from '../lib/types'

const TFL_ZONES = [1, 2, 3, 4, 5, 6] as const

interface Props {
  config: CityConfig
  districtId: string
  tflZone: number
  onDistrictChange: (districtId: string) => void
  onZoneChange: (zone: number) => void
  /** Whether to show the TfL zone override select. Defaults to true. */
  showZone?: boolean
  /** Override the dropdown label. Defaults to 'Borough' for London, 'District' for Swiss. */
  districtLabel?: string
}

export default function DistrictSelect({
  config,
  districtId,
  tflZone,
  onDistrictChange,
  onZoneChange,
  showZone = true,
  districtLabel,
}: Props) {
  const label = districtLabel ?? (config.id === 'london' ? 'Borough' : 'District')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="borough-select" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          {label}
        </label>
        <select
          id="borough-select"
          value={districtId}
          onChange={e => onDistrictChange(e.target.value)}
          className="bg-surface-container-low border-b border-outline-variant text-on-surface font-body text-sm px-3 py-2 focus:outline-none focus:border-accent"
        >
          {config.districts.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {showZone && <div className="flex flex-col gap-1">
        <label htmlFor="zone-select" className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
          TfL Zone
        </label>
        <select
          id="zone-select"
          value={String(tflZone)}
          onChange={e => onZoneChange(Number(e.target.value))}
          className="bg-surface-container-low border-b border-outline-variant text-on-surface font-body text-sm px-3 py-2 focus:outline-none focus:border-accent"
        >
          {TFL_ZONES.map(z => (
            <option key={z} value={String(z)}>
              Zone {z}
            </option>
          ))}
        </select>
      </div>}
    </div>
  )
}
