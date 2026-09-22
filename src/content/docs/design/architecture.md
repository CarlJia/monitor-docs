---
title: 架构总览
description: agent 与 hub 的连接方式、上报的数据，以及请求路径。
---

一句话：**agent 主动连 hub（一条长期 WebSocket），把 facts 与 metrics 推上去；hub 存进 SQLite，后台、状态页与主题再经同源 HTTP / WebSocket 接口取数。**

```
agent (Linux)  ⇄── WebSocket · MessagePack ──⇄  hub (axum + SQLite)  ──▶  后台 /admin · 状态页 / 主题
```

## agent ⇄ hub 的连接

agent 用一条**长期 WebSocket** 接到 hub 的 `/api/agent/ws`，握手时带 `Authorization: Bearer <token>`——token 决定它是哪个 node。链路上的帧是 **MessagePack** 编码（比反复写字段名的 JSON 省下大部分每帧字节开销）；信封沿用 JSON-RPC 的形状 `{ version, jsonrpc, method, params }`，最前面的 `version` 让协议不匹配在解出任何字段之前就失败关闭。

这条连接是**双向**的，不是单向上报：agent 上送 `hello`（facts）与 `report`（metrics），hub 在握手后立刻下发一份探测任务（`ping.tasks`，目前唯一的 hub→agent 出站），并每 30 秒发一次 WebSocket Ping——120 秒收不到任何帧就判定掉线。所以面板里的"在线"表示连接在手，而不是"刚刚报过数"；一个连上但还没报数的节点也算在线。

## agent 上报什么

agent 直接解析 `/proc` 与 `statvfs`，不依赖采集库。它上报两类数据：

- **Facts**（连接时一次，之后仅在变化时重发）：主机名、系统、内核、架构、虚拟化类型、CPU 型号与核数、内存 / swap / 磁盘总量、agent 版本、本机 IPv4 / IPv6。
- **Metrics**（每 `--interval` 秒一次，默认 1 秒）：CPU、负载、内存、swap、磁盘、网卡收发速率与内核累计计数器、TCP / UDP 连接数、进程数、运行时间，以及 `boot_id`。

其中 `net_rx_total` / `net_tx_total` 是内核 lifetime 计数器，原样上报；`boot_id` 取自 `/proc/sys/kernel/random/boot_id`，是 hub 判断主机是否重启的唯一依据。字段的权威定义在 agent 的 `src/collect.rs`（`Facts` 与 `Metrics` 两个 struct）。

## hub 这边

hub 是单个二进制，内部是 axum HTTP 服务 + SQLite 数据库；后台与主题这两个前端也由 `rust_embed` 编进同一个二进制。它同时承载：

- **agent 长连接**：`/api/agent/ws`，接收 hello / report，下发探测任务。
- **公开页 API**：状态页与主题读的只读接口（节点列表、实时指标、历史指标），以及给面板推实时的 `/api/ws`。
- **后台**：`/admin`（内嵌 SPA），其增删改查走 `/api/*`。

主题是纯静态 SPA，只依赖 hub 的几个同源只读接口，不发起外部请求。协议与接口细节见[主题开发](/extend/theme-dev/)。

## 插件在哪

hub 内嵌一个 wasmtime 沙箱，运行 WASM 插件。节点事件（掉线 / 恢复）与插件自定义事件都经通知派发路径送到订阅者。这是本 fork 相对上游的核心增量，详见[插件系统总览](/extend/plugins/)。

## 原文链接

- 组成与协议：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md)（其架构一行为旧表述，实际 wire 协议见 `src/agent_ws.rs` 与 agent 的 `src/main.rs`）
- 上报字段：[`CarlJia/agent` README](https://github.com/CarlJia/agent/blob/main/README.md) 与 `src/collect.rs`
