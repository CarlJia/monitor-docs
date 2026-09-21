---
title: 主题安装与切换
description: 把外部主题装进 hub，在后台切换。
---

hub 内置一份默认主题，也可以装外部主题。

## 装一个主题

一个可安装主题是一个目录，名字必须与 `theme.json` 的 `short` 相同：

```text
<themes-dir>/<short>/
├── theme.json
├── preview.png        # 可选，面板上的预览图
└── dist/
    └── index.html
```

把目录复制到 hub 的 `--themes` 位置（默认在 `/opt/monitor/data/themes/`），在后台「主题」页切换，**无需重启**。`theme.json` 的 `short` 取 `default` 会顶替内置那份。

每个主题 release 里的 `theme.tar.gz` 解开就是这个目录。

## 想自己写主题

主题是纯静态 SPA，只依赖 hub 的几个同源只读接口。开发方式、接口契约与打包见[主题开发](/extend/theme-dev/)。

## 原文链接

- 主题包格式与安装：[`CarlJia/monitor-theme-gymin` README](https://github.com/CarlJia/monitor-theme-gymin/blob/main/README.md)
