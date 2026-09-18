// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://carljia.github.io',
  base: '/monitor-docs',
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
