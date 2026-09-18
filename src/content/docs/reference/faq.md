---
title: 常见问题
description: 装不上、连不上、数字对不上，先查这里。
---

## 面板打不开 / 公网访问不到

hub 只监听 `127.0.0.1`，这是故意的。公网访问必须经[反向代理](/monitor-docs/install/reverse-proxy/)，由反代把域名转到 hub 端口。确认 hub 在跑：`systemctl status monitor-hub`。

## agent 装好了但面板不显示 / 安装命令地址不对

面板拼装 agent 安装命令用的是浏览器地址栏。若反代没发 `X-Forwarded-Proto`，拼出来会是 `http://`。两个办法：修反代让它发这个头，或给 hub 显式 `--site https://你的域名`。另外确认反代放行了 WebSocket（`/api/agent/ws` 是长连接）。

## 升级后 v1 插件不加载了

ABI v1 已停用，仅剩 v2。已安装的 v1 插件不再加载，需对着 v2 重编并重新上传。见[插件系统总览](/monitor-docs/extend/plugins/)的破坏性变更说明。

## 到期提醒不发了

自 v2 起，hub 内置的到期提醒退役，改由财务插件发 `plugin_expiry_soon`。**未安装 `finance-stats` 插件的部署不再有到期通知**，这是预期行为。装并启用财务插件即可恢复。

## 旧库里的价格/到期日那几列还在

自 v2 起 node 表不再持有价格/币种/周期/到期日，它们归财务插件的 `plugin_data`。旧四列由升级迁移删除，但**分两段**：只有财务插件已启用并导入节点后，下次启动才删列。「先换二进制、暂不装插件」的部署会一直保留这四列（闲置不读）。旧值不会自动迁移，需启用插件后在「财务统计」页重新录入。

## 插件一直失败，怎么不自动停

**失败不会自动禁用**。连续失败的插件需操作员手动 disable，或修复后上传一个**版本更高**的包（同版本与降级一律 400）。失败原因看插件的派发日志：`GET /api/plugins/{id}/logs`，每条带 `detail`（插件自己经 `host_log` 打的话）。

## 流量数字和商家对不上

流量按**本地日**切分。Docker 部署不设 `TZ` 会默认 UTC，天边界算错，统计就偏——一定要设 `TZ`（见 [Docker 部署](/monitor-docs/install/docker/)）。另外三个流量数字（上行/下行/合计）的口径、重置日与配额算法各不相同，对账时注意用的是哪一个。

## 原文链接

- 破坏性变更与已知约束：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 与 [CHANGELOG](https://github.com/CarlJia/monitor/blob/main/CHANGELOG.md)
