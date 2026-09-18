---
title: plugin.toml（manifest）
description: 插件清单的字段与校验规则。
---

```toml
plugin_id = "com.example.tg-notify"   # 反向域风格；不能为空、不能含 ':'
name = "Telegram 通知"                # 面板里显示的名字
version = "0.2.0"
abi_version = 2                       # 必须为 2
subscribes = ["agent_offline", "agent_online", "plugin_expiry_soon"]

[tick]                                # 可选：声明每小时调一次 on_tick
[page]                                # 可选：声明面板里的自定义页面
title = "财务统计"                    # page.title 在面板导航上显示
[cleanup]                             # 可选：声明 on_cleanup，由面板「清理」按钮调用

[[kv]]                            # 可选、可重复：面板「配置」对话框要展示的 kv 字段
key = "bot_token"                     # kv 的 key，必须与插件里 host_kv_get 读的名字逐字一致
label = "Telegram Bot Token"          # 显示用的人话名字；可省，省了只显示 key
required = true                       # 点「测试」前必须有值；可省，缺省 false
hint = "向 @BotFather 申请"            # 一句话填写提示；可省
```

## 校验规则

| 字段 | 规则 |
|---|---|
| `plugin_id` | 非空、不含 `:`（它是 kv 命名空间 `plugin.<plugin_id>:<key>` 的分隔符）；重复的 `plugin_id` 上传被拒，升级需先删除旧版 |
| `name` / `version` | 非空 |
| `abi_version` | 必须为 `2` |
| `subscribes` | 订阅的宿主事件列表，最多 32 条；v2 起宿主自身不再产生到期提醒，到期由财务类插件发 `plugin_expiry_soon`，其他插件订阅这条而不是旧的 `expiry_soon` |
| `wasm_entry` | 可选，缺省 `plugin.wasm`：包内 wasm 入口文件名 |
| `[tick]` | 存在则每小时调度一次 `on_tick` |
| `[page]` | 存在则面板里出现「页面」入口；`title` 必填 |
| `[cleanup]` | 存在则面板里出现「清理」按钮，调 `on_cleanup` |
| `[[kv]]` | 可选、可重复，最多 64 项。key 非空、不含 `:`、不超 128 字节、不重复、首尾无空白；`required` 的含义只是「点『测试』前应该有值」，**宿主在真实派发里从不检查它**——后台事件旁边没有操作员，一个 400 也无处可给 |

`subscribes` / `[tick]` / `[page]` / `[cleanup]` **至少要有一个**——纯插件不会有任何触达。只声明 `[[kv]]` 不算工作面（它只是面板的展示与预检）。

## 原文链接

- manifest 字段与校验：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 「plugin.toml（manifest）」小节
