#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::net::SocketAddr;

use anyhow::{Context, Result};
use rabbit_digger_pro::{
    api_server, config::ConfigManager, get_registry, rabbit_digger::RabbitDigger,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

mod command;
mod sys;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ServerListen {
    pub access_token: String,
    pub addr: SocketAddr,
}

async fn run_server(rd: RabbitDigger, cfg_mgr: ConfigManager) -> Result<ServerListen> {
    let access_token = Uuid::new_v4().to_string();
    let addr = api_server::Server {
        rabbit_digger: rd,
        config_manager: cfg_mgr,
        access_token: Some(access_token.to_string()),
        web_ui: None,
    }
    .run("127.0.0.1:0")
    .await
    .context("Failed to run api server.")?;
    Ok(ServerListen { access_token, addr })
}

#[tokio::main]
async fn main() -> Result<()> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var(
            "RUST_LOG",
            "rabbit_ui=trace,rabbit_digger=trace,rabbit_digger_pro=trace,rd_std=trace,raw=trace",
        )
    }
    tracing_subscriber::fmt::init();

    let rd = RabbitDigger::new(get_registry()?).await?;
    let cfg_mgr = ConfigManager::new(get_registry()?).await?;
    let server = run_server(rd.clone(), cfg_mgr.clone()).await?;

    tracing::debug!("server: {:?}", server);

    tauri::Builder::default()
        .manage(rd)
        .manage(server)
        .invoke_handler(tauri::generate_handler![
            command::get_proxy,
            command::set_proxy,
            command::get_api_server,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
