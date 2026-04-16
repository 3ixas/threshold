import { describe, it, expect } from 'vitest'
import { getDistrictById, getZoneForDistrict, getBoroughBounds } from './districts'
import london from '../data/london'
import londonBoroughs from '../data/london-boroughs'

describe('getDistrictById', () => {
  it('returns the correct district for a known id', () => {
    const d = getDistrictById(london, 'hackney')
    expect(d?.name).toBe('Hackney')
  })

  it('returns undefined for an unknown id', () => {
    expect(getDistrictById(london, 'nowhere')).toBeUndefined()
  })
})

describe('getZoneForDistrict', () => {
  it('returns the TfL zone for a known district', () => {
    expect(getZoneForDistrict(london, 'hackney')).toBe(2)
    expect(getZoneForDistrict(london, 'westminster')).toBe(1)
    expect(getZoneForDistrict(london, 'havering')).toBe(6)
  })

  it('returns undefined for an unknown district', () => {
    expect(getZoneForDistrict(london, 'atlantis')).toBeUndefined()
  })
})

describe('getBoroughBounds', () => {
  it('returns [minLng, minLat, maxLng, maxLat] for a known borough ONS code', () => {
    // Hackney ONS code = E09000012
    const bounds = getBoroughBounds(londonBoroughs, 'E09000012')
    expect(bounds).toHaveLength(4)
    const [minLng, minLat, maxLng, maxLat] = bounds!
    // Hackney is roughly -0.11 to 0.02 lng, 51.52 to 51.59 lat
    expect(minLng).toBeLessThan(maxLng)
    expect(minLat).toBeLessThan(maxLat)
    expect(minLat).toBeGreaterThan(51)
    expect(maxLat).toBeLessThan(52)
  })

  it('returns undefined for an unknown borough code', () => {
    expect(getBoroughBounds(londonBoroughs, 'E99999999')).toBeUndefined()
  })
})
