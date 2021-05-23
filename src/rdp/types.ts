import { Config as RabbitDiggerConfig } from './generated'
export type { Config as RabbitDiggerConfig } from './generated'

export type RabbitDiggerProConfig = RabbitDiggerConfig & {
  id: string
}
export interface RabbitDiggerPro {
  pushConfig: (config: RabbitDiggerProConfig) => Promise<void>
  getConfig: () => Promise<RabbitDiggerProConfig>
}
