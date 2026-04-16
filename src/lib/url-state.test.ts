import { describe, it, expect } from 'vitest'
import { serialise, deserialise } from './url-state'
import type { CityConfig, CalculatorInputs } from './types'

const config: CityConfig = {
  id: 'london',
  name: 'London',
  currency: 'GBP',
  lastUpdated: '2025-01-01',
  depositRule: 'five_weeks',
  districts: [
    {
      id: 'hackney',
      name: 'Hackney',
      tflZone: 2,
      councilTaxBandD: 1836,
      rent: { room: 1050, '1bed': 1900, '2bed': 2400 },
    },
    {
      id: 'southwark',
      name: 'Southwark',
      tflZone: 1,
      councilTaxBandD: 1669,
      rent: { '1bed': 2100 },
    },
  ],
  defaults: {
    transport: 153,
    utilities: 140,
    broadband: 35,
    food: 300,
    contentsInsurance: 15,
    movingCosts: 800,
    furnitureBudget: 2000,
    tvLicence: 13.25,
  },
  tflAnnualCosts: { 1: 1580, 2: 1800 },
}

const fullInputs: CalculatorInputs = {
  districtId: 'hackney',
  propertyType: '1bed',
  occupants: 2,
  lifestyle: {
    phone: 30,
    subscriptions: 15,
    gym: 40,
    eatingOut: 100,
    personalCare: 50,
    savingsTarget: 200,
  },
  food: 350,
  broadbandOverride: 40,
  movingCostsOverride: 900,
  furnitureBudgetOverride: 2500,
  transportOverride: 120,
  healthInsuranceOverride: 380,
}

// ─────────────────────────────────────────────────────
// serialise
// ─────────────────────────────────────────────────────

describe('serialise', () => {
  it('serialises district, type, and people', () => {
    const p = serialise(fullInputs)
    expect(p.get('district')).toBe('hackney')
    expect(p.get('type')).toBe('1bed')
    expect(p.get('people')).toBe('2')
  })

  it('serialises all lifestyle cost fields', () => {
    const p = serialise(fullInputs)
    expect(p.get('phone')).toBe('30')
    expect(p.get('subs')).toBe('15')
    expect(p.get('gym')).toBe('40')
    expect(p.get('eating')).toBe('100')
    expect(p.get('care')).toBe('50')
    expect(p.get('savings')).toBe('200')
  })

  it('serialises all optional overrides when present', () => {
    const p = serialise(fullInputs)
    expect(p.get('food')).toBe('350')
    expect(p.get('broadband')).toBe('40')
    expect(p.get('moving')).toBe('900')
    expect(p.get('furniture')).toBe('2500')
    expect(p.get('transport')).toBe('120')
    expect(p.get('health')).toBe('380')
  })

  it('omits optional override params when not set', () => {
    const minimal: CalculatorInputs = {
      districtId: 'hackney',
      propertyType: '1bed',
      occupants: 1,
      lifestyle: { phone: 0, subscriptions: 0, gym: 0, eatingOut: 0, personalCare: 0, savingsTarget: 0 },
    }
    const p = serialise(minimal)
    expect(p.get('food')).toBeNull()
    expect(p.get('broadband')).toBeNull()
    expect(p.get('transport')).toBeNull()
    expect(p.get('health')).toBeNull()
  })
})

// ─────────────────────────────────────────────────────
// deserialise
// ─────────────────────────────────────────────────────

describe('deserialise', () => {
  it('restores all core fields', () => {
    const p = new URLSearchParams('district=hackney&type=1bed&people=2')
    const r = deserialise(p, config)
    expect(r.districtId).toBe('hackney')
    expect(r.propertyType).toBe('1bed')
    expect(r.occupants).toBe(2)
  })

  it('restores all lifestyle costs', () => {
    const p = new URLSearchParams('district=hackney&type=1bed&people=1&phone=30&subs=15&gym=40&eating=100&care=50&savings=200')
    const r = deserialise(p, config)
    expect(r.lifestyle).toEqual({ phone: 30, subscriptions: 15, gym: 40, eatingOut: 100, personalCare: 50, savingsTarget: 200 })
  })

  it('restores all optional overrides', () => {
    const p = new URLSearchParams('district=hackney&type=1bed&people=1&food=350&broadband=40&moving=900&furniture=2500&transport=120&health=380')
    const r = deserialise(p, config)
    expect(r.food).toBe(350)
    expect(r.broadbandOverride).toBe(40)
    expect(r.movingCostsOverride).toBe(900)
    expect(r.furnitureBudgetOverride).toBe(2500)
    expect(r.transportOverride).toBe(120)
    expect(r.healthInsuranceOverride).toBe(380)
  })

  it('accepts occupants 3 and 4', () => {
    expect(deserialise(new URLSearchParams('district=hackney&type=1bed&people=3'), config).occupants).toBe(3)
    expect(deserialise(new URLSearchParams('district=hackney&type=1bed&people=4'), config).occupants).toBe(4)
  })
})

// ─────────────────────────────────────────────────────
// round-trip
// ─────────────────────────────────────────────────────

describe('round-trip', () => {
  it('serialise then deserialise produces identical CalculatorInputs', () => {
    expect(deserialise(serialise(fullInputs), config)).toEqual(fullInputs)
  })

  it('round-trips minimal inputs without optional overrides', () => {
    const minimal: CalculatorInputs = {
      districtId: 'southwark',
      propertyType: '1bed',
      occupants: 1,
      lifestyle: { phone: 25, subscriptions: 10, gym: 0, eatingOut: 30, personalCare: 0, savingsTarget: 0 },
    }
    expect(deserialise(serialise(minimal), config)).toEqual(minimal)
  })
})

// ─────────────────────────────────────────────────────
// fallbacks
// ─────────────────────────────────────────────────────

describe('deserialise fallbacks', () => {
  it('falls back to first district when district param is missing', () => {
    expect(deserialise(new URLSearchParams('type=1bed&people=1'), config).districtId).toBe('hackney')
  })

  it('falls back to first district when district is unknown', () => {
    expect(deserialise(new URLSearchParams('district=nowhere&type=1bed&people=1'), config).districtId).toBe('hackney')
  })

  it('falls back to 1bed when type param is invalid', () => {
    expect(deserialise(new URLSearchParams('district=hackney&type=penthouse&people=1'), config).propertyType).toBe('1bed')
  })

  it('falls back to 1 occupant when people is out-of-range', () => {
    expect(deserialise(new URLSearchParams('district=hackney&type=1bed&people=9'), config).occupants).toBe(1)
  })

  it('falls back lifestyle costs to 0 when params are missing', () => {
    const r = deserialise(new URLSearchParams('district=hackney&type=1bed&people=1'), config)
    expect(r.lifestyle).toEqual({ phone: 0, subscriptions: 0, gym: 0, eatingOut: 0, personalCare: 0, savingsTarget: 0 })
  })

  it('falls back lifestyle cost to 0 when param is non-numeric', () => {
    const r = deserialise(new URLSearchParams('district=hackney&type=1bed&people=1&gym=lots'), config)
    expect(r.lifestyle.gym).toBe(0)
  })

  it('omits optional overrides when params are missing or non-numeric', () => {
    const r = deserialise(new URLSearchParams('district=hackney&type=1bed&people=1&transport=fast'), config)
    expect(r.transportOverride).toBeUndefined()
    expect(r.food).toBeUndefined()
  })
})
