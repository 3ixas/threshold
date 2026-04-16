import { describe, it, expect } from 'vitest'
import { calculateUpfront, calculateMonthly } from './calculate'
import type { CityConfig, CalculatorInputs } from './types'

// ── Minimal stub configs for deterministic tests ──

const londonStub: CityConfig = {
  id: 'london',
  name: 'London',
  currency: 'GBP',
  lastUpdated: '2025-01-01',
  depositRule: 'five_weeks',
  districts: [
    {
      id: 'zone2',
      name: 'Zone 2 Borough',
      tflZone: 2,
      councilTaxBandD: 1200,  // £100/month at Band D
      rent: { '1bed': 2000, room: 1000 },
    },
    {
      id: 'zone1',
      name: 'Zone 1 Borough',
      tflZone: 1,
      councilTaxBandD: 1800,
      rent: { '1bed': 2600 },
    },
  ],
  defaults: {
    transport: 130,
    utilities: 140,
    broadband: 35,
    food: 300,
    contentsInsurance: 15,
    movingCosts: 800,
    furnitureBudget: 2000,
    tvLicence: 13.25,
  },
  tflAnnualCosts: { 1: 1200, 2: 1800, 3: 2400 },
}

const swissStub: CityConfig = {
  id: 'basel',
  name: 'Basel',
  currency: 'CHF',
  lastUpdated: '2025-01-01',
  depositRule: 'three_months',
  districts: [
    {
      id: 'district-a',
      name: 'District A',
      rent: { '1bed': 1500, room: 900 },
    },
  ],
  defaults: {
    transport: 86,
    utilities: 120,
    broadband: 40,
    food: 400,
    contentsInsurance: 20,
    movingCosts: 600,
    furnitureBudget: 2000,
    healthInsurance: 420,
    mediaFee: 9.35,
  },
}

const baseInputs: CalculatorInputs = {
  districtId: 'zone2',
  propertyType: '1bed',
  occupants: 1,
  lifestyle: { phone: 30, gym: 40, subscriptions: 15, eatingOut: 0, personalCare: 0, savingsTarget: 50 },
}

// ─────────────────────────────────────────────────────
// calculateUpfront
// ─────────────────────────────────────────────────────

describe('calculateUpfront', () => {
  describe('five-week deposit (London rule)', () => {
    it('calculates security deposit as 5 weeks rent', () => {
      // £2000/month → weekly = 2000 × 12 / 52 = 461.538... → × 5 = 2307.69 → rounded to 2 dp
      const result = calculateUpfront(londonStub, baseInputs)
      expect(result.securityDeposit).toBeCloseTo(2307.69, 1)
    })

    it('includes first month rent equal to the district rent', () => {
      const result = calculateUpfront(londonStub, baseInputs)
      expect(result.firstMonthRent).toBe(2000)
    })

    it('includes city-level moving costs and furniture budget', () => {
      const result = calculateUpfront(londonStub, baseInputs)
      expect(result.movingCosts).toBe(800)
      expect(result.furnitureBudget).toBe(2000)
    })

    it('total is sum of all upfront items', () => {
      const result = calculateUpfront(londonStub, baseInputs)
      const expected = result.securityDeposit + result.firstMonthRent + result.movingCosts + result.furnitureBudget
      expect(result.total).toBeCloseTo(expected, 2)
    })
  })

  describe('three-month deposit (Swiss rule)', () => {
    it('calculates security deposit as 3 months rent', () => {
      const swissInputs: CalculatorInputs = { ...baseInputs, districtId: 'district-a' }
      const result = calculateUpfront(swissStub, swissInputs)
      expect(result.securityDeposit).toBe(4500)  // 1500 × 3
    })
  })

  describe('room property type', () => {
    it('uses the room rent tier, distinct from whole-property types', () => {
      const roomInputs: CalculatorInputs = { ...baseInputs, propertyType: 'room' }
      const result = calculateUpfront(londonStub, roomInputs)
      // room rent is £1000, not £2000 (1bed)
      expect(result.firstMonthRent).toBe(1000)
    })
  })
})

// ─────────────────────────────────────────────────────
// calculateMonthly
// ─────────────────────────────────────────────────────

