import { useCallback, useEffect, useRef } from 'react'
import Map, { Source, Layer, type MapRef, type MapLayerMouseEvent } from 'react-map-gl/maplibre'
import { getBoroughBounds, type DistrictGeoJSON } from '../lib/districts'

interface ViewState {
  longitude: number
  latitude: number
  zoom: number
}

interface Props {
  geojson: DistrictGeoJSON
  selectedCode: string | null
  onSelect: (code: string) => void
  initialViewState?: ViewState
}

const FILL_LAYER = 'district-fill'
const LINE_LAYER = 'district-line'
const SOURCE = 'districts'

const LONDON_VIEW: ViewState = { longitude: -0.12, latitude: 51.50, zoom: 9.5 }

export default function DistrictMap({ geojson, selectedCode, onSelect, initialViewState = LONDON_VIEW }: Props) {
  const mapRef = useRef<MapRef>(null)
  const hoveredId = useRef<string | null>(null)

  const fitToSelected = useCallback((animated: boolean) => {
    const map = mapRef.current?.getMap()
    if (!map || !selectedCode) return
    const bounds = getBoroughBounds(geojson, selectedCode)
    if (!bounds) return
    map.fitBounds(bounds, { padding: 40, duration: animated ? 400 : 0 })
    map.setFeatureState({ source: SOURCE, id: selectedCode }, { selected: true })
  }, [geojson, selectedCode])

  // On map load: immediately fit to the initially selected district (no animation)
  const onLoad = useCallback(() => fitToSelected(false), [fitToSelected])

  // On selectedCode change after load: animated fit
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || !map.loaded()) return
    fitToSelected(true)
  }, [fitToSelected])

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
      initialViewState={initialViewState}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://tiles.openfreemap.org/styles/positron"
      interactiveLayerIds={[FILL_LAYER]}
      onLoad={onLoad}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      cursor="pointer"
    >
      <Source
        id={SOURCE}
        type="geojson"
        data={geojson}
        // Use the district code as the feature ID so setFeatureState can target it
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
            'fill-color-transition': { duration: 150, delay: 0 },
            'fill-opacity-transition': { duration: 150, delay: 0 },
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
