pub mod proxy {
    use crate::command::Result;
    use crate::sys::SystemProxy;
    use winreg::enums::*;
    use winreg::RegKey;

    pub async fn get() -> Result<SystemProxy> {
        let inet_settings = RegKey::predef(HKEY_CURRENT_USER).open_subkey_with_flags(
            "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
            KEY_READ,
        )?;
        let proxy_enabled = inet_settings.get_value::<u32, _>("ProxyEnable")? != 0;
        Ok(if proxy_enabled {
            let address = inet_settings.get_value("ProxyServer")?;
            let exclude = Some(inet_settings.get_value("ProxyOverride")?);

            SystemProxy::Enabled { address, exclude }
        } else {
            SystemProxy::Disabled
        })
    }
    pub async fn set(proxy: &SystemProxy) -> Result<()> {
        let inet_settings = RegKey::predef(HKEY_CURRENT_USER).open_subkey_with_flags(
            "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
            KEY_WRITE,
        )?;
        match proxy {
            SystemProxy::Disabled => {
                inet_settings.set_value("ProxyEnable", &0u32)?;
            }
            SystemProxy::Enabled { address, exclude } => {
                inet_settings.set_value("ProxyEnable", &1u32)?;
                inet_settings.set_value("ProxyServer", address)?;
                if let Some(exclude) = exclude {
                    inet_settings.set_value("ProxyOverride", exclude)?;
                }
            }
        };
        Ok(())
    }
}
