import { Config as RabbitDiggerConfig } from './generated'
export type { Config as RabbitDiggerConfig } from './generated'

export type RabbitDiggerProConfig = RabbitDiggerConfig & {
  id: string
}
