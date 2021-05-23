import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { RdpProvider } from './rdp'
import { getProvider } from './rdp/provider'
import { RabbitDiggerPro } from './rdp/types'
import { Routes } from './routes'

export const App = () => {
  const [rdpProvider, setRdpProvider] = useState<RabbitDiggerPro | undefined>(undefined)
  // TODO: display error
  const [, setError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    getProvider().then(setRdpProvider).catch(setError)
  }, [])
  return <>
    <BrowserRouter>
      <RdpProvider value={rdpProvider}>
        {!rdpProvider ? <>Can't connect to rabbit-digger</> : <Routes />}
      </RdpProvider>
    </BrowserRouter>
  </>
}
