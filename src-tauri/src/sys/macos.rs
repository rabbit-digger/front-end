pub mod proxy {
    use std::{ffi::OsStr, process::Stdio};

    use crate::command::{Error, Result};
    use crate::sys::SystemProxy;
    use anyhow::anyhow;
    use tokio::process::Command;

    async fn run<I, S>(args: I) -> Result<String>
    where
        I: IntoIterator<Item = S>,
        S: AsRef<OsStr>,
    {
        let output = Command::new("networksetup")
            .args(args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .kill_on_drop(true)
            .spawn()?
            .wait_with_output()
            .await?;
        if !output.status.success() {
            return Err(Error(anyhow!("Run command error: networksetup")));
        }

        Ok(String::from_utf8(output.stdout)?)
    }

    async fn list_interface() -> Result<Vec<String>> {
        let output = run(&["-listallnetworkservices"]).await?;
        Ok(output
            .split("\n")
            .skip(1)
            .map(|l| l.trim())
            .filter(|l| l.len() > 0)
            .map(|l| l.to_string())
            .collect())
    }

    pub async fn get() -> Result<SystemProxy> {
        for i in list_interface().await? {}
        todo!()
    }
    pub async fn set(proxy: &SystemProxy) -> Result<()> {
        Ok(())
    }
}
