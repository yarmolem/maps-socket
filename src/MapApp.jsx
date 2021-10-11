import MapPage from './pages/MapPage'
import SocketState from './context/SocketState'

const MapApp = () => {
  return (
    <SocketState>
      <MapPage />
    </SocketState>
  )
}

export default MapApp
