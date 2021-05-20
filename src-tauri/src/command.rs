use std::error::Error as StdError;

use crate::sys::proxy;
use serde::Serialize;
use tauri::command;

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
pub async fn get_proxy() -> Result<proxy::SystemProxy> {
    proxy::get()
}

#[command]
pub async fn set_proxy(proxy: proxy::SystemProxy) -> Result<()> {
    proxy::set(&proxy)
}
