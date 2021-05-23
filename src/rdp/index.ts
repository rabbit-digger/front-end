import React, { useContext } from 'react'
import './provider'
import { RabbitDiggerPro } from './types'

const RdpContext = React.createContext<RabbitDiggerPro | undefined>(undefined)
export const RdpProvider = RdpContext.Provider

export const useRdp = () => {
  return useContext(RdpContext)!
}
