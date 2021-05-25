import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import useSWR, { SWRConfig } from 'swr'
import { ServerListen } from '../command'
import { RabbitDiggerConfig } from './types'

type Conn = {
  addr: string
  accessToken: string
}
const ConnectionContext = React.createContext<Conn | null>(null)

export const useConfig = () => {
  return useSWR<RabbitDiggerConfig>('/api/config')
}

export const useRdpState = () => {
  return useSWR<'idle' | 'running'>('/api/state')
}

export const usePost = () => {
  const conn = useContext(ConnectionContext)
  return useCallback(async (url: string, body: any) => {
    return (await fetch((conn ? `http://${conn.addr}` : '') + url, {
      method: 'POST',
      headers: {
        authorization: conn?.accessToken ?? '',
        'content-type': 'application/json',
      }, body: JSON.stringify(body)
    })).json()
  }, [conn])
}

export const useEvent = (onEvent: (e: string) => void) => {
  const conn = useContext(ConnectionContext)

  useEffect(() => {
    if (conn) {
      const ws = new WebSocket(`ws://${conn.addr}/api/event`)
      ws.onmessage = e => {
        onEvent(e.data)
      }
      return () => ws.close()
    }
  }, [conn, onEvent])
}

export const RdpProvider: React.FC<{ serverListen: ServerListen | undefined }> = ({ children, serverListen }) => {
  const fetcher = (input: string, init?: RequestInit | undefined) => fetch((serverListen ? `http://${serverListen.addr}` : '') + input, {
    ...(init ?? {})
    ,
    headers: {
      ...(init?.headers ?? {}),
      authorization: serverListen?.access_token ?? ''
    }
  }).then(res => res.json())
  const conn = useMemo(() => serverListen ? {
    addr: serverListen.addr,
    accessToken: serverListen.access_token
  } : null, [serverListen])
  return <SWRConfig value={{
    fetcher
  }}>
    <ConnectionContext.Provider value={conn}>
      {children}
    </ConnectionContext.Provider>
  </SWRConfig >
}
