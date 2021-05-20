import { invoke } from "@tauri-apps/api/tauri"

export type SystemProxy = "Disabled" | {
    Enabled: {
        address: string
    }
}

export const getProxy = async () => await invoke<SystemProxy>('get_proxy')
export const setProxy = async (proxy: SystemProxy) => await invoke<void>('set_proxy', { proxy })
