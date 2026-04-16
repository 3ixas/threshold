import { describe, it, expect } from 'vitest'
import zurich from './zurich'
import zurichKreise from './zurich-kreise'

describe('Zurich CityConfig', () => {
  it('has exactly 12 districts', () => {
    expect(zurich.districts).toHaveLength(12)
  })

  it('has unique district ids', () => {
    const ids = zurich.districts.map(d => d.id)
    expect(new Set(ids).size).toBe(12)
  })

  it('every district has rent for all 5 property types', () => {
    for (const d of zurich.districts) {
      expect(d.rent.room, `${d.name} room`).toBeDefined()
      expect(d.rent.studio, `${d.name} studio`).toBeDefined()
      expect(d.rent['1bed'], `${d.name} 1bed`).toBeDefined()
      expect(d.rent['2bed'], `${d.name} 2bed`).toBeDefined()
      expect(d.rent['3bed'], `${d.name} 3bed`).toBeDefined()
    }
  })

  it('depositRule is three_months', () => {
    expect(zurich.depositRule).toBe('three_months')
  })

  it('currency is CHF', () => {
    expect(zurich.currency).toBe('CHF')
  })

  it('has health insurance default', () => {
    expect(zurich.defaults.healthInsurance).toBeGreaterThan(0)
  })

  it('has Serafe media fee', () => {
    expect(zurich.defaults.mediaFee).toBeCloseTo(27.92, 1)
  })

  it('ZVV transport default is CHF 88/month', () => {
    expect(zurich.defaults.transport).toBe(88)
  })

  it('has lastUpdated date string', () => {
    expect(zurich.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('Zurich Kreise GeoJSON', () => {
  it('is a valid FeatureCollection', () => {
    expect(zurichKreise.type).toBe('FeatureCollection')
  })

  it('has exactly 12 features', () => {
    expect(zurichKreise.features).toHaveLength(12)
  })

  it('every feature code matches a district id', () => {
    const districtIds = new Set(zurich.districts.map(d => d.id))
    for (const f of zurichKreise.features) {
      expect(districtIds.has(f.properties.code), `Unknown code: ${f.properties.code}`).toBe(true)
    }
  })

  it('every feature has polygon geometry', () => {
    const invalid = zurichKreise.features.filter(f => f.geometry?.type !== 'Polygon')
    expect(invalid).toHaveLength(0)
  })

  it('features are within Zurich bounds (lng 8.45–8.62, lat 47.32–47.44)', () => {
    for (const f of zurichKreise.features) {
      const coords = (f.geometry as { coordinates: number[][][] }).coordinates[0]
      for (const [lng, lat] of coords) {
        expect(lng).toBeGreaterThan(8.45)
        expect(lng).toBeLessThan(8.62)
        expect(lat).toBeGreaterThan(47.32)
        expect(lat).toBeLessThan(47.44)
      }
    }
  })
})
