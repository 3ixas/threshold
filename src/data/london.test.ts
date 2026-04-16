import { describe, it, expect } from 'vitest'
import london from './london'
import londonBoroughs from './london-boroughs'

describe('London CityConfig', () => {
  it('has exactly 33 districts', () => {
    expect(london.districts).toHaveLength(33)
  })

  it('every district has a unique id', () => {
    const ids = london.districts.map(d => d.id)
    expect(new Set(ids).size).toBe(33)
  })

  it('every district has councilTaxBandD', () => {
    const missing = london.districts.filter(d => d.councilTaxBandD === undefined)
    expect(missing.map(d => d.name)).toEqual([])
  })

  it('every district has a tflZone between 1 and 6', () => {
    const invalid = london.districts.filter(
      d => d.tflZone === undefined || d.tflZone < 1 || d.tflZone > 6
    )
    expect(invalid.map(d => d.name)).toEqual([])
  })

  it('tflAnnualCosts covers every zone used by a district', () => {
    const usedZones = new Set(london.districts.map(d => d.tflZone!))
    for (const zone of usedZones) {
      expect(london.tflAnnualCosts?.[zone], `Missing tflAnnualCosts[${zone}]`).toBeDefined()
    }
  })

  it('every district has rent data for at least the 1bed property type', () => {
    const missing = london.districts.filter(d => d.rent['1bed'] === undefined)
    expect(missing.map(d => d.name)).toEqual([])
  })

  it('satisfies CityConfig interface — depositRule is five_weeks', () => {
    expect(london.depositRule).toBe('five_weeks')
  })

  it('has a lastUpdated date string', () => {
    expect(london.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('TV licence is £15/month (£180/year from April 2026)', () => {
    expect(london.defaults.tvLicence).toBe(15)
  })
})

describe('London borough GeoJSON', () => {
  it('is a valid FeatureCollection', () => {
    expect(londonBoroughs.type).toBe('FeatureCollection')
  })

  it('has exactly 33 features', () => {
    expect(londonBoroughs.features).toHaveLength(33)
  })

  it('every feature has a code and name property', () => {
    const invalid = londonBoroughs.features.filter(
      f => !f.properties?.code || !f.properties?.name
    )
    expect(invalid).toHaveLength(0)
  })

  it('all feature codes are London borough ONS codes (E09*)', () => {
    const nonLondon = londonBoroughs.features.filter(
      f => !f.properties?.code.startsWith('E09')
    )
    expect(nonLondon).toHaveLength(0)
  })

  it('all features have polygon geometry', () => {
    const invalid = londonBoroughs.features.filter(
      f => f.geometry?.type !== 'Polygon' && f.geometry?.type !== 'MultiPolygon'
    )
    expect(invalid).toHaveLength(0)
  })
})
