import { RabbitDiggerPro, RabbitDiggerProConfig } from './types'
import { } from '@tauri-apps/api'
import { getVersion } from '@tauri-apps/api/app'

const noop = async (): Promise<any> => {
  throw new Error('not implemented yet')
}

export class APIProvider implements RabbitDiggerPro {
  async pushConfig(config: RabbitDiggerProConfig) { }
  async getConfig(): Promise<RabbitDiggerProConfig> {
    return await (await fetch('/api/config')).json()
  }
}

export class TauriProvider implements RabbitDiggerPro {
  pushConfig: (config: RabbitDiggerProConfig) => Promise<void> = noop
  getConfig: () => Promise<RabbitDiggerProConfig> = noop

}

export const getProvider = async (): Promise<RabbitDiggerPro> => {
  try {
    const version = await getVersion()
    console.log('Get tauri version: ', version)
    return new TauriProvider()
  } catch (e) {
    console.log("Failed to get tauri version: ", e)
    return new APIProvider()
  }
}
