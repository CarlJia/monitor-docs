---
title: Docker 部署
description: 用容器跑 hub —— 镜像、时区与数据卷。
---

hub 也可以用容器跑。镜像基于 Alpine，装了 `tzdata`，数据挂在 `/data`。

```bash
docker run -d --name monitor-hub \
  -p 127.0.0.1:28080:28080 \
  -e TZ=Asia/Shanghai \
  -v /opt/monitor/data:/data \
  ghcr.io/CarlJia/monitor
```

和裸机安装一样，hub 只该从本机访问，公网访问仍要在容器前面配一层[反向代理](/install/reverse-proxy/)。

## 两个必须注意

1. **一定要设 `TZ`**。不设默认 UTC，日流量的天边界会算错——流量按本地日切分，时区错了统计就偏。
2. **一定要挂数据卷**。数据库与主题都在 `/data`，不挂卷则容器重建后数据全丢。

## 镜像来源

镜像不自己从源码构建，而是装 release 流水线已经产出的 musl 二进制（同一份 CI 实际发布的字节，避免与手工构建漂移）。要手工构建，把 `monitor-hub-amd64` / `monitor-hub-arm64` 放在 `Dockerfile` 旁边即可。

## 原文链接

- 镜像构建与数据目录：[`CarlJia/monitor` Dockerfile](https://github.com/CarlJia/monitor/blob/main/Dockerfile)
