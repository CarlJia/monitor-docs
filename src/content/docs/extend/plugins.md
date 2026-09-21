---
title: 插件系统总览
description: 为什么有插件、沙箱模型、能做什么、从哪开始。
---

hub 支持用 Rust 编写的 **WASM 通知插件**。节点到期、agent 掉线/恢复等事件会派发给所有订阅了该事件的已启用插件。插件在沙箱（wasmtime）里运行，只能通过 14 个宿主函数与外界交互——日志、时钟、键值存储、受限的 https 请求、节点只读查询、事件发出，以及自有的 key/value 数据存储。

这是本 fork 相对上游的核心增量：通知、财务统计这些能力都是插件，而不是写死在 hub 里。

## 沙箱模型

模块 target 为 `wasm32-unknown-unknown`，`crate-type = ["cdylib"]`。std 可用，但没有网络/时间/文件等系统调用——一律走宿主函数。http 请求受 SSRF 防线约束（只能访问公网 https）。威胁模型是「管理员安装的插件」，真正的隔离靠 wasm 沙箱边界。

## 两个参考实现

仓库内置两个完整可编译的参考实现：

- [`plugins/tg-notify`](https://github.com/CarlJia/monitor/tree/main/plugins/tg-notify) — Telegram 通知，订阅宿主事件。
- [`plugins/finance-stats`](https://github.com/CarlJia/monitor/tree/main/plugins/finance-stats) — 财务统计，自己发事件 + 面板页面 + 自清理。

## 快速开始

```sh
cd plugins/tg-notify
rustup target add wasm32-unknown-unknown   # 一次性
./build.sh                                  # 产出 plugin.tar.gz
cargo test                                  # 桩宿主冒烟测试
```

把它当模板复制一份，改 `plugin_id` 为你自己的反向域（如 `io.github.<用户名>.my-notify`）即可。

## 升级到 2.0.0 的破坏性变更

ABI v1（`abi_version = 1`）已停用，仅 v2——已安装的 v1 插件**不再加载**，需对着 v2 重编并重新上传。同时：节点 JSON 去掉 `price`/`currency`/`billing_cycle`/`expires_at` 四个字段、`notification.expiry_thresholds` 设置不再可读、宿主内置的到期提醒退役（改由财务插件发 `plugin_expiry_soon`）。未安装财务插件的部署不再有到期通知。旧库里那四列由启动迁移删除（需先启用财务插件完成导入），旧值不会被迁移。

## 往下读

- [plugin.toml（manifest）](/design/plugin-manifest/) — 字段与校验规则
- [ABI v2 契约](/design/plugin-abi/) — 导出、宿主函数、错误码
- [面板页面协议](/design/plugin-panel/) — 在面板里画 UI
- [资源限制](/design/plugin-limits/) — fuel、墙钟、存储上限
- [上传与生命周期](/design/plugin-lifecycle/) — 从打包到日志
- [已知约束](/design/plugin-caveats/) — 上线前必看

## 原文链接

- 插件系统总览：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 「插件开发」章节
