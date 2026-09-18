---
title: 登录与安全
description: 应急密码、改密，以及登录不通时的排查。
---

## 首次登录

hub 首次启动（数据库不存在时）会生成一个**一次性应急密码**，打印在日志里，只出现这一次。安装脚本装完会直接显示；手动部署或错过了就查日志：

```bash
journalctl -u monitor-hub | grep Emergency
```

用这个密码登录 `/admin`，然后立刻到「设置」里改掉。

## hub 只在本机

面板监听 `127.0.0.1`，公网访问不到——凭证不会在链路上裸奔。对外访问一律经[反向代理](/monitor-docs/install/reverse-proxy/)，由反代终止 TLS。

## 登录不通时

- **面板打不开**：确认反代把 `/` 转到了 hub 的端口，且 hub 服务在跑（`systemctl status monitor-hub`）。
- **agent 装不上 / 命令地址不对**：面板拼安装命令用的是浏览器地址栏。若反代没发 `X-Forwarded-Proto`，拼出来会是 http；要么修反代，要么给 hub 显式 `--site https://你的域名`。

## 原文链接

- 应急密码与登录：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 与 install-hub.sh
