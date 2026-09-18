---
title: 反向代理
description: nginx、caddy、Cloudflare 隧道三份可直接抄的配置，外加四个注意点。
---

hub 只监听 `127.0.0.1`，公网访问不到。用 nginx / caddy / Cloudflare 隧道任选一种，把域名指过来。把 `hub.example.com` 换成你的域名，`28080` 换成你的端口。

## caddy

```caddy
hub.example.com {
    reverse_proxy 127.0.0.1:28080
}
```

## nginx

```nginx
map $http_upgrade $connection_upgrade { default upgrade; '' close; }

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name hub.example.com;
    ssl_certificate     /etc/letsencrypt/live/hub.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hub.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:28080;
        proxy_http_version 1.1;
        # 导入备份与上传主题是分片传的，单片 4 MiB；这个数不随数据库增长。
        client_max_body_size 8m;
        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        # /api/agent/ws 与 /api/ws 是长连接。
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_buffering off;
        proxy_read_timeout 1h;
        proxy_send_timeout 1h;
    }
}
```

## Cloudflare 隧道

不用开任何入站端口：

```yaml
ingress:
  - hostname: hub.example.com
    service: http://127.0.0.1:28080
  - service: http_status:404
```

## 四个注意点

1. **WebSocket 要放行**：`/api/agent/ws`（agent 上报）与 `/api/ws`（面板实时推送）是长连接，反代要转发 `Upgrade` / `Connection` 头并放宽读写超时。
2. **传大 body 的上限**：导入备份、上传主题是分片传的，单片 4 MiB，`client_max_body_size` 给到 8m 够用，且不随数据库增长。
3. **转发协议头**：面板拼 agent 安装命令用浏览器地址；反代要发 `X-Forwarded-Proto`，否则拼出来的是 http。不发就得在 hub 上显式 `--site`。
4. **转发真实来源**：`X-Forwarded-For` 影响节点地址与国家码的判定。

## 原文链接

- 三份配置由安装脚本的 `proxy_configs()` 生成：[`CarlJia/monitor` install-hub.sh](https://github.com/CarlJia/monitor/blob/main/install-hub.sh)
