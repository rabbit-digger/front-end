use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum SystemProxy {
    Disabled,
    Enabled { address: String },
}
