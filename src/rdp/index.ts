import React from 'react'

const RDPContext = React.createContext({})

interface RabbitDiggerProConfig {

}
export interface RabbitDiggerPro {
  start: () => Promise<void>
  stop: () => Promise<void>
  setConfig: (config: RabbitDiggerProConfig) => Promise<void>
}
