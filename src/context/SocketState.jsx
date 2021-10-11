import { createContext } from 'react'
import useSocket from '../hooks/useSocket'

export const SocketContext = createContext()

const API = {
  DEV: 'http://localhost:8080',
  // Offline for maintenance
  PROD: 'https://bandname-server.herokuapp.com/'
}

const SocketState = ({ children }) => {
  const { online, socket } = useSocket(API.DEV)

  return (
    <SocketContext.Provider value={{ online, socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketState
