import { describe, it, expect } from 'vitest'
import { serialiseScenarioB, deserialiseScenarioB, hasScenarioB, mergeScenariosIntoParams } from './comparison'
import { calculateMonthlyCostsDiff } from './calculate'
import type { CityConfig, CalculatorInputs, MonthlyCosts } from './types'

const config: CityConfig = {
  id: 'london',
  name: 'London',
  currency: 'GBP',
  lastUpdated: '2025-01-01',
  depositRule: 'five_weeks',
  districts: [
    { id: 'hackney', name: 'Hackney', tflZone: 2, councilTaxBandD: 1967, rent: { '1bed': 1900, '2bed': 2350 } },
    { id: 'lewisham', name: 'Lewisham', tflZone: 2, councilTaxBandD: 2135, rent: { '1bed': 1450, '2bed': 1750 } },
  ],
  defaults: { transport: 150, utilities: 140, broadband: 35, food: 300, contentsInsurance: 15, movingCosts: 800, furnitureBudget: 2000, tvLicence: 15 },
  tflAnnualCosts: { 2: 1788 },
  mapCenter: { longitude: -0.12, latitude: 51.50, zoom: 9.5 },
}

const inputsB: CalculatorInputs = {
  districtId: 'lewisham', propertyType: '2bed', occupants: 2,
  lifestyle: { phone: 30, subscriptions: 15, gym: 40, eatingOut: 0, personalCare: 0, savingsTarget: 0 },
}

// ── serialiseScenarioB ─────────────────────────────────────────────

describe('serialiseScenarioB', () => {
  it('prefixes all params with b_', () => {
    const params = serialiseScenarioB(inputsB)
    expect(params.get('b_district')).toBe('lewisham')
    expect(params.get('b_type')).toBe('2bed')
    expect(params.get('b_people')).toBe('2')
  })

  it('does not include un-prefixed params', () => {
    const params = serialiseScenarioB(inputsB)
    expect(params.get('district')).toBeNull()
  })
})

// ── deserialiseScenarioB ───────────────────────────────────────────

describe('deserialiseScenarioB', () => {
  it('restores scenario B from b_-prefixed params', () => {
    const allParams = new URLSearchParams('district=hackney&type=1bed&people=1&b_district=lewisham&b_type=2bed&b_people=2')
    const result = deserialiseScenarioB(allParams, config)
    expect(result.districtId).toBe('lewisham')
    expect(result.propertyType).toBe('2bed')
    expect(result.occupants).toBe(2)
  })

  it('falls back to first district for unknown b_district', () => {
    const allParams = new URLSearchParams('b_district=nowhere&b_type=1bed&b_people=1')
    const result = deserialiseScenarioB(allParams, config)
    expect(result.districtId).toBe(config.districts[0].id)
  })
})

// ── hasScenarioB ───────────────────────────────────────────────────

describe('hasScenarioB', () => {
  it('returns true when b_district param is present', () => {
    const params = new URLSearchParams('district=hackney&b_district=lewisham')
    expect(hasScenarioB(params)).toBe(true)
  })

  it('returns false when no b_ params exist', () => {
    const params = new URLSearchParams('district=hackney&type=1bed')
    expect(hasScenarioB(params)).toBe(false)
  })
})

// ── mergeScenariosIntoParams ───────────────────────────────────────

describe('mergeScenariosIntoParams', () => {
  it('merges A and B params into a single URLSearchParams', () => {
    const aParams = new URLSearchParams('district=hackney&type=1bed&people=1')
    const bParams = new URLSearchParams('b_district=lewisham&b_type=2bed&b_people=2')
    const merged = mergeScenariosIntoParams(aParams, bParams)
    expect(merged.get('district')).toBe('hackney')
    expect(merged.get('b_district')).toBe('lewisham')
  })
})

// ── calculateMonthlyCostsDiff ──────────────────────────────────────

describe('calculateMonthlyCostsDiff', () => {
  const a: MonthlyCosts = {
    rent: 1000, transport: 150, utilities: 70, broadband: 17.5,
    councilTax: 80, healthInsurance: 0, mediaFee: 0, tvLicence: 15,
    food: 300, contentsInsurance: 15, lifestyle: 85, total: 1732.5,
  }
  const b: MonthlyCosts = {
    rent: 875, transport: 150, utilities: 70, broadband: 17.5,
    councilTax: 80, healthInsurance: 0, mediaFee: 0, tvLicence: 15,
    food: 300, contentsInsurance: 15, lifestyle: 85, total: 1607.5,
  }

  it('calculates diff as B minus A for each field', () => {
    const diff = calculateMonthlyCostsDiff(a, b)
    expect(diff.rent).toBeCloseTo(-125, 2)
    expect(diff.total).toBeCloseTo(-125, 2)
  })

  it('returns zero for fields that are the same', () => {
    const diff = calculateMonthlyCostsDiff(a, b)
    expect(diff.transport).toBe(0)
    expect(diff.food).toBe(0)
  })
})
