import { useCallback, useEffect, useRef } from 'react'
import Map, { Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson'
import { getBoroughBounds } from '../lib/districts'

type BoroughGeoJSON = FeatureCollection<Polygon | MultiPolygon, { code: string; name: string }>

interface Props {
  geojson: BoroughGeoJSON
  /** ONS code of the selected borough (E09xxxxxx) */
  selectedCode: string | null
  onSelect: (onsCode: string) => void
}

const FILL_LAYER = 'borough-fill'
const LINE_LAYER = 'borough-line'
const SOURCE = 'boroughs'

export default function DistrictMap({ geojson, selectedCode, onSelect }: Props) {
  const mapRef = useRef<MapRef>(null)
  const hoveredId = useRef<string | null>(null)

  // Fly to selected borough whenever selectedCode changes externally (e.g. dropdown)
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || !selectedCode) return

    const bounds = getBoroughBounds(geojson, selectedCode)
    if (!bounds) return
    map.fitBounds(bounds, { padding: 40, duration: 600 })

    map.setFeatureState({ source: SOURCE, id: selectedCode }, { selected: true })
  }, [selectedCode, geojson])

  const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap()
    if (!map) return

    if (hoveredId.current) {
      map.setFeatureState({ source: SOURCE, id: hoveredId.current }, { hover: false })
    }
    const feature = e.features?.[0]
    if (feature?.id) {
      const id = String(feature.id)
      map.setFeatureState({ source: SOURCE, id }, { hover: true })
      hoveredId.current = id
    } else {
      hoveredId.current = null
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map || !hoveredId.current) return
    map.setFeatureState({ source: SOURCE, id: hoveredId.current }, { hover: false })
    hoveredId.current = null
  }, [])

  const onClick = useCallback((e: MapLayerMouseEvent) => {
    const feature = e.features?.[0]
    if (!feature?.id) return
    const id = String(feature.id)

    // Clear previous selected state
    const map = mapRef.current?.getMap()
    if (map && selectedCode && selectedCode !== id) {
      map.setFeatureState({ source: SOURCE, id: selectedCode }, { selected: false })
    }
    if (map) {
      map.setFeatureState({ source: SOURCE, id }, { selected: true })
    }
    onSelect(id)
  }, [selectedCode, onSelect])

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: -0.12, latitude: 51.50, zoom: 9.5 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      interactiveLayerIds={[FILL_LAYER]}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      cursor="pointer"
    >
      <Source
        id={SOURCE}
        type="geojson"
        data={geojson}
        // Use the ONS code as the feature ID so setFeatureState can target it
        promoteId="code"
      >
        <Layer
          id={FILL_LAYER}
          type="fill"
          paint={{
            'fill-color': [
              'case',
              ['boolean', ['feature-state', 'selected'], false], '#625d5b',
              ['boolean', ['feature-state', 'hover'], false], '#c8c4c2',
              '#e2e3db',
            ],
            'fill-opacity': 0.75,
          }}
        />
        <Layer
          id={LINE_LAYER}
          type="line"
          paint={{
            'line-color': '#ffffff',
            'line-width': 1,
          }}
        />
      </Source>
    </Map>
  )
}
