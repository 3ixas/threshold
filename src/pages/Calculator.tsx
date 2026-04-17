import 'maplibre-gl/dist/maplibre-gl.css'
import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import london from '../data/london'
import londonBoroughs from '../data/london-boroughs'
import basel from '../data/basel'
import baselWohnviertel from '../data/basel-wohnviertel'
import zurich from '../data/zurich'
import zurichKreise from '../data/zurich-kreise'
import { useCalculatorState } from '../lib/useCalculatorState'
import { calculateUpfront, calculateMonthly } from '../lib/calculate'
import { getDistrictById, getZoneForDistrict, type DistrictGeoJSON } from '../lib/districts'
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
import type { CalculatorInputs, CityConfig } from '../lib/types'

interface CalculatorProps {
  city: 'london' | 'basel' | 'zurich'
}

// ── London calculator ────────────────────────────────────────────

function LondonCalculator() {
  const [inputs, setInputs] = useCalculatorState(london)
  const [searchParams, setSearchParams] = useSearchParams()

  const inComparisonMode = hasScenarioB(searchParams)

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

  const currentDistrict = getDistrictById(london, inputs.districtId)

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      {/* Nav */}
      <header className="w-full px-8 py-4 border-b border-outline-variant/30 flex items-center gap-4 bg-background">
        <Link to="/" className="text-2xl font-headline italic text-on-surface tracking-wide leading-none">
          Threshold
        </Link>
        <span className="text-accent/70 select-none">·</span>
        <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
          London
        </span>
        <Link
          to="/"
          className="ml-auto flex items-center gap-1 text-xs font-label uppercase tracking-widest text-on-surface-variant/60 hover:text-on-surface transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-sm font-light leading-none" style={{ fontSize: '14px' }}>arrow_back</span>
          Cities
        </Link>
      </header>

      {/* Main: 55% map | 45% controls + results */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Map panel — 55% */}
        <div className="w-full h-[40vh] md:h-[480px] shrink-0 relative">
          <DistrictMap
            geojson={londonBoroughs}
            selectedCode={selectedOnsCode}
            onSelect={handleMapSelect}
            initialViewState={london.mapCenter}
          />
        </div>

        {/* Right panel — 45%, scrollable */}
        <motion.div
          className="flex-1 overflow-y-auto bg-background border-t border-outline-variant/20"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30, delay: 0.08 }}
        >
          <div className="px-8 md:px-12 py-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">
            {/* District heading */}
            <div>
              <h1 className="text-2xl md:text-3xl font-headline text-on-surface leading-tight">
                {currentDistrict?.name ?? 'Select a borough'}
              </h1>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1.5">
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
            <div className="border-t border-outline-variant/20 pt-5">
              <ConfigPanel
                config={london}
                inputs={inputs}
                onChange={setInputs}
              />
            </div>

            {/* What-if suggestions */}
            {suggestions.length > 0 && !inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-5">
                <SuggestionsPanel
                  suggestions={suggestions}
                  currency="GBP"
                  onApply={setInputs}
                />
              </div>
            )}

            {/* Results (single scenario) */}
            {!inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-5">
                <ResultsPanel
                  monthly={monthly}
                  upfront={upfront}
                  currency="GBP"
                  lastUpdated={new Date(london.lastUpdated).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                />
                <button
                  type="button"
                  onClick={enterComparison}
                  className="mt-6 w-full py-3 bg-surface-container text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-accent hover:bg-accent-muted transition-[background-color,color] duration-200 active:scale-[0.96] active:transition-none"
                >
                  Compare two scenarios
                </button>
              </div>
            )}

            {/* Comparison mode */}
            {inComparisonMode && scenarioBInputs && monthlyB && upfrontB && (
              <div className="border-t border-outline-variant/20 pt-5 flex flex-col gap-6">
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
              <div className="border-t border-outline-variant/20 pt-5">
                <AffordabilityPanel
                  takeHome={inputs.takeHome ?? 0}
                  savings={inputs.savings ?? 0}
                  result={affordability}
                  currency="GBP"
                  onTakeHomeChange={v => setInputs({ ...inputs, takeHome: v || undefined })}
                  onSavingsChange={v => setInputs({ ...inputs, savings: v || undefined })}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── Swiss calculator (Basel + Zurich) ────────────────────────────

interface SwissCalculatorProps {
  config: CityConfig
  geojson: DistrictGeoJSON
}

function SwissCalculator({ config, geojson }: SwissCalculatorProps) {
  const [inputs, setInputs] = useCalculatorState(config)
  const [searchParams, setSearchParams] = useSearchParams()

  const monthly = useMemo(() => calculateMonthly(config, inputs), [config, inputs])
  const upfront = useMemo(() => calculateUpfront(config, inputs), [config, inputs])
  const suggestions = useMemo(() => generateSuggestions(inputs, config), [inputs, config])

  const inComparisonMode = hasScenarioB(searchParams)

  const scenarioBInputs = useMemo(
    () => inComparisonMode ? deserialiseScenarioB(searchParams, config) : null,
    [searchParams, inComparisonMode, config]
  )
  const monthlyB = useMemo(
    () => scenarioBInputs ? calculateMonthly(config, scenarioBInputs) : null,
    [scenarioBInputs, config]
  )
  const upfrontB = useMemo(
    () => scenarioBInputs ? calculateUpfront(config, scenarioBInputs) : null,
    [scenarioBInputs, config]
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

  // For Swiss cities, GeoJSON code === districtId — direct 1:1 mapping
  const selectedCode = inputs.districtId

  const handleMapSelect = useCallback((code: string) => {
    setInputs({ ...inputs, districtId: code })
  }, [inputs, setInputs])

  const handleDistrictChange = useCallback((districtId: string) => {
    setInputs({ ...inputs, districtId })
  }, [inputs, setInputs])

  const enterComparison = useCallback(() => {
    const aParams = serialise(inputs)
    const bParams = serialiseScenarioB({ ...inputs })
    setSearchParams(mergeScenariosIntoParams(aParams, bParams), { replace: true })
  }, [inputs, setSearchParams])

  const exitComparison = useCallback(() => {
    setSearchParams(serialise(deserialise(searchParams, config)), { replace: true })
  }, [searchParams, config, setSearchParams])

  const setScenarioB = useCallback((updated: CalculatorInputs) => {
    const aParams = serialise(inputs)
    const bParams = serialiseScenarioB(updated)
    setSearchParams(mergeScenariosIntoParams(aParams, bParams), { replace: true })
  }, [inputs, setSearchParams])

  const currentDistrict = getDistrictById(config, inputs.districtId)
  const currency = config.currency

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="w-full px-8 py-4 border-b border-outline-variant/30 flex items-center gap-4 bg-background">
        <Link to="/" className="text-2xl font-headline italic text-on-surface tracking-wide leading-none">Threshold</Link>
        <span className="text-accent/70 select-none">·</span>
        <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">{config.name}</span>
        <Link
          to="/"
          className="ml-auto flex items-center gap-1 text-xs font-label uppercase tracking-widest text-on-surface-variant/60 hover:text-on-surface transition-colors duration-150"
        >
          <span className="material-symbols-outlined font-light" style={{ fontSize: '14px' }}>arrow_back</span>
          Cities
        </Link>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="w-full h-[40vh] md:h-[480px] shrink-0 relative">
          <DistrictMap geojson={geojson} selectedCode={selectedCode} onSelect={handleMapSelect} initialViewState={config.mapCenter} />
        </div>

        <motion.div
          className="flex-1 overflow-y-auto bg-background border-t border-outline-variant/20"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30, delay: 0.08 }}
        >
          <div className="px-8 md:px-12 py-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-headline text-on-surface leading-tight">
                {currentDistrict?.name ?? 'Select a district'}
              </h1>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1.5">
                {config.name} · {currency}
              </p>
            </div>

            <DistrictSelect
              config={config}
              districtId={inputs.districtId}
              onDistrictChange={handleDistrictChange}
              showZone={false}
            />

            <div className="border-t border-outline-variant/20 pt-5">
              <ConfigPanel config={config} inputs={inputs} onChange={setInputs} />
            </div>

            {suggestions.length > 0 && !inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-5">
                <SuggestionsPanel suggestions={suggestions} currency={currency} onApply={setInputs} />
              </div>
            )}

            {!inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-5">
                <ResultsPanel
                  monthly={monthly} upfront={upfront} currency={currency}
                  lastUpdated={new Date(config.lastUpdated).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                  depositNote="Must be held in a blocked bank account in your name (Art. 257e CO)"
                />
                <button type="button" onClick={enterComparison}
                  className="mt-6 w-full py-3 bg-surface-container text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-accent hover:bg-accent-muted transition-[background-color,color] duration-200 active:scale-[0.96] active:transition-none">
                  Compare two scenarios
                </button>
              </div>
            )}

            {inComparisonMode && scenarioBInputs && monthlyB && upfrontB && (
              <div className="border-t border-outline-variant/20 pt-5 flex flex-col gap-6">
                <ScenarioBConfig config={config} inputs={scenarioBInputs} onChange={setScenarioB} onExit={exitComparison} />
                <ComparisonResults monthlyA={monthly} monthlyB={monthlyB} upfrontA={upfront} upfrontB={upfrontB} currency={currency} />
              </div>
            )}

            {!inComparisonMode && (
              <div className="border-t border-outline-variant/20 pt-5">
                <AffordabilityPanel
                  takeHome={inputs.takeHome ?? 0} savings={inputs.savings ?? 0}
                  result={affordability} currency={currency}
                  onTakeHomeChange={v => setInputs({ ...inputs, takeHome: v || undefined })}
                  onSavingsChange={v => setInputs({ ...inputs, savings: v || undefined })}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Calculator({ city }: CalculatorProps) {
  if (city === 'london') return <LondonCalculator />
  if (city === 'basel') return <SwissCalculator config={basel} geojson={baselWohnviertel} />
  return <SwissCalculator config={zurich} geojson={zurichKreise} />
}
