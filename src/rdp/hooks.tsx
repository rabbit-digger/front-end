import React from 'react'
import useSWR, { SWRConfig } from 'swr'
import { ServerListen } from '../command'
import { RabbitDiggerConfig } from './types'

export const useConfig = () => {
  return useSWR<RabbitDiggerConfig>('/api/config')
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
  return <SWRConfig value={{
    fetcher
  }}>
    {children}
  </SWRConfig >
}
