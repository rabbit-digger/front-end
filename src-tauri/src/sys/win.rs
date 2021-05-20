pub mod proxy {
    use crate::command::Result;
    use serde::{Deserialize, Serialize};
    use winreg::enums::*;
    use winreg::RegKey;

    #[derive(Debug, Serialize, Deserialize)]
    pub enum SystemProxy {
        Disabled,
        Enabled { address: String },
    }

    pub fn get() -> Result<SystemProxy> {
        let inet_settings = RegKey::predef(HKEY_CURRENT_USER).open_subkey_with_flags(
            "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
            KEY_READ,
        )?;
        let proxy_enabled = inet_settings.get_value::<u32, _>("ProxyEnable")? != 0;
        Ok(if proxy_enabled {
            let address = inet_settings.get_value("ProxyServer")?;
            SystemProxy::Enabled { address }
        } else {
            SystemProxy::Disabled
        })
    }
    pub fn set(proxy: &SystemProxy) -> Result<()> {
        let inet_settings = RegKey::predef(HKEY_CURRENT_USER).open_subkey_with_flags(
            "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
            KEY_WRITE,
        )?;
        match proxy {
            SystemProxy::Disabled => {
                inet_settings.set_value("ProxyEnable", &0u32)?;
            }
            SystemProxy::Enabled { address } => {
                inet_settings.set_value("ProxyEnable", &1u32)?;
                inet_settings.set_value("ProxyServer", address)?;
            }
        };
        Ok(())
    }
}
