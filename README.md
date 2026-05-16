<div align="center">

# 📊 SubTrack - 订阅管理助手

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/gitstq/SubTrack/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-orange.svg)]()

**智能订阅费用管理工具，帮助您追踪和管理所有订阅服务**

[简体中文](#简体中文) | [繁體中文](#繁體中文) | [English](#english)

</div>

---

## 简体中文

### 🎉 项目介绍

SubTrack 是一款**跨平台桌面应用**，专为现代数字生活设计。在这个订阅服务泛滥的时代，我们帮助您：

- 📈 **清晰掌握**每月/每年的订阅支出
- ⏰ **及时提醒**即将到期的订阅
- 📊 **智能分析**消费趋势和分类占比
- 💰 **优化预算**避免不必要的订阅浪费

**灵感来源**：受 GitHub Trending 上的 OpenUsage 项目启发，我们将其从"AI 工具订阅追踪器"扩展为**通用订阅管理平台**，支持流媒体、软件、云服务、游戏等各类订阅。

### ✨ 核心特性

| 特性 | 描述 | 图标 |
|------|------|------|
| 🎯 **订阅管理** | 添加、编辑、删除订阅，支持多币种 | 💳 |
| 📊 **数据可视化** | 仪表板展示支出统计、分类占比 | 📈 |
| ⏰ **续费提醒** | 7天内到期自动提醒，避免服务中断 | 🔔 |
| 🏷️ **智能分类** | 9大预设分类（流媒体/软件/云服务等） | 🗂️ |
| 💱 **多币种支持** | 支持人民币、美元、欧元等8种货币 | 💰 |
| 📅 **灵活周期** | 支持周/月/季/年多种计费周期 | 📆 |
| 🔔 **本地通知** | 系统级通知提醒，无需网络 | 🔔 |
| 🔒 **数据安全** | 本地存储，隐私数据不上传云端 | 🔐 |

### 🚀 快速开始

#### 环境要求

- **Node.js** >= 18.0.0
- **Rust** >= 1.70.0
- **操作系统**: Windows 10+/macOS 11+/Linux

#### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/gitstq/SubTrack.git
cd SubTrack

# 安装依赖
npm install

# 安装 Tauri CLI
npm install -g @tauri-apps/cli

# 开发模式运行
npm run tauri:dev

# 构建生产版本
npm run tauri:build
```

### 📖 详细使用指南

#### 添加订阅

1. 点击侧边栏底部的 **"添加订阅"** 按钮
2. 填写订阅信息：
   - **名称**: 订阅服务名称（如 Netflix）
   - **分类**: 选择预设分类
   - **金额与货币**: 输入费用并选择币种
   - **计费周期**: 周/月/季/年
   - **日期**: 开始日期和下次续费日期
3. 点击保存

#### 查看统计

- **仪表板**: 总览月度/年度支出、活跃订阅数、即将续费
- **分析页**: 月度趋势图、支出排行、分类分布

#### 续费提醒

- 系统会自动检测7天内到期的订阅
- 在仪表板"即将续费"卡片查看
- 支持本地系统通知

### 💡 设计思路与迭代规划

#### 技术选型

| 技术 | 用途 | 选择理由 |
|------|------|----------|
| **Tauri** | 跨平台框架 | 轻量、安全、Rust 后端 |
| **React** | UI 框架 | 组件化、生态丰富 |
| **Tailwind CSS** | 样式 | 原子化、开发效率高 |
| **date-fns** | 日期处理 | 轻量、功能完善 |

#### 后续迭代计划

- [ ] 🌐 数据云同步功能
- [ ] 📱 移动端 App
- [ ] 🤖 AI 订阅优化建议
- [ ] 📧 邮件提醒服务
- [ ] 📤 数据导出 Excel/PDF

### 📦 打包与部署

#### 构建命令

```bash
# Windows
npm run tauri:build -- --target x86_64-pc-windows-msvc

# macOS
npm run tauri:build -- --target x86_64-apple-darwin
npm run tauri:build -- --target aarch64-apple-darwin

# Linux
npm run tauri:build -- --target x86_64-unknown-linux-gnu
```

#### 输出目录

构建产物位于 `src-tauri/target/release/bundle/`：
- **Windows**: `.msi` 安装包
- **macOS**: `.dmg` 磁盘镜像 + `.app` 应用
- **Linux**: `.deb` / `.rpm` 安装包

### 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 繁體中文

### 🎉 專案介紹

SubTrack 是一款**跨平台桌面應用**，專為現代數位生活設計。在這個訂閱服務氾濫的時代，我們幫助您：

- 📈 **清晰掌握**每月/每年的訂閱支出
- ⏰ **及時提醒**即將到期的訂閱
- 📊 **智能分析**消費趨勢和分類占比
- 💰 **優化預算**避免不必要的訂閱浪費

### ✨ 核心特性

| 特性 | 描述 | 圖示 |
|------|------|------|
| 🎯 **訂閱管理** | 新增、編輯、刪除訂閱，支援多幣種 | 💳 |
| 📊 **資料視覺化** | 儀表板展示支出統計、分類占比 | 📈 |
| ⏰ **續費提醒** | 7天內到期自動提醒，避免服務中斷 | 🔔 |
| 🏷️ **智慧分類** | 9大預設分類（串流媒體/軟體/雲服務等） | 🗂️ |
| 💱 **多幣種支援** | 支援新台幣、美元、歐元等8種貨幣 | 💰 |
| 📅 **靈活週期** | 支援週/月/季/年多種計費週期 | 📆 |
| 🔔 **本地通知** | 系統級通知提醒，無需網路 | 🔔 |
| 🔒 **資料安全** | 本地儲存，隱私資料不上傳雲端 | 🔐 |

### 🚀 快速開始

#### 環境需求

- **Node.js** >= 18.0.0
- **Rust** >= 1.70.0
- **作業系統**: Windows 10+/macOS 11+/Linux

#### 安裝步驟

```bash
# 複製倉庫
git clone https://github.com/gitstq/SubTrack.git
cd SubTrack

# 安裝相依套件
npm install

# 安裝 Tauri CLI
npm install -g @tauri-apps/cli

# 開發模式執行
npm run tauri:dev

# 建置生產版本
npm run tauri:build
```

### 📖 詳細使用指南

#### 新增訂閱

1. 點擊側邊欄底部的 **"新增訂閱"** 按鈕
2. 填寫訂閱資訊：
   - **名稱**: 訂閱服務名稱（如 Netflix）
   - **分類**: 選擇預設分類
   - **金額與貨幣**: 輸入費用並選擇幣種
   - **計費週期**: 週/月/季/年
   - **日期**: 開始日期和下次續費日期
3. 點擊儲存

### 📦 打包與部署

建置產物位於 `src-tauri/target/release/bundle/`：
- **Windows**: `.msi` 安裝程式
- **macOS**: `.dmg` 映像檔 + `.app` 應用程式
- **Linux**: `.deb` / `.rpm` 安裝套件

### 📄 開源協議

本專案採用 [MIT License](LICENSE) 開源協議。

---

## English

### 🎉 Project Introduction

SubTrack is a **cross-platform desktop application** designed for modern digital life. In this era of subscription overload, we help you:

- 📈 **Clearly track** monthly/yearly subscription expenses
- ⏰ **Timely reminders** for upcoming renewals
- 📊 **Smart analytics** for spending trends and category breakdown
- 💰 **Optimize budget** to avoid unnecessary subscription waste

### ✨ Core Features

| Feature | Description | Icon |
|---------|-------------|------|
| 🎯 **Subscription Management** | Add, edit, delete subscriptions with multi-currency support | 💳 |
| 📊 **Data Visualization** | Dashboard showing spending stats and category breakdown | 📈 |
| ⏰ **Renewal Reminders** | Auto-reminders for subscriptions expiring within 7 days | 🔔 |
| 🏷️ **Smart Categories** | 9 preset categories (Streaming/Software/Cloud, etc.) | 🗂️ |
| 💱 **Multi-Currency** | Support for 8 currencies: USD, EUR, GBP, CNY, etc. | 💰 |
| 📅 **Flexible Billing** | Weekly/Monthly/Quarterly/Yearly billing cycles | 📆 |
| 🔔 **Local Notifications** | System-level notifications, no internet required | 🔔 |
| 🔒 **Data Security** | Local storage, privacy data never uploaded to cloud | 🔐 |

### 🚀 Quick Start

#### Requirements

- **Node.js** >= 18.0.0
- **Rust** >= 1.70.0
- **OS**: Windows 10+/macOS 11+/Linux

#### Installation

```bash
# Clone repository
git clone https://github.com/gitstq/SubTrack.git
cd SubTrack

# Install dependencies
npm install

# Install Tauri CLI
npm install -g @tauri-apps/cli

# Run in development mode
npm run tauri:dev

# Build production version
npm run tauri:build
```

### 📖 Usage Guide

#### Adding a Subscription

1. Click the **"Add Subscription"** button in the sidebar
2. Fill in subscription details:
   - **Name**: Service name (e.g., Netflix)
   - **Category**: Select from preset categories
   - **Amount & Currency**: Enter cost and select currency
   - **Billing Cycle**: Weekly/Monthly/Quarterly/Yearly
   - **Dates**: Start date and next billing date
3. Click Save

### 📦 Building & Deployment

Build artifacts are located in `src-tauri/target/release/bundle/`:
- **Windows**: `.msi` installer
- **macOS**: `.dmg` disk image + `.app` bundle
- **Linux**: `.deb` / `.rpm` packages

### 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ for better subscription management**

[⭐ Star us on GitHub](https://github.com/gitstq/SubTrack) | [🐛 Report Issue](https://github.com/gitstq/SubTrack/issues)

</div>
