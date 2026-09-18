---
title: 安装 Hub
description: 用一键脚本装 monitor hub，或手动运行二进制。
---

hub 用一个脚本安装。有终端时给菜单，`curl ... | sh` 无终端时按默认值装。

## 一键脚本

```bash
curl -fsSL https://raw.githubusercontent.com/CarlJia/monitor/main/install-hub.sh -o install-hub.sh
chmod +x install-hub.sh
sudo ./install-hub.sh
```

脚本会：核对 release 的 `sha256sums.txt` 后才把二进制放进 `/opt/monitor`，建一个 `monitor` 系统用户，写一个加固过的 systemd 单元，最后打印三种反向代理配法。

**重跑一次就是升级**：校验通过才替换二进制，起不来自动回滚到上一版；没写的参数沿用上次的，所以升级不会把端口和 `--site` 冲掉。详见[升级与卸载](/monitor-docs/install/lifecycle/)。

### 参数

| 参数 | 说明 |
|---|---|
| `--port <n>` | 本机监听端口，默认 `28080` |
| `--site <url>` | 一般不用填，见下方「什么时候要 `--site`」 |
| `--uninstall` | 卸载，数据保留在 `/opt/monitor/data` |
| `--purge` | 卸载并删除数据库 |
| `--yes` / `-y` | 跳过确认 |
| `--help` / `-h` | 用法 |

### 目录结构

除了 systemd 单元，其余都在一个目录下：

```text
/opt/monitor/
├── monitor-hub          # hub 二进制
├── monitor-agent        # 这台机器也装了 agent 的话
├── agent.env            # agent 的 token，0600 root
└── data/                # 服务唯一可写的目录，0700 monitor
    ├── monitor.db
    └── themes/          # 后台装的外部主题
```

服务以 `monitor` 用户运行，单元里写了 `ReadWritePaths=/opt/monitor/data`，所以它连自己的二进制都写不了。

### 首次登录

首次安装会打印一次性应急密码（只显示这一次）。装完脚本会给出面板地址与密码；登录后到「设置」里改掉。找不到就查日志：

```bash
journalctl -u monitor-hub | grep Emergency
```

## hub 只监听本机

hub 绑定 `127.0.0.1`，公网访问不到——这是故意的，凭证不会在链路上裸奔，也没有端口要防火墙。要从公网访问，得配一层反向代理：见[反向代理](/monitor-docs/install/reverse-proxy/)。

### 什么时候要 `--site`

一般不用填：面板拼装 agent 安装命令用的是浏览器地址栏，配好反代用域名访问就自动对了。只有两种情况要填：你进面板的地址不是节点能用的地址（比如走 SSH 隧道），或反代不发 `X-Forwarded-Proto`。`--site` 必须是 `https://` 开头的域名（不能是 IP、不能带路径）。

## 手动运行

不走脚本时（或没有 systemd）：

```bash
monitor-hub --listen 127.0.0.1:28080 --db /opt/monitor/data/monitor.db
```

## 原文链接

- 安装脚本的参数、菜单与目录结构：[`CarlJia/monitor` install-hub.sh](https://github.com/CarlJia/monitor/blob/main/install-hub.sh)
