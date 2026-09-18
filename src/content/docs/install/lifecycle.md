---
title: 升级 / 卸载 / 数据迁移
description: 重跑即升级、卸载的两种模式，以及换机搬迁。
---

## 升级

**重跑一次安装脚本就是升级。** 校验通过后才替换二进制，起不来自动回滚到上一版；命令行没写的参数沿用上次的，所以升级不会把端口和 `--site` 冲掉。

```bash
sudo ./install-hub.sh
```

## 卸载

两种模式：

```bash
sudo ./install-hub.sh --uninstall   # 移除服务与二进制，数据保留在 /opt/monitor/data
sudo ./install-hub.sh --purge       # 连数据库一起删，不可撤销
```

默认（`--uninstall`）保留数据，重新安装会直接接着用。

## 换机搬迁

hub 的所有状态都在 `/opt/monitor/data`（数据库 + 主题），一个目录即可整体搬走：

1. 旧机停服务：`systemctl stop monitor-hub`
2. 把整个 `/opt/monitor/data` 拷到新机同一路径
3. 新机跑安装脚本，它会直接接着用已有数据库

agent 无状态（不写文件、不存跨重启数据），不需要迁移；只要新 hub 地址可达，节点重新指过去即可。

## 原文链接

- 升级、回滚、卸载与 `--purge`：[`CarlJia/monitor` install-hub.sh](https://github.com/CarlJia/monitor/blob/main/install-hub.sh)
