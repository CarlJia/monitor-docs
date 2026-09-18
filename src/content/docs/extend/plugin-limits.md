---
title: 资源限制
description: fuel、墙钟、kv、plugin_data、http 响应、日志与上传包的上限。
---

| 限制 | 值 | 说明 |
|---|---|---|
| fuel（事件派发） | 默认 1,000,000 指令/调用 | setting `plugin.fuel_limit` 可调；耗尽即中断（死循环被截断） |
| fuel（数据面钩子） | 默认 20,000,000 指令/调用 | setting `plugin.hook_fuel_limit` 可调；`on_tick`/`render_page`/`on_action`/`on_cleanup` 用这一档——它们的开销随插件自己的数据规模增长 |
| 墙钟 | 默认 5 秒/调用 | setting `plugin.timeout_ms` 可调 |
| kv 值 | 8 KiB | `host_kv_set` 与面板 KV 编辑器同限 |
| plugin_data 行 | 256 KiB | `host_data_put` 单行上限；超出返回 -6 |
| plugin_data 总占用 | 16 MiB / 插件 | 超额返回 -6 |
| http 响应 | resp 缓冲容量（自选） | 插件自己决定缓冲大小（如 4 KiB），超出部分截断 |
| 插件日志 detail | 16 行 / 每行 200 字节 / 合计 500 字节 | 一次调用里经 `host_log` 打的话，取**最新**，超出的更早行丢弃并在开头标注；不可见字符折成空格 |
| 上传包 | 8 MiB | tar.gz 整包 |

数据面钩子为什么单列一档 fuel：`render_page` 要列出全部节点，开销随机器数增长，按有界事件载荷定的派发那档不够用。财务插件实测：空页面 44 万 fuel、每台机器再 5.4 万；tick 是 67 万 + 每台 2.4 万。

## 原文链接

- 资源限制表：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 「资源限制」小节
