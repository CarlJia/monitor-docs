---
title: 通知
description: 节点事件与插件驱动的事件流，以及到期提醒去哪了。
---

:::note
本 fork 的通知是**插件驱动**的，不是 hub 内置配置。要发 Telegram / Webhook，装对应的通知插件（仓库内置 `tg-notify` 参考实现），配置写在插件的 KV 里。写法见[插件系统总览](/monitor-docs/extend/plugins/)。
:::

## 事件从哪来

hub 自身只产生两种事件：

- `agent_offline` — 节点掉线
- `agent_online` — 节点恢复

这两种事件会派发给所有订阅了它们的已启用插件。除此之外的事件（如到期提醒）由插件自己经 `host_emit_event` 发出，事件名以 `plugin_` 开头。

## 到期提醒去哪了

自 ABI v2 起，**hub 内置的到期提醒已退役**。到期由财务类插件发 `plugin_expiry_soon`，其他插件订阅这条而不是旧的 `expiry_soon`。未安装财务插件的部署不再有到期通知。仓库内置 `finance-stats` 参考实现负责财务统计与到期事件。

## 配置渠道

渠道配置（bot token 等）不打进 wasm，而是在插件 manifest 里用 `[[kv]]` 声明字段，值写在面板的插件 KV 编辑器里，插件运行时用 `host_kv_get` 读取。详见[面板页面协议](/monitor-docs/extend/plugin-panel/)与[资源限制](/monitor-docs/extend/plugin-limits/)。

## 原文链接

- 事件模型与插件通知：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 「插件开发」章节
