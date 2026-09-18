---
title: 主题开发
description: theme.json、主题契约与本地开发。
---

主题是纯静态 SPA。参考实现 `monitor-theme-gymin` 用 React + Vite + shadcn/ui。

## 主题包格式

一个可安装主题是一个目录，名字必须与 `theme.json` 的 `short` 相同：

```text
<themes-dir>/<short>/
├── theme.json
├── preview.png        # 可选，面板上的预览图
└── dist/
    └── index.html
```

`theme.json` 字段均为字符串：

| 字段 | 含义 |
|---|---|
| `name` | 显示名称 |
| `short` | 唯一短名，限字母、数字、`-`、`_`，取 `default` 则顶替 hub 内置那份 |
| `description` | 简介 |
| `version` | 主题版本 |
| `author` | 作者 |
| `url` | 源码地址 |

## 主题契约

主题只能依赖下列同源接口（地图底图与国旗为打包内置，不发外部请求）：

| 接口 | 用途 |
|---|---|
| `GET /api/me` | 站点名、登录状态、公开页开关 |
| `GET /api/nodes` | 节点列表、实时指标和累计流量 |
| `GET /api/nodes/{id}/metrics` | 历史指标和延迟记录 |
| `GET /api/ws` | 每 2 秒推送一次节点快照的 WebSocket |

`metrics` 的查询参数可省：`hours=N` 窗口宽度（匿名上限 168，登录后 2160，超出静默 clamp）；`points=W` 调用方画得下的点数（只会让 hub 抽得更稀）；`series=metrics|ping` 只取要画的那一半。

整个窗口的丢包率在响应的 `loss` 里，按探测 id 给百分比。**不要拿样本行里的 `loss` 自己平均**：那一个是所在桶的百分比，除数已经丢了，各桶样本数天然不等，平均会严重失真。

匿名访问 `GET /api/nodes` 仅返回 `public=1` 的节点，响应中不含 `ip`、`hostname`、`remark`。字段定义以 hub 的 `src/api.rs` 为准。未知路径回落到主题的 `dist/index.html`，客户端路由可用；`/admin/*` 由 hub 内置后台接管。

## 本地开发

启动一个 hub 实例，再起 Vite 开发服务器（Vite 把 `/api` 与 WebSocket 代理至 hub）：

```bash
monitor-hub --listen 127.0.0.1:9911 --db /tmp/monitor.db --site http://127.0.0.1:9911
npm ci
npm run dev
```

本地构建并打包：`npm run build && npm run package-theme`，产出 `theme.tar.gz` 与 `theme.tar.gz.sha256`。

## 原文链接

- 主题包格式与主题契约：[`CarlJia/monitor-theme-gymin` README](https://github.com/CarlJia/monitor-theme-gymin/blob/main/README.md)
