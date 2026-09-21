// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://sink.dpdns.org',
  // 「设计框架」板块抽出后，旧路径静态重定向到新位置，避免已发布链接落 404。
  redirects: {
    '/start/architecture/': '/design/architecture/',
    '/extend/plugin-manifest/': '/design/plugin-manifest/',
    '/extend/plugin-abi/': '/design/plugin-abi/',
    '/extend/plugin-panel/': '/design/plugin-panel/',
    '/extend/plugin-limits/': '/design/plugin-limits/',
    '/extend/plugin-lifecycle/': '/design/plugin-lifecycle/',
    '/extend/plugin-caveats/': '/design/plugin-caveats/',
  },
  integrations: [
    starlight({
      title: 'Monitor 文档',
      description: 'monitor 二开版的安装、部署、架构与插件开发文档。',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/CarlJia/monitor-docs',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/CarlJia/monitor-docs/edit/main/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: '认识',
          items: [
            { label: '这是什么', slug: 'start/what-is' },
          ],
        },
        {
          label: '安装部署',
          items: [
            { label: '安装 Hub', slug: 'install/hub' },
            { label: '反向代理', slug: 'install/reverse-proxy' },
            { label: '接入 Agent', slug: 'install/agent' },
            { label: 'Docker 部署', slug: 'install/docker' },
            { label: '升级 / 卸载 / 迁移', slug: 'install/lifecycle' },
          ],
        },
        {
          label: '运维',
          items: [
            { label: '登录与安全', slug: 'operate/auth' },
            { label: '通知', slug: 'operate/notify' },
            { label: '主题安装与切换', slug: 'operate/themes' },
          ],
        },
        {
          label: '设计框架',
          items: [
            { label: '架构总览', slug: 'design/architecture' },
            { label: 'plugin.toml（manifest）', slug: 'design/plugin-manifest' },
            { label: 'ABI v2 契约', slug: 'design/plugin-abi' },
            { label: '面板页面协议', slug: 'design/plugin-panel' },
            { label: '资源限制', slug: 'design/plugin-limits' },
            { label: '上传与生命周期', slug: 'design/plugin-lifecycle' },
            { label: '已知约束', slug: 'design/plugin-caveats' },
          ],
        },
        {
          label: '扩展开发',
          items: [
            { label: '插件系统总览', slug: 'extend/plugins' },
            { label: '主题开发', slug: 'extend/theme-dev' },
          ],
        },
        {
          label: '参考',
          items: [
            { label: '常见问题', slug: 'reference/faq' },
            { label: '更新日志', slug: 'reference/changelog' },
          ],
        },
      ],
      head: [
        {
          tag: 'script',
          content:
            "if(!localStorage.getItem('starlight-theme'))localStorage.setItem('starlight-theme','light')",
        },
      ],
    }),
  ],
});
