import type { CityConfig, CalculatorInputs, PropertyType } from './types'
import { calculateMonthly } from './calculate'

export interface Suggestion {
  label: string
  saving: number
  updatedInputs: CalculatorInputs
}

const PROPERTY_ORDER: PropertyType[] = ['room', 'studio', '1bed', '2bed', '3bed']

const THRESHOLD: Record<CityConfig['currency'], number> = { GBP: 50, CHF: 60 }

function nearestCheaperDistrict(inputs: CalculatorInputs, config: CityConfig) {
  const currentDistrict = config.districts.find(d => d.id === inputs.districtId)
  const currentRent = currentDistrict?.rent[inputs.propertyType]
  if (currentRent === undefined) return null

  // Find all districts with lower rent for this property type, pick the highest (nearest)
  return config.districts
    .filter(d => d.id !== inputs.districtId && (d.rent[inputs.propertyType] ?? Infinity) < currentRent)
    .sort((a, b) => (b.rent[inputs.propertyType] ?? 0) - (a.rent[inputs.propertyType] ?? 0))[0] ?? null
}

function smallerPropertyType(current: PropertyType): PropertyType | null {
  const idx = PROPERTY_ORDER.indexOf(current)
  return idx > 0 ? PROPERTY_ORDER[idx - 1] : null
}

export function generateSuggestions(inputs: CalculatorInputs, config: CityConfig): Suggestion[] {
  const threshold = THRESHOLD[config.currency]
  const currentTotal = calculateMonthly(config, inputs).total
  const suggestions: Suggestion[] = []

  // ── 1. Nearest cheaper district ───────────────
  const cheaper = nearestCheaperDistrict(inputs, config)
  if (cheaper) {
    const altInputs: CalculatorInputs = { ...inputs, districtId: cheaper.id, transportOverride: undefined }
    const saving = Math.round((currentTotal - calculateMonthly(config, altInputs).total) * 100) / 100
    if (saving > threshold) {
      suggestions.push({ label: `Move to ${cheaper.name}`, saving, updatedInputs: altInputs })
    }
  }

  // ── 2. Smaller property type ───────────────────
  const smallerType = smallerPropertyType(inputs.propertyType)
  if (smallerType) {
    const district = config.districts.find(d => d.id === inputs.districtId)
    if (district?.rent[smallerType] !== undefined) {
      const altInputs: CalculatorInputs = { ...inputs, propertyType: smallerType }
      const saving = Math.round((currentTotal - calculateMonthly(config, altInputs).total) * 100) / 100
      if (saving > threshold) {
        const label = smallerType === 'room' ? 'Rent a room instead' : `Downsize to a ${smallerType}`
        suggestions.push({ label, saving, updatedInputs: altInputs })
      }
    }
  }

  // ── 3. Extra flatmate ──────────────────────────
  if (inputs.occupants < 4) {
    const altInputs: CalculatorInputs = {
      ...inputs,
      occupants: (inputs.occupants + 1) as 1 | 2 | 3 | 4,
    }
    const saving = Math.round((currentTotal - calculateMonthly(config, altInputs).total) * 100) / 100
    if (saving > threshold) {
      suggestions.push({ label: 'Add a flatmate', saving, updatedInputs: altInputs })
    }
  }

  return suggestions.sort((a, b) => b.saving - a.saving).slice(0, 3)
}
