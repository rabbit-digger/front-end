import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import useSWR, { SWRConfig, mutate } from 'swr'
import { ServerListen } from '../command'
import { RabbitDiggerConfig, RabbitDiggerProConfig } from './types'

type Conn = {
  addr: string
  accessToken: string
}
const ConnectionContext = React.createContext<Conn | null>(null)

export class FetchError extends Error {
  constructor(public res: Response) {
    super("Response error")
  }
}

const getFetcher = (conn: Conn | null) => {
  const fetcher = <T extends unknown>(
    input: string,
    init?: RequestInit
  ) => fetch((conn ? `http://${conn.addr}` : '') + input, {
    ...(init ?? {}),
    headers: {
      ...(init?.headers ?? {}),
      authorization: conn?.accessToken ?? '',
    }
  }).then(res => {
    if (res.status !== 200) {
      throw new FetchError(res)
    }
    if (res.headers.get('content-type') === 'application/json') {
      return res.json() as T
    } else {
      return res.body as T
    }
  })
  return fetcher
}

export const useConfig = () => {
  return useSWR<RabbitDiggerConfig>('/api/config')
}

export const useRdpState = () => {
  return useSWR<'Idle' | 'Running'>('/api/state', { refreshInterval: 500 })
}

export const usePost = () => {
  const conn = useContext(ConnectionContext)
  return useCallback(async <R, B = unknown>(url: string, body: B): Promise<R> => {
    const fetch = getFetcher(conn)
    return await fetch<R>(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    })
  }, [conn])
}

export const usePostConfig = () => {
  const post = usePost()
  return useCallback(async (config: RabbitDiggerProConfig) => {
    const r = await mutate('/api/config', post<RabbitDiggerProConfig>('/api/config', config))
    await mutate('/api/state')
    return r as RabbitDiggerConfig
  }, [post])
}

export const useFetchUserdata = () => {
  const conn = useContext(ConnectionContext)
  return useCallback(async (path: string) => {
    const fetch = getFetcher(conn)
    return (await fetch<{ content: string }>('/api/userdata/' + path)).content
  }, [conn])
}

export const useUserdata = (path: string) => {
  return useSWR<{ content: string }>('/api/userdata/' + path)
}

export const usePutUserdata = () => {
  const conn = useContext(ConnectionContext)
  return useCallback(async (name: string, data: string) => {
    const fetch = getFetcher(conn)
    await fetch(`/api/userdata/${name}`, {
      method: 'PUT',
      body: data
    })
  }, [conn])
}

export const useDeleteUserdata = () => {
  const conn = useContext(ConnectionContext)
  return useCallback(async (name: string) => {
    const fetch = getFetcher(conn)
    await fetch(`/api/userdata/${name}`, {
      method: 'DELETE',
    })
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
  const conn = useMemo(() => serverListen ? {
    addr: serverListen.addr,
    accessToken: serverListen.access_token
  } : null, [serverListen])

  return <SWRConfig value={{
    fetcher: getFetcher(conn)
  }}>
    <ConnectionContext.Provider value={conn}>
      {children}
    </ConnectionContext.Provider>
  </SWRConfig >
}
