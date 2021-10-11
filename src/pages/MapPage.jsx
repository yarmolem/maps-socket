import { useContext, useEffect } from 'react'

import useMapbox from '../hooks/useMapbox'
import { SocketContext } from '../context/SocketState'
import { ACTIVE_MARKERS, ADD_MARKER, UPDATE_MARKER } from '../types'

const initialCoords = {
  zoom: 13.5,
  lat: 37.8072,
  lng: -122.4753
}

const MapPage = () => {
  const map = useMapbox({ initialCoords })
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    socket.on(ACTIVE_MARKERS, ({ markers }) => {
      Object.keys(markers).forEach((id) => {
        map.addMarker(markers[id], id)
      })
    })
  }, [])

  useEffect(() => {
    socket.on(ADD_MARKER, ({ marker }) => {
      map.addMarker(marker, marker.id)
    })
  }, [])

  useEffect(() => {
    socket.on(UPDATE_MARKER, ({ marker }) => {
      map.updatePosition(marker)
    })
  }, [])

  useEffect(() => {
    map.newMarker$.subscribe((marker) => {
      socket.emit(ADD_MARKER, { marker })
    })
  }, [])

  useEffect(() => {
    map.moveMarker$.subscribe((marker) => {
      socket.emit(UPDATE_MARKER, { marker })
    })
  }, [])

  return (
    <>
      <span className="mapInfo">
        lat: {map.coords.lat} | lng: {map.coords.lng} | zoom: {map.coords.zoom}
      </span>
      <div ref={map.setMapContainerRef} className="mapContainer" />
    </>
  )
}

export default MapPage
