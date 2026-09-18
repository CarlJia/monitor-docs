---
title: 接入 Agent
description: 单台安装、批量注册、换发 token 与卸载。
---

在 hub 面板添加节点，复制生成的命令在目标主机执行。安装脚本识别 systemd 与 OpenRC。

## 单台安装

面板给出的命令形如：

```bash
curl -fsSL https://your-hub/install.sh | sh -s -- --server https://your-hub --token <token>
```

二进制装到 `/opt/monitor/monitor-agent`，token 写入 `/opt/monitor/agent.env`（`0600`）——和 hub 同一个目录，那台机器上只有这一处要看。重跑同一条命令不会新增节点：脚本认这台机器已注册的 token。

## 批量注册

一条命令给一批机器用注册 key，而不是逐台复制 token：

```bash
curl -fsSL https://your-hub/install.sh | sh -s -- --server https://your-hub --register <key>
```

`--register` 用 key 换取这台机器自己的 token。key 只在面板打开的窗口内有效，且永远不会成为 agent 运行时用的凭证。

## 参数

| 参数 | 默认 | 说明 |
|---|---|---|
| `--server` | 必填 | hub 地址，也可用环境变量 `MONITOR_SERVER` |
| `--token` | 二选一 | 节点 token，也可用 `MONITOR_TOKEN` |
| `--register` | 二选一 | 注册 key，换取本机 token |
| `--interval` | `1` | 上报间隔（秒），1–3600 |
| `--insecure` | — | 允许对无 TLS 的 hub 走明文 |

## 明文保护

agent 对非回环地址拒绝明文 `ws://`（token 会裸奔）。同样地，安装脚本对远程 hub 拒绝明文 `http://` 拉二进制——那是要以 root 跑的字节。只有 hub 在 `ip:port` 且前面没有 TLS 时，才用 `--insecure` 显式放行，脚本会明确警告。

## 卸载

```bash
# systemd
systemctl disable --now monitor-agent && rm -f /opt/monitor/monitor-agent /etc/systemd/system/monitor-agent.service
# OpenRC
rc-service monitor-agent stop && rc-update del monitor-agent && rm -f /opt/monitor/monitor-agent /etc/init.d/monitor-agent
```

## 原文链接

- 安装脚本的参数与注册逻辑：[`CarlJia/monitor` install.sh](https://github.com/CarlJia/monitor/blob/main/install.sh)
- agent 的运行参数与上报字段：[`CarlJia/agent` README](https://github.com/CarlJia/agent/blob/main/README.md)
