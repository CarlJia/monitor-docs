---
title: 自托管服务器监控
description: monitor 二开版的安装、部署、架构与插件开发文档。
template: splash
hero:
  tagline: monitor 二开版：自托管监控 + WASM 插件系统。
  actions:
    - text: 安装 Hub
      link: /monitor-docs/install/hub/
      icon: right-arrow
      variant: primary
    - text: 接入 Agent
      link: /monitor-docs/install/agent/
      icon: right-arrow
    - text: 插件开发
      link: /monitor-docs/extend/plugins/
      icon: right-arrow
---

## 这套东西怎么运转

agent 跑在每台被监控的机器上，采集 CPU、内存、磁盘、网络等指标，经 WebSocket 实时推给 hub；hub 用 axum + SQLite 存下来，再通过只读接口喂给后台和状态页。

```
agent (Linux)  ──WebSocket / JSON-RPC 2.0──▶  hub (axum + SQLite)  ──▶  后台 + 状态页 / 主题
```

本项目是上游 monitor 的二开，最主要的增量是 **WASM 插件系统**——通知、财务统计都是沙箱插件，而不是写死在 hub 里。想了解全貌，从[这是什么](/monitor-docs/start/what-is/)与[架构总览](/monitor-docs/start/architecture/)开始。
