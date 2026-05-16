use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Subscription {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub category: String,
    pub billing_cycle: String, // monthly, yearly, quarterly, weekly
    pub cost: f64,
    pub currency: String,
    pub start_date: String,
    pub next_billing_date: String,
    pub payment_method: Option<String>,
    pub website: Option<String>,
    pub notes: Option<String>,
    pub color: Option<String>,
    pub active: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub color: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_monthly: f64,
    pub total_yearly: f64,
    pub active_subscriptions: i32,
    pub upcoming_renewals: i32,
    pub category_breakdown: Vec<CategoryStat>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryStat {
    pub category: String,
    pub amount: f64,
    pub percentage: f64,
}

pub struct AppState {
    subscriptions: Mutex<Vec<Subscription>>,
}

#[tauri::command]
fn get_subscriptions(state: tauri::State<AppState>) -> Vec<Subscription> {
    let subs = state.subscriptions.lock().unwrap();
    subs.clone()
}

#[tauri::command]
fn add_subscription(state: tauri::State<AppState>, subscription: Subscription) -> Result<Subscription, String> {
    let mut subs = state.subscriptions.lock().unwrap();
    
    // Check for duplicate names
    if subs.iter().any(|s| s.name == subscription.name && s.active) {
        return Err("A subscription with this name already exists".to_string());
    }
    
    let new_sub = Subscription {
        id: uuid::Uuid::new_v4().to_string(),
        created_at: chrono::Local::now().to_rfc3339(),
        updated_at: chrono::Local::now().to_rfc3339(),
        ..subscription
    };
    
    subs.push(new_sub.clone());
    Ok(new_sub)
}

#[tauri::command]
fn update_subscription(state: tauri::State<AppState>, id: String, subscription: Subscription) -> Result<Subscription, String> {
    let mut subs = state.subscriptions.lock().unwrap();
    
    if let Some(index) = subs.iter().position(|s| s.id == id) {
        let updated = Subscription {
            id: id.clone(),
            updated_at: chrono::Local::now().to_rfc3339(),
            ..subscription
        };
        subs[index] = updated.clone();
        Ok(updated)
    } else {
        Err("Subscription not found".to_string())
    }
}

#[tauri::command]
fn delete_subscription(state: tauri::State<AppState>, id: String) -> Result<(), String> {
    let mut subs = state.subscriptions.lock().unwrap();
    
    if let Some(index) = subs.iter().position(|s| s.id == id) {
        subs.remove(index);
        Ok(())
    } else {
        Err("Subscription not found".to_string())
    }
}

#[tauri::command]
fn get_dashboard_stats(state: tauri::State<AppState>) -> DashboardStats {
    let subs = state.subscriptions.lock().unwrap();
    let active_subs: Vec<&Subscription> = subs.iter().filter(|s| s.active).collect();
    
    let total_monthly: f64 = active_subs.iter().map(|s| {
        match s.billing_cycle.as_str() {
            "monthly" => s.cost,
            "yearly" => s.cost / 12.0,
            "quarterly" => s.cost / 3.0,
            "weekly" => s.cost * 4.33,
            _ => s.cost,
        }
    }).sum();
    
    let total_yearly = total_monthly * 12.0;
    
    // Calculate category breakdown
    use std::collections::HashMap;
    let mut category_totals: HashMap<String, f64> = HashMap::new();
    
    for sub in &active_subs {
        let monthly_cost = match sub.billing_cycle.as_str() {
            "monthly" => sub.cost,
            "yearly" => sub.cost / 12.0,
            "quarterly" => sub.cost / 3.0,
            "weekly" => sub.cost * 4.33,
            _ => sub.cost,
        };
        *category_totals.entry(sub.category.clone()).or_insert(0.0) += monthly_cost;
    }
    
    let category_breakdown: Vec<CategoryStat> = category_totals
        .iter()
        .map(|(cat, amount)| CategoryStat {
            category: cat.clone(),
            amount: *amount,
            percentage: if total_monthly > 0.0 { (*amount / total_monthly) * 100.0 } else { 0.0 },
        })
        .collect();
    
    // Count upcoming renewals (within 7 days)
    let now = chrono::Local::now();
    let upcoming = active_subs.iter().filter(|s| {
        if let Ok(date) = chrono::DateTime::parse_from_rfc3339(&s.next_billing_date) {
            let days_until = (date.with_timezone(&chrono::Local) - now).num_days();
            days_until >= 0 && days_until <= 7
        } else {
            false
        }
    }).count() as i32;
    
    DashboardStats {
        total_monthly,
        total_yearly,
        active_subscriptions: active_subs.len() as i32,
        upcoming_renewals: upcoming,
        category_breakdown,
    }
}

#[tauri::command]
fn get_categories() -> Vec<Category> {
    vec![
        Category { id: "streaming".to_string(), name: "流媒体".to_string(), icon: "Play".to_string(), color: "#EF4444".to_string() },
        Category { id: "software".to_string(), name: "软件工具".to_string(), icon: "Code".to_string(), color: "#3B82F6".to_string() },
        Category { id: "cloud".to_string(), name: "云服务".to_string(), icon: "Cloud".to_string(), color: "#10B981".to_string() },
        Category { id: "gaming".to_string(), name: "游戏".to_string(), icon: "Gamepad2".to_string(), color: "#8B5CF6".to_string() },
        Category { id: "music".to_string(), name: "音乐".to_string(), icon: "Music".to_string(), color: "#F59E0B".to_string() },
        Category { id: "fitness".to_string(), name: "健身".to_string(), icon: "Dumbbell".to_string(), color: "#EC4899".to_string() },
        Category { id: "education".to_string(), name: "教育".to_string(), icon: "GraduationCap".to_string(), color: "#06B6D4".to_string() },
        Category { id: "news".to_string(), name: "新闻".to_string(), icon: "Newspaper".to_string(), color: "#6366F1".to_string() },
        Category { id: "other".to_string(), name: "其他".to_string(), icon: "MoreHorizontal".to_string(), color: "#6B7280".to_string() },
    ]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let initial_subscriptions: Vec<Subscription> = vec![
        Subscription {
            id: "1".to_string(),
            name: "Netflix".to_string(),
            description: Some("标准会员".to_string()),
            category: "streaming".to_string(),
            billing_cycle: "monthly".to_string(),
            cost: 45.0,
            currency: "CNY".to_string(),
            start_date: "2024-01-15T00:00:00Z".to_string(),
            next_billing_date: "2025-06-15T00:00:00Z".to_string(),
            payment_method: Some("支付宝".to_string()),
            website: Some("https://netflix.com".to_string()),
            notes: None,
            color: Some("#E50914".to_string()),
            active: true,
            created_at: "2024-01-15T00:00:00Z".to_string(),
            updated_at: "2024-01-15T00:00:00Z".to_string(),
        },
        Subscription {
            id: "2".to_string(),
            name: "Spotify".to_string(),
            description: Some("Premium会员".to_string()),
            category: "music".to_string(),
            billing_cycle: "monthly".to_string(),
            cost: 35.0,
            currency: "CNY".to_string(),
            start_date: "2024-02-01T00:00:00Z".to_string(),
            next_billing_date: "2025-06-01T00:00:00Z".to_string(),
            payment_method: Some("信用卡".to_string()),
            website: Some("https://spotify.com".to_string()),
            notes: None,
            color: Some("#1DB954".to_string()),
            active: true,
            created_at: "2024-02-01T00:00:00Z".to_string(),
            updated_at: "2024-02-01T00:00:00Z".to_string(),
        },
        Subscription {
            id: "3".to_string(),
            name: "ChatGPT Plus".to_string(),
            description: Some("AI助手订阅".to_string()),
            category: "software".to_string(),
            billing_cycle: "monthly".to_string(),
            cost: 20.0,
            currency: "USD".to_string(),
            start_date: "2024-03-10T00:00:00Z".to_string(),
            next_billing_date: "2025-06-10T00:00:00Z".to_string(),
            payment_method: Some("PayPal".to_string()),
            website: Some("https://chat.openai.com".to_string()),
            notes: None,
            color: Some("#10A37F".to_string()),
            active: true,
            created_at: "2024-03-10T00:00:00Z".to_string(),
            updated_at: "2024-03-10T00:00:00Z".to_string(),
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .manage(AppState {
            subscriptions: Mutex::new(initial_subscriptions),
        })
        .invoke_handler(tauri::generate_handler![
            get_subscriptions,
            add_subscription,
            update_subscription,
            delete_subscription,
            get_dashboard_stats,
            get_categories,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
