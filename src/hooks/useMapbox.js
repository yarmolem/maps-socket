import { useCallback, useEffect, useRef, useState } from 'react'

import mapboxgl from 'mapbox-gl'
import { v4 as uuidv4 } from 'uuid'

const MAP_KEY = import.meta.env.VITE_MAP_KEY
mapboxgl.accessToken = MAP_KEY

const useMapbox = ({
  initialCoords,
  onMoveMarker = () => {},
  onCreateMarker = () => {}
}) => {
  const mapRef = useRef()
  const markers = useRef({})
  const mapContainerRef = useRef()

  const [coords, setCoords] = useState(initialCoords)

  // Funcion para agregar marcadores
  const addMarker = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev

    const marker = new mapboxgl.Marker({
      draggable: true
    })

    marker.id = id ?? uuidv4()
    marker.setLngLat([lng, lat]).addTo(mapRef.current)
    markers.current[marker.id] = marker

    if (!id) onCreateMarker({ id: marker.id, lat, lng })

    /**
     * Marker events
     * https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker.event:dragend
     */
    marker.on('drag', ({ target }) => {
      const { id } = target
      const { lng, lat } = target.getLngLat()

      onMoveMarker({ id, lng, lat })
    })
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coords.lng, coords.lat],
      zoom: coords.zoom
    })

    mapRef.current = map
  }, [])

  useEffect(() => {
    mapRef.current?.on('move', () => {
      const { lat, lng } = mapRef.current.getCenter()
      setCoords({
        lat: lat.toFixed(4),
        lng: lng.toFixed(4),
        zoom: mapRef.current.getZoom().toFixed(2)
      })
    })
  }, [])

  useEffect(() => {
    mapRef.current?.on('click', addMarker)
  }, [])

  const updatePosition = useCallback(({ id, lng, lat }) => {
    const objMarker = markers.current[id]
    objMarker.setLngLat([lng, lat])
  }, [])

  const setMapContainerRef = useCallback((node) => {
    mapContainerRef.current = node
  }, [])

  return {
    coords,
    addMarker,
    updatePosition,
    setMapContainerRef
  }
}

export default useMapbox
