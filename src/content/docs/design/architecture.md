---
title: 架构总览
description: agent 与 hub 的连接方式、上报的数据，以及请求路径。
---

一句话：**agent 主动连 hub，把指标推上去；hub 存进 SQLite，再通过 API 喂给后台和状态页。**

```
agent (Linux)  ──WebSocket / JSON-RPC 2.0──▶  hub (axum + SQLite)  ──▶  后台 + 状态页 / 主题
```

## agent 上报什么

agent 直接读 `/proc` 与 `statvfs`，不依赖第三方库。它上报两类数据：

- **Facts**（连接时上报一次）：主机名、系统、内核、架构、虚拟化类型、CPU 型号与核数、内存与磁盘总量、本机 IPv4 / IPv6。
- **Metrics**（每 `--interval` 秒一次）：CPU、负载、内存、swap、磁盘、网卡收发速率与内核累计计数器、TCP / UDP 连接数、进程数、运行时间。

其中 `net_rx_total` / `net_tx_total` 是内核 lifetime 计数器，原样上报；`boot_id` 取自 `/proc/sys/kernel/random/boot_id`，是 hub 判断主机是否重启的唯一依据。字段的权威定义在 agent 的 `src/collect.rs`（`Facts` 与 `Metrics` 两个 struct）。

## hub 这边

hub 是单个二进制，内部是 axum HTTP 服务 + SQLite 数据库。它同时承载：

- **agent 长连接**：`/api/agent/ws`，接收上报。
- **公开页 API**：状态页与主题读的只读接口（节点列表、实时指标、历史指标）。
- **后台**：`/admin/*`，管理节点、主题、插件、通知等。

主题是纯静态 SPA，只依赖 hub 的几个同源只读接口，不发起外部请求。协议与接口细节见[主题开发](/extend/theme-dev/)。

## 插件在哪

hub 内嵌一个 wasmtime 沙箱，运行 WASM 插件。节点事件（掉线 / 恢复）与插件自定义事件都经通知派发路径送到订阅者。这是本 fork 相对上游的核心增量，详见[插件系统总览](/extend/plugins/)。

## 原文链接

- 组成与协议：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md)
- 上报字段：[`CarlJia/agent` README](https://github.com/CarlJia/agent/blob/main/README.md) 与 `src/collect.rs`
