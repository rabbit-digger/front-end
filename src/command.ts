import { invoke } from "@tauri-apps/api/tauri"

export type SystemProxy = "Disabled" | {
  Enabled: {
    address: string
  }
}

export type ServerListen = {
  addr: string
  access_token: string
}

export const getProxy = async () => await invoke<SystemProxy>('get_proxy')
export const setProxy = async (proxy: SystemProxy) => await invoke<void>('set_proxy', { proxy })
export const getApiServer = async () => await invoke<ServerListen>('get_api_server')
