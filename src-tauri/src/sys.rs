#[cfg(windows)]
pub use win::*;
#[cfg(windows)]
mod win;

#[cfg(target_os = "macos")]
pub use macos::*;
#[cfg(target_os = "macos")]
mod macos;

mod common;
pub use common::*;
