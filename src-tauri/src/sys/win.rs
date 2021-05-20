pub mod proxy {
    use anyhow::Result;
    use winreg::enums::*;
    use winreg::RegKey;

    pub enum SystemProxy {
        Disabled,
        Enabled { address: String },
    }

    pub fn get() -> Result<bool> {
        let ie_settings = RegKey::predef(HKEY_CURRENT_USER).open_subkey_with_flags(
            "Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
            KEY_READ,
        )?;
        let proxy: u32 = ie_settings.get_value("ProxyEnable")?;
        Ok(proxy != 0)
    }
}
