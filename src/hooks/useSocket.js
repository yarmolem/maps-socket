import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

const connectSocketServer = (serverPath) => {
  return io(serverPath, { transports: ['websocket'] })
}

const useSocket = (serverPath) => {
  const [online, setOnline] = useState(false)
  const socket = useMemo(() => connectSocketServer(serverPath), [serverPath])

  useEffect(() => {
    socket.on('connect', () => {
      setOnline(true)
    })
  }, [socket])

  useEffect(() => {
    socket.on('disconnect', () => {
      setOnline(false)
    })
  }, [socket])

  return { online, socket }
}

export default useSocket
