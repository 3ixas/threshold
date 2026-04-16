import { describe, it, expect } from 'vitest'
import { generateSuggestions } from './suggestions'
import type { CityConfig, CalculatorInputs } from './types'

// ── Stub config with predictable rent differences ──────────────────
//
// Districts sorted by 1bed rent: cheap (£1,000) → mid (£1,500) → current (£2,000) → pricey (£2,500)
// Flatmate saving: rent/2 − rent/1 for shared costs, so going from 1→2 occupants
// saves roughly half of rent + shared costs per month.

const config: CityConfig = {
  id: 'london',
  name: 'London',
  currency: 'GBP',
  lastUpdated: '2025-01-01',
  depositRule: 'five_weeks',
  districts: [
    {
      id: 'cheap',
      name: 'Cheap Area',
      tflZone: 4,
      councilTaxBandD: 2000,
      rent: { room: 600, studio: 900, '1bed': 1000, '2bed': 1400, '3bed': 1900 },
    },
    {
      id: 'mid',
      name: 'Mid Area',
      tflZone: 3,
      councilTaxBandD: 2000,
      rent: { room: 800, studio: 1100, '1bed': 1500, '2bed': 2000, '3bed': 2600 },
    },
    {
      id: 'current',
      name: 'Current Area',
      tflZone: 2,
      councilTaxBandD: 2000,
      rent: { room: 900, studio: 1300, '1bed': 2000, '2bed': 2600, '3bed': 3400 },
    },
    {
      id: 'pricey',
      name: 'Pricey Area',
      tflZone: 1,
      councilTaxBandD: 2000,
      rent: { room: 1100, studio: 1700, '1bed': 2500, '2bed': 3200, '3bed': 4200 },
    },
  ],
  defaults: {
    transport: 150, utilities: 140, broadband: 35,
    food: 300, contentsInsurance: 15, movingCosts: 800, furnitureBudget: 2000,
    tvLicence: 15,
  },
  tflAnnualCosts: { 1: 1788, 2: 1788, 3: 2100, 4: 2568 },
  mapCenter: { longitude: -0.12, latitude: 51.50, zoom: 9.5 },
}

const baseInputs: CalculatorInputs = {
  districtId: 'current',
  propertyType: '2bed',
  occupants: 1,
  lifestyle: { phone: 0, subscriptions: 0, gym: 0, eatingOut: 0, personalCare: 0, savingsTarget: 0 },
}

describe('generateSuggestions — cheaper district', () => {
  it('suggests the nearest cheaper district (highest rent below current)', () => {
    const suggestions = generateSuggestions(baseInputs, config)
    const districtSuggestion = suggestions.find(s => s.updatedInputs.districtId !== baseInputs.districtId)
    // 'mid' is nearest cheaper district for 2bed (£2,000 vs £2,600)
    expect(districtSuggestion?.updatedInputs.districtId).toBe('mid')
  })

  it('includes a positive saving for the cheaper district suggestion', () => {
    const suggestions = generateSuggestions(baseInputs, config)
    const districtSuggestion = suggestions.find(s => s.updatedInputs.districtId !== baseInputs.districtId)
    expect(districtSuggestion?.saving).toBeGreaterThan(50)
  })

  it('does not suggest the current district', () => {
    const suggestions = generateSuggestions(baseInputs, config)
    const selfSuggestion = suggestions.find(s => s.updatedInputs.districtId === 'current' &&
      s.updatedInputs.propertyType === '2bed' && s.updatedInputs.occupants === 1)
    expect(selfSuggestion).toBeUndefined()
  })

  it('does not suggest a cheaper district when already in the cheapest', () => {
    const cheapInputs = { ...baseInputs, districtId: 'cheap' }
    const suggestions = generateSuggestions(cheapInputs, config)
    const districtSuggestion = suggestions.find(s => s.updatedInputs.districtId !== 'cheap')
    expect(districtSuggestion).toBeUndefined()
  })
})

describe('generateSuggestions — smaller property type', () => {
  it('suggests one step smaller property type (2bed → 1bed)', () => {
    const suggestions = generateSuggestions(baseInputs, config)
    const typeSuggestion = suggestions.find(
      s => s.updatedInputs.districtId === baseInputs.districtId &&
           s.updatedInputs.propertyType !== baseInputs.propertyType
    )
    expect(typeSuggestion?.updatedInputs.propertyType).toBe('1bed')
  })

  it('does not suggest a smaller property type when already on room', () => {
    const roomInputs = { ...baseInputs, propertyType: 'room' as const }
    const suggestions = generateSuggestions(roomInputs, config)
    const typeSuggestion = suggestions.find(
      s => s.updatedInputs.propertyType !== 'room'
    )
    expect(typeSuggestion).toBeUndefined()
  })
})

describe('generateSuggestions — extra flatmate', () => {
  it('suggests adding a flatmate when occupants < 4', () => {
    const suggestions = generateSuggestions(baseInputs, config)
    const flatmateSuggestion = suggestions.find(
      s => s.updatedInputs.occupants === 2 &&
           s.updatedInputs.districtId === baseInputs.districtId &&
           s.updatedInputs.propertyType === baseInputs.propertyType
    )
    expect(flatmateSuggestion).toBeDefined()
  })

  it('does not suggest extra flatmate when already at 4 occupants', () => {
    const fullHouseInputs = { ...baseInputs, occupants: 4 as const }
    const suggestions = generateSuggestions(fullHouseInputs, config)
    // No suggestion should increase occupants beyond 4
    const flatmateSuggestion = suggestions.find(s => s.updatedInputs.occupants > fullHouseInputs.occupants)
    expect(flatmateSuggestion).toBeUndefined()
  })
})

describe('generateSuggestions — threshold and sorting', () => {
  it('filters out suggestions below the £50 threshold', () => {
    // Use a config where property-type step is tiny — saving < £50
    const tinyDiffConfig: CityConfig = {
      ...config,
      districts: [{
        ...config.districts[2],
        rent: { '1bed': 1000, '2bed': 1040 }, // only £40/mo difference → below threshold
      }],
    }
    const inputs = { ...baseInputs, districtId: 'current' }
    const suggestions = generateSuggestions(inputs, tinyDiffConfig)
    const typeSuggestion = suggestions.find(s => s.updatedInputs.propertyType === '1bed')
    expect(typeSuggestion).toBeUndefined()
  })

  it('returns at most 3 suggestions', () => {
    const suggestions = generateSuggestions(baseInputs, config)
    expect(suggestions.length).toBeLessThanOrEqual(3)
  })

  it('sorts suggestions by saving descending', () => {
    const suggestions = generateSuggestions(baseInputs, config)
    for (let i = 1; i < suggestions.length; i++) {
      expect(suggestions[i - 1].saving).toBeGreaterThanOrEqual(suggestions[i].saving)
    }
  })
})
