---
title: 自托管服务器监控
description: monitor 二开版的安装、部署、架构与插件开发文档。
template: splash
hero:
  tagline: 装好主控 Hub，接上 Agent，就能在一个面板里看到所有机器。
  actions:
    - text: 快速开始
      link: /#快速开始
      icon: right-arrow
      variant: primary
    - text: 安装 Hub
      link: /install/hub/
      icon: right-arrow
    - text: 接入 Agent
      link: /install/agent/
      icon: right-arrow
---

## 快速开始

整个系统只有两个角色：**Hub**（主控端，装一台）和 **Agent**（装在每台被监控的机器上）。先把 Hub 跑起来，再挨台接 Agent。

### 第一步：安装主控 Hub

挑一台机器做主控端，执行一键脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/CarlJia/monitor/main/install-hub.sh -o install-hub.sh
chmod +x install-hub.sh
sudo ./install-hub.sh
```

脚本会校验并安装二进制、注册 systemd 服务，结束时打印面板地址和一次性应急密码（只显示一次，请记下）。

也可以用 Docker 跑：

```bash
docker run -d --name monitor-hub \
  -p 127.0.0.1:28080:28080 \
  -e TZ=Asia/Shanghai \
  -v /opt/monitor/data:/data \
  ghcr.io/CarlJia/monitor
```

Hub 默认只监听本机，公网访问要在它前面配一层反向代理。参数细节见[安装 Hub](/install/hub/)，容器要点见 [Docker 部署](/install/docker/)，公网访问见[反向代理](/install/reverse-proxy/)。

### 第二步：接入 Agent

登录面板，添加节点，复制面板生成的命令，到目标机器上执行：

```bash
curl -fsSL https://your-hub/install.sh | sh -s -- --server https://your-hub --token <token>
```

要一次给一批机器装，用注册 key 代替逐台复制 token：

```bash
curl -fsSL https://your-hub/install.sh | sh -s -- --server https://your-hub --register <key>
```

重跑同一条命令不会重复注册；参数与卸载方式见[接入 Agent](/install/agent/)。

## 想了解细节

- [这是什么](/start/what-is/) —— 这个项目解决什么问题
- [架构总览](/start/architecture/) —— agent、hub 与插件怎么协作
- [安装 Hub](/install/hub/) —— 脚本参数、目录结构、应急密码
- [反向代理](/install/reverse-proxy/) —— 让 Hub 可以从公网访问
- [接入 Agent](/install/agent/) —— 单台 / 批量安装、换发 token、卸载
- [Docker 部署](/install/docker/) —— 镜像、时区与数据卷
- [升级 / 卸载 / 迁移](/install/lifecycle/) —— 日常维护
- [插件系统总览](/extend/plugins/) —— 通知、财务统计都是沙箱插件