describe('calculateMonthly', () => {
  describe('shared costs split by occupant count', () => {
    it('rent is divided by occupant count', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const one = calculateMonthly(londonStub, baseInputs)
      const two = calculateMonthly(londonStub, twoPersonInputs)
      expect(two.rent).toBe(one.rent / 2)
    })

    it('utilities are divided by occupant count', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const one = calculateMonthly(londonStub, baseInputs)
      const two = calculateMonthly(londonStub, twoPersonInputs)
      expect(two.utilities).toBe(one.utilities / 2)
    })

    it('broadband is divided by occupant count', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const one = calculateMonthly(londonStub, baseInputs)
      const two = calculateMonthly(londonStub, twoPersonInputs)
      expect(two.broadband).toBe(one.broadband / 2)
    })
  })

  describe('per-person costs never split', () => {
    it('transport is the same regardless of occupant count', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const one = calculateMonthly(londonStub, baseInputs)
      const two = calculateMonthly(londonStub, twoPersonInputs)
      expect(two.transport).toBe(one.transport)
    })

    it('food is the same regardless of occupant count', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const one = calculateMonthly(londonStub, baseInputs)
      const two = calculateMonthly(londonStub, twoPersonInputs)
      expect(two.food).toBe(one.food)
    })

    it('contentsInsurance is the same regardless of occupant count', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const one = calculateMonthly(londonStub, baseInputs)
      const two = calculateMonthly(londonStub, twoPersonInputs)
      expect(two.contentsInsurance).toBe(one.contentsInsurance)
    })

    it('lifestyle costs are the same regardless of occupant count', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const one = calculateMonthly(londonStub, baseInputs)
      const two = calculateMonthly(londonStub, twoPersonInputs)
      expect(two.lifestyle).toBe(one.lifestyle)
    })
  })

  describe('London council tax', () => {
    it('single occupant pays Band D rate with 25% discount', () => {
      // councilTaxBandD=1200 → monthly=100 → 25% off → 75
      const result = calculateMonthly(londonStub, baseInputs)
      expect(result.councilTax).toBeCloseTo(75, 2)
    })

    it('two occupants each pay half of Band D rate with no discount', () => {
      const twoPersonInputs: CalculatorInputs = { ...baseInputs, occupants: 2 }
      const result = calculateMonthly(londonStub, twoPersonInputs)
      // 100 / 2 = 50 each
      expect(result.councilTax).toBeCloseTo(50, 2)
    })
  })

  describe('London TfL transport', () => {
    it('derives monthly transport from district TfL zone and annual cost table', () => {
      // zone2 → tflAnnualCosts[2] = 1800 → monthly = 150
      const result = calculateMonthly(londonStub, baseInputs)
      expect(result.transport).toBeCloseTo(150, 2)
    })

    it('uses transportOverride when provided', () => {
      const overrideInputs: CalculatorInputs = { ...baseInputs, transportOverride: 99 }
      const result = calculateMonthly(londonStub, overrideInputs)
      expect(result.transport).toBe(99)
    })
  })

  describe('Swiss health insurance', () => {
    it('uses city default when no override provided', () => {
      const swissInputs: CalculatorInputs = { ...baseInputs, districtId: 'district-a' }
      const result = calculateMonthly(swissStub, swissInputs)
      expect(result.healthInsurance).toBe(420)
    })

    it('uses healthInsuranceOverride when provided', () => {
      const swissInputs: CalculatorInputs = {
        ...baseInputs,
        districtId: 'district-a',
        healthInsuranceOverride: 380,
      }
      const result = calculateMonthly(swissStub, swissInputs)
      expect(result.healthInsurance).toBe(380)
    })
  })

  describe('total', () => {
    it('total equals the sum of all monthly line items', () => {
      const result = calculateMonthly(londonStub, baseInputs)
      const sum = result.rent + result.transport + result.utilities + result.broadband
        + result.councilTax + result.healthInsurance + result.mediaFee + result.tvLicence
        + result.food + result.contentsInsurance + result.lifestyle
      expect(result.total).toBeCloseTo(sum, 2)
    })
  })
})
