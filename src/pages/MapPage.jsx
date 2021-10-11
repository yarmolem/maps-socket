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
  const { socket } = useContext(SocketContext)

  const map = useMapbox({
    initialCoords,
    onCreateMarker: (m) => socket.emit(ADD_MARKER, { marker: m }),
    onMoveMarker: (m) => socket.emit(UPDATE_MARKER, { marker: m })
  })

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
