import type { CityConfig, District } from './types'
import type { FeatureCollection, Polygon, MultiPolygon, Position } from 'geojson'

export function getDistrictById(config: CityConfig, districtId: string): District | undefined {
  return config.districts.find(d => d.id === districtId)
}

export function getZoneForDistrict(config: CityConfig, districtId: string): number | undefined {
  return getDistrictById(config, districtId)?.tflZone
}

type BoroughGeoJSON = FeatureCollection<Polygon | MultiPolygon, { code: string; name: string }>

/** Returns [minLng, minLat, maxLng, maxLat] for the borough with the given ONS code. */
export function getBoroughBounds(
  geojson: BoroughGeoJSON,
  onsCode: string,
): [number, number, number, number] | undefined {
  const feature = geojson.features.find(f => f.properties.code === onsCode)
  if (!feature) return undefined

  const coords: Position[] =
    feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates.flat()
      : feature.geometry.coordinates.flat(2)

  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }
  return [minLng, minLat, maxLng, maxLat]
}
