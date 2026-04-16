import { useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import london from '../data/london'
import londonBoroughs from '../data/london-boroughs'
import { useCalculatorState } from '../lib/useCalculatorState'
import { calculateUpfront, calculateMonthly } from '../lib/calculate'
import { getDistrictById, getZoneForDistrict, getBoroughBounds } from '../lib/districts'
import { serialise, deserialise } from '../lib/url-state'
import { serialiseScenarioB, deserialiseScenarioB, hasScenarioB, mergeScenariosIntoParams } from '../lib/comparison'
import DistrictMap from '../components/DistrictMap'
import DistrictSelect from '../components/DistrictSelect'
import ConfigPanel from '../components/ConfigPanel'
import ResultsPanel from '../components/ResultsPanel'
import AffordabilityPanel from '../components/AffordabilityPanel'
import SuggestionsPanel from '../components/SuggestionsPanel'
import ScenarioBConfig from '../components/ScenarioBConfig'
import ComparisonResults from '../components/ComparisonResults'
import { calculateAffordability } from '../lib/affordability'
import { generateSuggestions } from '../lib/suggestions'
import type { CalculatorInputs } from '../lib/types'

interface CalculatorProps {
  city: 'london' | 'basel' | 'zurich'
}

// ── London calculator ────────────────────────────────────────────

function LondonCalculator() {
  const [inputs, setInputs] = useCalculatorState(london)
  const [searchParams, setSearchParams] = useSearchParams()

  const inComparisonMode = useMemo(() => hasScenarioB(searchParams), [searchParams])

  const scenarioBInputs = useMemo(
    () => inComparisonMode ? deserialiseScenarioB(searchParams, london) : null,
    [searchParams, inComparisonMode]
  )

  const enterComparison = useCallback(() => {
    const aParams = serialise(inputs)
    const bParams = serialiseScenarioB({ ...inputs })
    setSearchParams(mergeScenariosIntoParams(aParams, bParams), { replace: true })
  }, [inputs, setSearchParams])

  const exitComparison = useCallback(() => {
    setSearchParams(serialise(deserialise(searchParams, london)), { replace: true })
  }, [searchParams, setSearchParams])

  const setScenarioB = useCallback((updated: CalculatorInputs) => {
    const aParams = serialise(inputs)
    const bParams = serialiseScenarioB(updated)
    setSearchParams(mergeScenariosIntoParams(aParams, bParams), { replace: true })
  }, [inputs, setSearchParams])

  // Compute results reactively from inputs — no submit button
  const monthly = useMemo(() => calculateMonthly(london, inputs), [inputs])
  const upfront = useMemo(() => calculateUpfront(london, inputs), [inputs])
  const suggestions = useMemo(() => generateSuggestions(inputs, london), [inputs])

  const monthlyB = useMemo(
    () => scenarioBInputs ? calculateMonthly(london, scenarioBInputs) : null,
    [scenarioBInputs]
  )
  const upfrontB = useMemo(
    () => scenarioBInputs ? calculateUpfront(london, scenarioBInputs) : null,
    [scenarioBInputs]
  )

  const affordability = useMemo(() => {
    if (!inputs.takeHome) return null
    return calculateAffordability({
      takeHome: inputs.takeHome,
      savings: inputs.savings ?? 0,
      monthlyTotal: monthly.total,
      upfrontTotal: upfront.total,
    })
  }, [inputs.takeHome, inputs.savings, monthly.total, upfront.total])

  // Map the selected district to its ONS code (needed by DistrictMap)
  const selectedOnsCode = useMemo(() => {
    const district = getDistrictById(london, inputs.districtId)
    if (!district) return null
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
    return londonBoroughs.features.find(
      f => norm(f.properties.name) === norm(district.name)
    )?.properties.code ?? null
  }, [inputs.districtId])

  // Derive the active TfL zone for display in DistrictSelect
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

  const handleMapSelect = useCallback((onsCode: string) => {
    const feature = londonBoroughs.features.find(f => f.properties.code === onsCode)
    if (!feature) return
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
    const district = london.districts.find(d => norm(d.name) === norm(feature.properties.name))
    if (!district) return
    setInputs({ ...inputs, districtId: district.id, transportOverride: undefined })
  }, [inputs, setInputs])

  const handleDistrictChange = useCallback((districtId: string) => {
    setInputs({ ...inputs, districtId, transportOverride: undefined })
  }, [inputs, setInputs])

  const handleZoneChange = useCallback((zone: number) => {
    const annual = london.tflAnnualCosts?.[zone as 1|2|3|4|5|6]
    setInputs({ ...inputs, transportOverride: annual ? annual / 12 : undefined })
  }, [inputs, setInputs])

  const handleConfigChange = useCallback((updated: CalculatorInputs) => {
    setInputs(updated)
  }, [setInputs])

  // fitBounds when district changes via dropdown
  useMemo(() => {
    void getBoroughBounds(londonBoroughs, selectedOnsCode ?? '')
  }, [selectedOnsCode])

  const currentDistrict = getDistrictById(london, inputs.districtId)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="w-full px-8 py-5 border-b border-outline-variant/30 flex items-center gap-6 bg-background">
        <Link to="/" className="text-xl font-headline italic text-on-surface tracking-wide">
          Threshold
        </Link>
        <span className="text-sm font-label uppercase tracking-wider text-on-surface-variant">
          London
        </span>
        <Link to="/" className="ml-auto text-xs font-label uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors">
          Change city
        </Link>
      </header>

      {/* Main: 55% map | 45% controls + results */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Map panel — 55% */}
        <div className="w-full md:w-[55%] h-[45vh] md:h-auto relative">
          <DistrictMap
            geojson={londonBoroughs}
            selectedCode={selectedOnsCode}
            onSelect={handleMapSelect}
          />
        </div>

        {/* Right panel — 45%, scrollable */}
        <div className="w-full md:w-[45%] overflow-y-auto bg-background border-l border-outline-variant/20">
          <div className="px-8 py-8 flex flex-col gap-8">
            {/* District heading */}
            <div>
              <h1 className="text-2xl font-headline text-on-surface">
                {currentDistrict?.name ?? 'Select a borough'}
              </h1>
              <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mt-1">
                London · GBP
              </p>
            </div>

            {/* District + zone selects */}
            <DistrictSelect
              config={london}
              districtId={inputs.districtId}
              tflZone={currentZone}
              onDistrictChange={handleDistrictChange}
              onZoneChange={handleZoneChange}
            />

            {/* Configuration panel */}
            <div className="border-t border-outline-variant/20 pt-6">
              <ConfigPanel
                config={london}
                inputs={inputs}
                onChange={handleConfigChange}
              />
            </div>

            {/* What-if suggestions */}
            {suggestions.length > 0 && !inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-6">
                <SuggestionsPanel
                  suggestions={suggestions}
                  currency="GBP"
                  onApply={setInputs}
                />
              </div>
            )}

            {/* Results (single scenario) */}
            {!inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-6">
                <ResultsPanel
                  monthly={monthly}
                  upfront={upfront}
                  currency="GBP"
                  lastUpdated="April 2026"
                />
                <button
                  type="button"
                  onClick={enterComparison}
                  className="mt-6 w-full py-2 border border-outline-variant text-xs font-label uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:border-primary transition-all"
                >
                  Compare scenarios
                </button>
              </div>
            )}

            {/* Comparison mode */}
            {inComparisonMode && scenarioBInputs && monthlyB && upfrontB && (
              <div className="border-t border-outline-variant/20 pt-6 flex flex-col gap-6">
                <ScenarioBConfig
                  config={london}
                  inputs={scenarioBInputs}
                  onChange={setScenarioB}
                  onExit={exitComparison}
                />
                <ComparisonResults
                  monthlyA={monthly}
                  monthlyB={monthlyB}
                  upfrontA={upfront}
                  upfrontB={upfrontB}
                  currency="GBP"
                />
              </div>
            )}

            {/* Affordability layer (single scenario only) */}
            {!inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-6">
                <AffordabilityPanel
                  takeHome={inputs.takeHome ?? 0}
                  savings={inputs.savings ?? 0}
                  result={affordability}
                  currency="GBP"
                  cityId="london"
                  onTakeHomeChange={v => setInputs({ ...inputs, takeHome: v || undefined })}
                  onSavingsChange={v => setInputs({ ...inputs, savings: v || undefined })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Stubs for Basel / Zurich ─────────────────────────────────────

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
