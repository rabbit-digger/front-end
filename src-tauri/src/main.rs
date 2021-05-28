#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::net::SocketAddr;

use anyhow::{Context, Result};
use rabbit_digger::controller::Controller;
use rabbit_digger_pro::{api_server, plugin_loader, rabbit_digger};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

mod command;
mod sys;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ServerListen {
    pub access_token: String,
    pub addr: SocketAddr,
}

async fn run_server(controller: &Controller) -> Result<ServerListen> {
    let access_token = Uuid::new_v4().to_string();
    let addr = api_server::Server {
        controller: controller.clone(),
        access_token: Some(access_token.clone()),
        web_ui: None,
        userdata: None,
    }
    .run("127.0.0.1:0")
    .await
    .context("Failed to run api server.")?;
    Ok(ServerListen { access_token, addr })
}

#[tokio::main]
async fn main() -> Result<()> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "rabbit_ui=trace,rabbit_digger_pro=trace")
    }
    tracing_subscriber::fmt::init();

    let controller = Controller::new();
    controller.set_plugin_loader(plugin_loader).await;
    let server = run_server(&controller).await?;

    tracing::debug!("server: {:?}", server);

    tauri::Builder::default()
        .manage(controller)
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
