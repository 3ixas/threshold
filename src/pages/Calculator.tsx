import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import london from '../data/london'
import londonBoroughs from '../data/london-boroughs'
import { useCalculatorState } from '../lib/useCalculatorState'
import { getDistrictById, getZoneForDistrict, getBoroughBounds } from '../lib/districts'
import DistrictMap from '../components/DistrictMap'
import DistrictSelect from '../components/DistrictSelect'

interface CalculatorProps {
  city: 'london' | 'basel' | 'zurich'
}

// ── London calculator ────────────────────────────────────────────

function LondonCalculator() {
  const [inputs, setInputs] = useCalculatorState(london)

  // Derive the ONS code for the selected district (needed by DistrictMap)
  const selectedOnsCode = useMemo(() => {
    const district = getDistrictById(london, inputs.districtId)
    if (!district) return null
    return londonBoroughs.features.find(
      f => f.properties.name.toLowerCase().replace(/[^a-z]/g, '') ===
           district.name.toLowerCase().replace(/[^a-z]/g, '')
    )?.properties.code ?? null
  }, [inputs.districtId])

  // Derive TfL zone: use transportOverride back-mapped to zone, else district zone
  const currentZone = useMemo((): number => {
    if (inputs.transportOverride !== undefined && london.tflAnnualCosts) {
      const annual = inputs.transportOverride * 12
      const match = Object.entries(london.tflAnnualCosts).find(
        ([, cost]) => Math.abs(cost - annual) < 1
      )
      if (match) return Number(match[0])
    }
    return getZoneForDistrict(london, inputs.districtId) ?? 2
  }, [inputs.districtId, inputs.transportOverride])

  const handleDistrictSelect = useCallback((onsCode: string) => {
    const feature = londonBoroughs.features.find(f => f.properties.code === onsCode)
    if (!feature) return
    // Match ONS name → london district id
    const normalise = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
    const district = london.districts.find(
      d => normalise(d.name) === normalise(feature.properties.name)
    )
    if (!district) return
    // Auto-assign zone from district config; clear any zone override
    setInputs({ ...inputs, districtId: district.id, transportOverride: undefined })
  }, [inputs, setInputs])

  const handleDistrictChange = useCallback((districtId: string) => {
    const bounds = (() => {
      const feature = londonBoroughs.features.find(f => {
        const d = getDistrictById(london, districtId)
        if (!d) return false
        const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
        return norm(f.properties.name) === norm(d.name)
      })
      return feature ? getBoroughBounds(londonBoroughs, feature.properties.code) : undefined
    })()
    void bounds // bounds consumed by DistrictMap via selectedCode change
    setInputs({ ...inputs, districtId, transportOverride: undefined })
  }, [inputs, setInputs])

  const handleZoneChange = useCallback((zone: number) => {
    const annual = london.tflAnnualCosts?.[zone as 1|2|3|4|5|6]
    const transportOverride = annual ? annual / 12 : undefined
    setInputs({ ...inputs, transportOverride })
  }, [inputs, setInputs])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="w-full px-8 py-5 border-b border-outline-variant flex items-center gap-6">
        <Link to="/" className="text-xl font-headline italic text-on-surface tracking-wide">
          Threshold
        </Link>
        <span className="text-sm font-label uppercase tracking-wider text-on-surface-variant">
          London
        </span>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map panel */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
          <DistrictMap
            geojson={londonBoroughs}
            selectedCode={selectedOnsCode}
            onSelect={handleDistrictSelect}
          />
        </div>

        {/* Controls panel */}
        <div className="w-full md:w-1/2 p-8 flex flex-col gap-8 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-headline text-on-surface mb-1">
              {getDistrictById(london, inputs.districtId)?.name ?? 'Select a borough'}
            </h1>
            <p className="text-sm font-label uppercase tracking-wider text-on-surface-variant">
              London · GBP
            </p>
          </div>

          <DistrictSelect
            config={london}
            districtId={inputs.districtId}
            tflZone={currentZone}
            onDistrictChange={handleDistrictChange}
            onZoneChange={handleZoneChange}
          />
        </div>
      </div>
    </div>
  )
}

// ── Stub for Basel / Zurich (future slices) ──────────────────────

const cityLabels: Record<CalculatorProps['city'], string> = {
  london: 'London',
  basel: 'Basel',
  zurich: 'Zurich',
}

function StubCalculator({ city }: CalculatorProps) {
  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-headline">{cityLabels[city]}</h1>
        <p className="text-sm font-label uppercase tracking-wider text-on-surface-variant">
          Calculator — coming soon
        </p>
      </div>
    </div>
  )
}

export default function Calculator({ city }: CalculatorProps) {
  if (city === 'london') return <LondonCalculator />
  return <StubCalculator city={city} />
}
