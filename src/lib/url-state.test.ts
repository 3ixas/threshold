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
  lifestyle: { phone: 30, gym: 40, streaming: 15, other: 50 },
  transportOverride: 120,
  healthInsuranceOverride: 380,
}

// ─────────────────────────────────────────────────────
// serialise
// ─────────────────────────────────────────────────────

describe('serialise', () => {
  it('produces human-readable district param', () => {
    const params = serialise(fullInputs)
    expect(params.get('district')).toBe('hackney')
  })

  it('produces human-readable type param', () => {
    const params = serialise(fullInputs)
    expect(params.get('type')).toBe('1bed')
  })

  it('serialises occupant count as people', () => {
    const params = serialise(fullInputs)
    expect(params.get('people')).toBe('2')
  })

  it('serialises all lifestyle cost fields', () => {
    const params = serialise(fullInputs)
    expect(params.get('phone')).toBe('30')
    expect(params.get('gym')).toBe('40')
    expect(params.get('streaming')).toBe('15')
    expect(params.get('other')).toBe('50')
  })

  it('serialises transport override when present', () => {
    const params = serialise(fullInputs)
    expect(params.get('transport')).toBe('120')
  })

  it('omits transport param when no override', () => {
    const noOverride: CalculatorInputs = { ...fullInputs, transportOverride: undefined }
    const params = serialise(noOverride)
    expect(params.get('transport')).toBeNull()
  })

  it('serialises health insurance override when present', () => {
    const params = serialise(fullInputs)
    expect(params.get('health')).toBe('380')
  })

  it('omits health param when no override', () => {
    const noOverride: CalculatorInputs = { ...fullInputs, healthInsuranceOverride: undefined }
    const params = serialise(noOverride)
    expect(params.get('health')).toBeNull()
  })
})

// ─────────────────────────────────────────────────────
// deserialise
// ─────────────────────────────────────────────────────

describe('deserialise', () => {
  it('restores districtId from district param', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1')
    const result = deserialise(params, config)
    expect(result.districtId).toBe('hackney')
  })

  it('restores propertyType from type param', () => {
    const params = new URLSearchParams('district=hackney&type=2bed&people=1')
    const result = deserialise(params, config)
    expect(result.propertyType).toBe('2bed')
  })

  it('restores occupants from people param', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=2')
    const result = deserialise(params, config)
    expect(result.occupants).toBe(2)
  })

  it('restores all lifestyle costs', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1&phone=30&gym=40&streaming=15&other=50')
    const result = deserialise(params, config)
    expect(result.lifestyle).toEqual({ phone: 30, gym: 40, streaming: 15, other: 50 })
  })

  it('restores transportOverride from transport param', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1&transport=99')
    const result = deserialise(params, config)
    expect(result.transportOverride).toBe(99)
  })

  it('restores healthInsuranceOverride from health param', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1&health=380')
    const result = deserialise(params, config)
    expect(result.healthInsuranceOverride).toBe(380)
  })
})

// ─────────────────────────────────────────────────────
// round-trip
// ─────────────────────────────────────────────────────

describe('round-trip', () => {
  it('serialise then deserialise produces identical CalculatorInputs', () => {
    const params = serialise(fullInputs)
    const restored = deserialise(params, config)
    expect(restored).toEqual(fullInputs)
  })

  it('round-trips inputs without optional overrides', () => {
    const minimal: CalculatorInputs = {
      districtId: 'southwark',
      propertyType: '1bed',
      occupants: 1,
      lifestyle: { phone: 25, gym: 0, streaming: 10, other: 30 },
    }
    const restored = deserialise(serialise(minimal), config)
    expect(restored).toEqual(minimal)
  })
})

// ─────────────────────────────────────────────────────
// fallbacks for missing / invalid params
// ─────────────────────────────────────────────────────

describe('deserialise fallbacks', () => {
  it('falls back to first district when district param is missing', () => {
    const params = new URLSearchParams('type=1bed&people=1')
    const result = deserialise(params, config)
    expect(result.districtId).toBe(config.districts[0].id)
  })

  it('falls back to first district when district param is unknown', () => {
    const params = new URLSearchParams('district=nowhere&type=1bed&people=1')
    const result = deserialise(params, config)
    expect(result.districtId).toBe(config.districts[0].id)
  })

  it('falls back to 1bed when type param is missing', () => {
    const params = new URLSearchParams('district=hackney&people=1')
    const result = deserialise(params, config)
    expect(result.propertyType).toBe('1bed')
  })

  it('falls back to 1bed when type param is invalid', () => {
    const params = new URLSearchParams('district=hackney&type=penthouse&people=1')
    const result = deserialise(params, config)
    expect(result.propertyType).toBe('1bed')
  })

  it('falls back to 1 occupant when people param is missing', () => {
    const params = new URLSearchParams('district=hackney&type=1bed')
    const result = deserialise(params, config)
    expect(result.occupants).toBe(1)
  })

  it('falls back to 1 occupant when people param is out-of-range', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=5')
    const result = deserialise(params, config)
    expect(result.occupants).toBe(1)
  })

  it('falls back lifestyle costs to 0 when params are missing', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1')
    const result = deserialise(params, config)
    expect(result.lifestyle).toEqual({ phone: 0, gym: 0, streaming: 0, other: 0 })
  })

  it('falls back lifestyle cost to 0 when param is non-numeric', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1&gym=lots')
    const result = deserialise(params, config)
    expect(result.lifestyle.gym).toBe(0)
  })

  it('omits transportOverride when transport param is missing', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1')
    const result = deserialise(params, config)
    expect(result.transportOverride).toBeUndefined()
  })

  it('omits transportOverride when transport param is non-numeric', () => {
    const params = new URLSearchParams('district=hackney&type=1bed&people=1&transport=fast')
    const result = deserialise(params, config)
    expect(result.transportOverride).toBeUndefined()
  })
})
