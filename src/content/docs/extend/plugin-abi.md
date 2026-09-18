---
title: ABI v2 契约
description: 必须导出、宿主函数与错误码。
---

模块 target 为 `wasm32-unknown-unknown`，`crate-type = ["cdylib"]`（std 可用，但没有网络/时间/文件等系统调用——一律走宿主函数）。

## 必须导出

缺失或签名不符在加载时被拒。

| 导出 | 签名 | 用途 |
|---|---|---|
| `memory` | 线性内存 | 所有指针都落在它上面 |
| `on_event` | `(ptr: i32, len: i32) -> i32` | 事件入口；返回 0 成功，非 0 是插件自定义错误码 |
| `__alloc` | `(cap: i32) -> i32` | 分配器；宿主写事件载荷、`host_resp_alloc` 回程都走它（简单 bump 分配器即可） |

## 按 manifest 声明按需导出

少导则在加载时被拒，多导不会报错，但宿主不会主动调用。

| 导出 | 触发时机 |
|---|---|
| `on_tick()` | manifest 声明 `[tick]` 时，宿主每小时调一次 |
| `render_page(ptr, len) -> i32` | manifest 声明 `[page]` 时，面板打开页面时调用，返回值为写入响应缓冲的字节数 |
| `on_action(ptr, len) -> i32` | manifest 声明 `[page]` 时，面板里的交互（按钮/表单提交）调用 |
| `on_cleanup(ptr, len) -> i32` | manifest 声明 `[cleanup]` 时，面板里的「清理」按钮调用 |

## 宿主函数

从名为 `"host"` 的 wasm import 模块导入（Rust 侧用 `#[link(wasm_import_module = "host")]` + `#[link_name = "..."]`）。

| 函数 | 签名 | 返回值 / 说明 |
|---|---|---|
| `host_log` | `(level: i32, ptr, len)` | 无；level 0=debug 1=info 2=warn 3=error。文本随该次派发的 `detail` 出现在面板「派发日志」与「测试」结果里 |
| `host_now` | `() -> i64` | 当前 Unix 秒 |
| `host_resp_alloc` | `(cap: i32) -> i32` | 宿主回调 `__alloc` 拿响应缓冲 |
| `host_http_post` | `(method_ptr, method_len, url_ptr, url_len, body_ptr, body_len, resp_ptr, resp_cap) -> i32` | 写 `Content-Type: application/json` 的 POST；错误码见下表 |
| `host_http_get` | `(url_ptr, url_len, resp_ptr, resp_cap) -> i32` | 固定 GET；同样见错误码表 |
| `host_kv_get` | `(key_ptr, key_len, out_ptr, out_cap) -> i32` | 写入 `out` 的字节数；**0 = 无值或空**；-1 越界/非法 UTF-8；-8 读库失败 |
| `host_kv_set` | `(key_ptr, key_len, val_ptr, val_len) -> i32` | 0 成功；-1 越界/值超 8 KiB；-2 写库失败 |
| `host_nodes_query` | `(out_ptr, out_cap) -> i32` | 把全部节点的精简快照（id/name/online）写进缓冲；返回字节数、-1 越界或 -6 放不下。仅供只读查询 |
| `host_emit_event` | `(name_ptr, name_len, payload_ptr, payload_len) -> i32` | 0 成功；-1 越界、-7 事件名不以 `plugin_` 开头、-8 内部错误 |
| `host_data_put` | `(key_ptr, key_len, val_ptr, val_len) -> i32` | 写一行；value 上限 256 KiB、单插件总占用上限 16 MiB；超限 -6 |
| `host_data_get` | `(key_ptr, key_len, out_ptr, out_cap) -> i32` | 取一行；0 表示无此 key；-1 越界/非 UTF-8 |
| `host_data_delete` | `(key_ptr, key_len) -> i32` | 删一行；-1 越界 |
| `host_data_list` | `(prefix_ptr, prefix_len, out_ptr, out_cap) -> i32` | 按前缀列出，JSON 数组 `[{"key":"node:1","data":"..."},...]`；返回字节数、-1 越界或 -6 放不下 |

## 错误码汇总

| 码 | 含义 |
|---|---|
| -1 | 参数越界 / 非法 UTF-8 |
| -2 | URL 不是 `https://`（http_get / http_post 共用） |
| -3 | http_post 的 method 不是 `POST` |
| -4 | 网络请求失败 / 派发墙钟耗尽 |
| -5 | 响应状态非 2xx |
| -6 | plugin_data 超额（单行 / 单插件总占用） |
| -7 | emit_event 的事件名不以 `plugin_` 开头 |
| -8 | 数据库错误（kv_get / nodes_query / emit_event / data 系列共用此码） |
| -9 | http 目标解析到私有/保留网段，拒绝（SSRF 防线） |

## SSRF 防线

`host_http_post` / `host_http_get` 只允许访问公网 https 地址：私有段（10/8、172.16/12、192.168/16）、回环、链路本地与云元数据（169.254.169.254）、CGNAT、保留段，以及解析后落进这些网段的主机名，一律按 -9 拒绝。插件请求**不跟随重定向**（3xx 表现为 -5）。这是**插件的**限制——宿主自身的 http 调用（主题、GitHub、运维配置的 `github_proxy` 镜像）不经过这层。

## 事件载荷

宿主经 `__alloc` 分配缓冲、写入事件 JSON（UTF-8），再调 `on_event(ptr, len)`。按字段名反序列化、容忍新增字段：

```json
{"type":"agent_offline","node_id":5,"name":"edge-1","observed_at":100,"last_seen_at":90}
{"type":"agent_online","node_id":5,"name":"edge-1","observed_at":300}
{"type":"plugin_expiry_soon","node_id":7,"name":"edge-1","expires_at":"2026-10-01","days_left":7,"threshold_days":7}
```

宿主事件只有 `agent_offline` / `agent_online` 两种 `type`，加上任意 `plugin_<作者选>` 由插件经 `host_emit_event` 发出。面板只识别 `agent_*` 与 `plugin_*` 前缀的事件。

## 原文链接

- ABI v2 契约、宿主函数与错误码：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 「ABI v2 契约」小节
