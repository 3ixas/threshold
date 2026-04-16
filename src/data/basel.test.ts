import { describe, it, expect } from 'vitest'
import basel from './basel'
import baselWohnviertel from './basel-wohnviertel'

describe('Basel CityConfig', () => {
  it('has exactly 7 districts', () => {
    expect(basel.districts).toHaveLength(7)
  })

  it('has unique district ids', () => {
    const ids = basel.districts.map(d => d.id)
    expect(new Set(ids).size).toBe(7)
  })

  it('every district has rent for all 5 property types', () => {
    for (const d of basel.districts) {
      expect(d.rent.room, `${d.name} room`).toBeDefined()
      expect(d.rent.studio, `${d.name} studio`).toBeDefined()
      expect(d.rent['1bed'], `${d.name} 1bed`).toBeDefined()
      expect(d.rent['2bed'], `${d.name} 2bed`).toBeDefined()
      expect(d.rent['3bed'], `${d.name} 3bed`).toBeDefined()
    }
  })

  it('depositRule is three_months', () => {
    expect(basel.depositRule).toBe('three_months')
  })

  it('currency is CHF', () => {
    expect(basel.currency).toBe('CHF')
  })

  it('has health insurance default', () => {
    expect(basel.defaults.healthInsurance).toBeGreaterThan(0)
  })

  it('has Serafe media fee', () => {
    expect(basel.defaults.mediaFee).toBeCloseTo(27.92, 1)
  })

  it('has lastUpdated date string', () => {
    expect(basel.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('Basel Wohnviertel GeoJSON', () => {
  it('is a valid FeatureCollection', () => {
    expect(baselWohnviertel.type).toBe('FeatureCollection')
  })

  it('has 19 features (all Basel city Wohnviertel)', () => {
    expect(baselWohnviertel.features).toHaveLength(19)
  })

  it('every feature has a code property matching a district id', () => {
    const districtIds = new Set(basel.districts.map(d => d.id))
    for (const f of baselWohnviertel.features) {
      expect(districtIds.has(f.properties.code), `Unknown code: ${f.properties.code}`).toBe(true)
    }
  })

  it('every feature has polygon geometry', () => {
    const invalid = baselWohnviertel.features.filter(
      f => f.geometry?.type !== 'Polygon' && f.geometry?.type !== 'MultiPolygon'
    )
    expect(invalid).toHaveLength(0)
  })

  it('all 7 district groups are represented in GeoJSON', () => {
    const codes = new Set(baselWohnviertel.features.map(f => f.properties.code))
    expect(codes.size).toBe(7)
  })
})
