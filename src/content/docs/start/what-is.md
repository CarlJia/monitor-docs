---
title: 这是什么
description: monitor 二开版的定位、组成，以及与上游项目的关系。
---

monitor 是一套**轻量、自托管的服务器监控**：agent 采集每台机器的指标，经 WebSocket 实时上报给 hub，hub 用后台面板与公开状态页把这些数据呈现出来。用 Rust 写成，资源占用低，数据完全在你自己的机器上。

## 组成

| 部分 | 说明 |
|---|---|
| **hub** | 后台、API 与公开页的宿主。axum + SQLite，单二进制。 |
| **agent** | 跑在被监控机器上的 Linux 采集器，静态链接单文件，常驻内存数 MB。 |
| **主题** | 状态页的前端表现层，可替换；hub 内置一份默认主题。 |

## 与上游的关系

本项目是 [monitor](https://github.com/monitor-probe/monitor) 的**二开**（fork）。相比上游，这份代码最主要的增量是 **WASM 插件系统**（ABI v2）——通知、财务统计等能力都以沙箱插件的形式接入，而不是写死在 hub 里。

因此本站文档的是**这份 fork 的形态**，权威来源是：

- [`CarlJia/monitor`](https://github.com/CarlJia/monitor) — hub
- [`CarlJia/agent`](https://github.com/CarlJia/agent) — agent
- [`CarlJia/monitor-theme-gymin`](https://github.com/CarlJia/monitor-theme-gymin) — 主题

上游项目的许可与作者署名保留在各仓库的 `LICENSE` 中。

## 从哪开始

- 想尽快跑起来 → [安装 Hub](/monitor-docs/install/hub/)
- 想接入一台机器 → [接入 Agent](/monitor-docs/install/agent/)
- 想写自己的插件 → [插件系统总览](/monitor-docs/extend/plugins/)

## 原文链接

- hub 定位与组成：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md)
