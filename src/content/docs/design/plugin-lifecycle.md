---
title: 上传与生命周期
description: 打包、上传、升级、启用、测试、页面、清理、日志。
---

1. **打包**：`plugin.tar.gz` 内含 `plugin.toml` 与 `plugin.wasm`。
2. **上传**：面板「插件」页，或 `POST /api/plugins`（multipart 字段 `plugin`）。上传时做预热校验（manifest 合法性、模块能编译、导出契约齐全），失败原因写进插件状态供面板查看；上传后默认**不启用**。
3. **升级**：同一个 `plugin_id` 再次上传即就地替换，但**只有版本更高才换**（`plugin.toml` 的 `version` 按点分段比数字，`1.10` > `1.9`；同版本与降级一律 400）。替换保留行 id、`kv` 与 `plugin_data`，并把插件拨回**停用**，重新启用才装载新包——面板上的删除会连插件数据一起删，所以升级不要走「先删再传」。
4. **启用**：`POST /api/plugins/{id}/enable`（加载失败会标记 `failed` 并带原因）。
5. **测试**：`POST /api/plugins/{id}/test` 构造一条合成的 `plugin_expiry_soon` 事件，走与真实派发完全相同的执行路径。派发前先按 manifest 的 `[[kv]]` 预检必填项，缺项直接 400 点名缺哪一项。
6. **页面**：`GET /api/plugins/{id}/page` 调 `render_page` 拿 JSON 描述；面板里的交互走 `POST /api/plugins/{id}/action` 调 `on_action`。
7. **清理**：`POST /api/plugins/{id}/cleanup` 调 `on_cleanup`——清理逻辑完全在插件手里，宿主只转发调用与回收统计。
8. **日志**：`GET /api/plugins/{id}/logs` 返回最近 100 条派发结果（进程内环形缓冲，重启后为空；长期审计在 notification_log）。每条另带 `detail`：插件自己经 `host.log` 打的话——`other:2` 这种错误码是插件私有的，原因只可能在那句话里。`detail` 只进内存派发日志，不进 notification_log。

## 渠道配置放哪

渠道配置（bot token 等）不建议打进 wasm——在 manifest 里用 `[[kv]]` 声明字段，值写在面板的插件 KV 编辑器里（`PUT /api/plugins/{id}/kv/{key}`），插件运行时用 `host_kv_get` 读取。插件自有数据请走 `host_data_*`——这两套互不相通。

## 原文链接

- 上传与生命周期：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 「上传与生命周期」小节
