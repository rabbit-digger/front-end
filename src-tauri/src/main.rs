#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod command;
mod sys;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            command::get_proxy,
            command::set_proxy,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
