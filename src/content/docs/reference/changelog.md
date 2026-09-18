---
title: 更新日志
description: hub 近期版本要点。完整记录见源仓库 CHANGELOG。
---

要点摘录，完整记录见 [`CarlJia/monitor` CHANGELOG.md](https://github.com/CarlJia/monitor/blob/main/CHANGELOG.md)。

## 2.0.3 — 2026-09-18

- 插件上传支持同 `plugin_id` 更高版本**就地替换**，`plugin_data` 按 plugin_id 命名空间隔离，升级后历史记录保留。
- 后台上传插件改为单按钮触发，与「安装主题」一致。
- CI：Rust 编译产物纳入缓存，插件测试拆为并行 job。

## 2.0.2 — 2026-09-17

- 财务统计页：打开页面即拉一次汇率，失败原因落到提示条；编辑表列头中文化，币种与计费周期改下拉。
- 后台：下拉支持 `{value, label}` 形态；插件页面表单支持字段标签与下拉，`on_action` 响应可带 `toast`。

## 2.0.1 — 2026-09-17

- 后台「安全」页消除 CLS 0.18。
- 插件数据面钩子改用独立 fuel 预算（`DEFAULT_HOOK_FUEL_LIMIT = 20,000,000`），多机器部署下页面不再 502。

## 1.2.1 — 2026-09-17

- 插件失败透出插件自己的日志：派发的 `detail` 带上插件经 `host_log` 写的话，manifest 可声明必填配置。
- 拆出 `host_funcs.rs` 与 `log.rs`。

## 1.2.0 — 2026-09-16（插件 ABI v2，破坏性）

- **插件 ABI 升到 v2**：节点 JSON 去掉价格四列，财务数据由插件自持；新增宿主函数 `data_*` / `nodes_query` / `emit_event` / `http_get`；宿主只发 `agent_offline` / `agent_online`，到期改由财务插件发 `plugin_expiry_soon`。
- **http 宿主函数加 SSRF 防线**（错误码 -9）；仅作用于插件。
- **schema v6**：两段式门控删除 node 表退役的财务四列。
- **finance-stats** 财务统计插件；**tg-notify** 迁移到 v2。

## 1.1.0 — 2026-09-15

- Zima 风格展示优化（节点卡片、状态指示、布局密度）。

## 1.0.0 — 2026-09-15

- 初始版本：hub + agent + 内置默认主题三仓布局，WebSocket / JSON-RPC 2.0 通信；后台 + 公开状态页。

## 原文链接

- 完整变更记录：[`CarlJia/monitor` CHANGELOG.md](https://github.com/CarlJia/monitor/blob/main/CHANGELOG.md)
