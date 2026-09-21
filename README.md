# monitor-docs

monitor 二开版的文档站：安装、部署、架构、运维与插件开发。

基于 [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/)，纯静态，发布在 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321/
npm run build    # 产出 dist/
npm run preview
```

站点通过自定义域名 `sink.dpdns.org` 从根路径提供服务，`base` 已移除，
本地预览不带前缀。

## 部署

推送 `main` 分支即自动构建并发布，见 `.github/workflows/deploy.yml`。

**首次需要一次手动设置**：仓库 Settings → Pages → Source 选择 **GitHub Actions**。
不设这一步，workflow 会在 deploy 阶段报找不到 Pages 站点。

站点地址：https://sink.dpdns.org/

## 内容结构

页面在 `src/content/docs/`，导航与侧边栏在 `astro.config.mjs`。
每个源自上游仓库的页面末尾带"原文链接"，指向对应的源文件。

## 许可

MIT。本项目是 [monitor](https://github.com/monitor-probe/monitor) 的二开，
原项目作者署名见各源仓库的 `LICENSE`。
