import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getApiServer, ServerListen } from './command'
import { RdpProvider } from './rdp'
import { Routes } from './routes'

export const getApiListen = async (): Promise<ServerListen> => {
  try {
    const serverInfo = await getApiServer()
    console.log('Get server info: ', serverInfo)
    return serverInfo
  } catch (e) {
    console.log("Failed to get tauri version")
    return { addr: window.location.host, access_token: '' }
  }
}

export const App = () => {
  const [rdpProvider, setRdpProvider] = useState<ServerListen | undefined>(undefined)
  // TODO: display error
  const [error, setError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    getApiListen().then(setRdpProvider).catch(setError)
  }, [])
  return <>
    <BrowserRouter>
      <RdpProvider serverListen={rdpProvider}>
        {!rdpProvider ? (error ? <>Error: {String(error)}</> : <>Loading...</>) : <Routes />}
      </RdpProvider>
    </BrowserRouter>
  </>
}
