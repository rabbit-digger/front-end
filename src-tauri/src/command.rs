use tauri::{command, Params, State, Window};

#[command]
pub async fn get_proxy() -> String {
    println!("call hello world");
    "hi".to_string()
}
