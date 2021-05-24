use std::error::Error as StdError;

use crate::{
    sys::{self, proxy},
    ServerListen,
};
use serde::Serialize;
use tauri::{command, State};

#[derive(Debug)]
pub struct Error(pub anyhow::Error);

impl<E> From<E> for Error
where
    E: StdError + Send + Sync + 'static,
{
    fn from(e: E) -> Self {
        Error(e.into())
    }
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.0.to_string())
    }
}

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[command]
pub async fn get_proxy() -> Result<sys::SystemProxy> {
    proxy::get().await
}

#[command]
pub async fn set_proxy(proxy: sys::SystemProxy) -> Result<()> {
    proxy::set(&proxy).await
}

/// Get the infomation of api_server
#[command]
pub async fn get_api_server(server_listen: State<'_, ServerListen>) -> Result<ServerListen> {
    Ok(server_listen.inner().clone())
}
