---
title: Monitor 文档站（二开版）- Plan
type: feat
date: 2026-09-18
topic: monitor-docs
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-brainstorm
execution: code
---

## Goal Capsule

- **Objective**: 中文读者访问 `https://carljia.github.io/monitor-docs/` 即可读完本项目（作者自己的 fork）的安装、部署、架构、运维与插件开发文档；站内所有指向项目的链接都指向 `CarlJia/*` 下的仓库，原项目署名按 MIT 保留。
- **Means**: 在 `CarlJia/monitor-docs` 新建独立仓库，Astro + Starlight 全新设计（不复用既有 `monitor-document` 的代码或结构），`astro build` 产物经 GitHub Actions 发布到 GitHub Pages 项目页。
- **Product Authority**: 用户授权新建仓库与 CI；内容权威来源与链接目标统一为 `CarlJia/monitor`、`CarlJia/agent`、`CarlJia/monitor-theme-gymin`，不是上游 `monitor-probe/*`。
- **Open Blockers**: 无。

---

## Product Contract

### Summary

新建独立中文文档站，服务作者本人的 monitor fork。站点按**读者任务**组织（认识 → 安装部署 → 运维 → 扩展开发 → 参考），插件开发是独立板块共 7 页，因为 WASM 插件系统是这份 fork 相对上游的独有增量。深色 / 浅色可切换，浅色为默认，全站中文，GitHub Pages 项目页发布。

### Problem Frame

本项目是上游 monitor 的二开：`monitor/`、`agent/`、`monitor-theme-gymin/` 三个仓都在作者名下维护，相对上游已经有实质增量——WASM 插件系统（ABI v2、面板页面协议、资源限制、上传生命周期）。

上游没有任何可用的文档承载体：`monitor-probe/monitor` 的 README 只有 20 行（特性与组成两节），既没有安装章节也没有插件章节。作者的 fork README 有 360 行，其中 300 余行是插件文档，但 README 不是文档站的形态——没有导航、没有搜索、没有分页加载。

既有的 `monitor-probe/monitor-document` 文档的是上游版本：全站 0 处插件文档，且把 Telegram / Webhook 通知当作宿主内置配置来讲，而 fork 已经把这套拆成了 WASM 插件。它不能承载这份 fork 的文档。

因此需要一份新的文档站，内容源是三个 fork 仓，结构按读者要完成的事来组织。

### Key Decisions

- **二开定位：文档站服务作者自己的 fork，链接指向作者自己的仓库**（session-settled: user-directed）。理由：fork 相对上游已有实质增量，上游文档不覆盖；链接指向别处会让读者装错版本。
- **全新设计，不复用既有 `monitor-document`**（session-settled: user-directed）。理由：用户明确要求新设计；复用会把上游版本的内容惯性带进来。
- **技术栈 Astro + Starlight**（session-settled: user-directed — chose over VitePress / Docusaurus / 复用 monitor-document 的 Vite+React）。理由：Markdown 原生、内置搜索与暗色切换、GitHub Pages 零配置；与"全新设计、不复用"的决定一致。Governs R9, R12, R14.
- **IA 按读者任务分组，插件独立成板块**（session-settled: user-approved）。理由：源仓库 README 的章节结构是给"在该仓开发的人"看的，不是给"要装和要运维的人"看的。Governs R1, R6.
- **覆盖 fork 全栈，含 agent 与 theme**（session-settled: user-approved — 沿用早先"全覆盖"选择）。理由：三个仓都是作者在维护，读者在同一条路径上会用到。Governs R1.
- **文档描述 fork 当前 main 的形态，不挂版本号**。理由：插件系统尚未发布为 tag，挂一个不存在的版本号会误导。待 fork 首次发布后再引入版本切换。

### Information Architecture

五个侧边栏分组，共 22 页。

**首页**

| 路径 | 一句话定位 |
|---|---|
| `/` | Hero：项目定位一句话 + 三入口 CTA（安装 Hub / 接入 Agent / 插件开发）+ 一段架构概览 |

**认识**

| 路径 | 一句话定位 |
|---|---|
| `/start/what-is` | 这是什么：定位、三部分组成、与上游项目的关系（含二开说明与署名） |
| `/start/architecture` | 架构总览：agent → hub → theme 拓扑、WebSocket / JSON-RPC 协议、数据流 |

**安装部署**

| 路径 | 一句话定位 |
|---|---|
| `/install/hub` | 安装 Hub：一键脚本（参数、目录结构、一次性密码）、不走脚本时的命令行 |
| `/install/reverse-proxy` | 反向代理：caddy / nginx / CF 隧道三份可抄的配置 + 四个注意点 |
| `/install/agent` | 接入 Agent：单台安装、批量注册、换发 token、卸载 |
| `/install/docker` | Docker 部署：镜像来源、`TZ` 时区、数据卷 |
| `/install/lifecycle` | 升级 / 卸载 / 数据迁移 |

**运维**

| 路径 | 一句话定位 |
|---|---|
| `/operate/auth` | 登录与安全：应急密码、改密、登录不通时的排查路径 |
| `/operate/notify` | 通知：宿主事件（掉线 / 恢复）与插件发出的事件，以及它们怎么送到人 |
| `/operate/themes` | 主题安装与切换 |

**扩展开发**（主体）

| 路径 | 一句话定位 |
|---|---|
| `/extend/plugins` | 插件系统总览：为什么有插件、沙箱模型、能做什么、从哪开始 |
| `/extend/plugin-manifest` | `plugin.toml`：字段与校验规则表 |
| `/extend/plugin-abi` | ABI v2 契约：导出契约、宿主函数表、错误码表 |
| `/extend/plugin-panel` | 面板页面协议：返回的 JSON 描述、表单字段规则 |
| `/extend/plugin-limits` | 资源限制：fuel / 墙钟 / kv / plugin_data / http 响应 / 上传包 |
| `/extend/plugin-lifecycle` | 上传与生命周期：打包 → 上传 → 升级 → 启用 → 测试 → 页面 → 清理 → 日志 |
| `/extend/plugin-caveats` | 已知约束：不自动禁用、不做签名校验、无重试语义、财务字段迁移 |
| `/extend/theme-dev` | 主题开发：`theme.json`、主题契约（4 个同源接口）、本地开发与打包 |

**参考**

| 路径 | 一句话定位 |
|---|---|
| `/reference/faq` | 常见问题：装不上、连不上、数字对不上 |
| `/reference/changelog` | 更新日志 |

### Requirements

**信息架构**

- R1. 站点按上表五个分组、22 页组织；侧边栏分组顺序为 认识 / 安装部署 / 运维 / 扩展开发 / 参考。
- R2. 每个页面在导航中有唯一定位与一句话描述。

**二开与署名**

- R3. 站内所有指向本项目的仓库链接指向 `CarlJia/monitor`、`CarlJia/agent`、`CarlJia/monitor-theme-gymin`，不指向 `monitor-probe/*`。
- R4. 保留原项目的 MIT 许可与作者署名。
- R5. `/start/what-is` 明确说明本站与上游项目的关系。

**内容**

- R6. 插件开发为独立板块共 7 页，内容以 `monitor/README.md` 的插件章节为权威来源。
- R7. 每个源自源仓库的页面末尾提供"原文链接"，指向对应仓库的源文件。
- R8. 代码块支持一键复制并标注语言。

**视觉与交互**

- R9. 浅色为默认主题，支持切换到暗色。
- R10. 首页为定制 Hero，含三个入口按钮。
- R11. 全站中文。

**发现与导航**

- R12. 内置搜索，覆盖所有页面正文。

**部署**

- R13. 站点为纯静态，不引入服务端逻辑、数据库或 API 路由。
- R14. 通过持续集成自动发布到 GitHub Pages 项目页；推送 main 分支后读者可看到更新。

### Scope Boundaries

**Deferred for later**

- 版本切换器（等 fork 首次发 tag 后引入）；中英双语；评论系统；自定义分析。
- 站点内的插件市场 / 插件目录页（插件清单目前只有两个参考实现）。

**Outside this product's identity**

- 服务端搜索（Pagefind 是构建期静态索引，符合纯静态约束）；用户登录。
- 主题包与插件本身的开发（那是各自仓库的事，本站只记录"是什么 / 怎么用 / 怎么写自己的"）。
- 上游 `monitor-probe/monitor-document` 的处置——本站是独立新站，不接管、不迁移、不改动它。

### Sources / Research

- `../monitor/README.md` — hub 文档权威来源；插件章节（约 300 行）是 7 个插件页的底本。
- `../monitor/install-hub.sh` — Hub 安装、菜单、参数与 `proxy_configs()` 三份反代片段；**Hub 安装页与反向代理页的权威来源是它，不是 README**（README 没有安装章节）。
- `../monitor/install.sh` — Agent 安装脚本的参数语义。
- `../monitor/CHANGELOG.md` — 更新日志来源。
- `../monitor/Dockerfile` — Docker 部署页来源。
- `../agent/README.md` — agent 文档来源（上报字段、安装、运行）；该仓**没有** CHANGELOG。
- `../monitor-theme-gymin/README.md` 与 `../monitor-theme-gymin/CHANGELOG.md` — 主题开发与主题变更来源。

---

## Planning Contract

### Key Technical Decisions

- KTD1. 使用 Astro + Starlight 当前稳定版（`astro@7` / `@astrojs/starlight@0.42` 一档），**不**钉旧的 `^5.0.0` / `^0.30.0`。理由：`npm create astro@latest` 生成的模板面向当前大版本，手工降级会造成"新模板 + 旧运行时"的未校验组合。Governs R14.
- KTD2. i18n 用 **root locale**：`locales: { root: { label: '简体中文', lang: 'zh-CN' } }, defaultLocale: 'root'`。理由：`defaultLocale` 必须存在于 `locales` 中；写成非 root 的 key 会让 `astro build` 直接报错退出，或产生指向从未生成的 `/zh-CN` 目录的静默死链。Governs R11.
- KTD3. 部署走 `withastro/action@v6`（build）+ `actions/deploy-pages@v5`（deploy）。理由：官方推荐路径，构建产物目录由 action 内部处理。Governs R14.
- KTD4. 内容按页面拆分为独立文件，不做大型单文件。理由：插件板块含三张大表（宿主函数、错误码、资源限制），拆开后每页才加载得动。Governs R6.
- KTD5. 首页 Hero 的三个 CTA 链接必须带 `base` 前缀（形如 `/monitor-docs/install-hub/`）。理由：Starlight 会给侧边栏等配置的链接补 base，但 `hero.actions[].link` 原样输出；不带 base 部署到项目页后三个按钮全 404。Governs R10.
- KTD6. 不使用脚手架的示例内容，生成后直接改写为最小配置。理由：模板自带示例页（guides/reference 演示）与本站 IA 无关，留着会成为孤儿内容。Governs R1.

### Implementation Constraints

以下为必须遵守的框架行为，均已在本机实测确认。

- `npm create astro@latest -- --template starlight` **不接受 `--typescript`**；传了会被当作项目目录名，模板落到 `./--typescript/`。
- 内容集合配置在 `src/content.config.ts`（不是 Astro 4 时代的 `src/content/config.ts`）。
- Starlight 首屏主题**跟随系统 `prefers-color-scheme`**，没有"默认主题"配置项；要满足 R9 需通过 `head` 注入脚本，在 `localStorage` 无值时固定 `data-theme` 为 `light`。
- "编辑此页"链接由 Starlight 渲染在**页脚**（不是右上角），且随 zh-CN 本地化为中文文案；验收时应断言 `href` 而非英文字面串。
- `base` 会改变本地预览路径：开发服务器地址是 `http://localhost:4321/monitor-docs/`。
- Pagefind 对中文不做分词（构建日志会提示不跨词根匹配），R12 的可搜索性成立但检索粒度受限。

### Assumptions

- 链接指向的命名空间在实施前确定（Open Questions 第 1 条）；实施期间一律用该命名空间。
- 仓库建在 `CarlJia` 账号下（`CarlJia/monitor-docs`），与三个 fork 仓同命名空间。
- 文档站在 fork 首次发布 tag 前不引入版本切换器。
- 首页 Hero 文案与品牌色在实施期间确定。

---

## Implementation Units

### U1. Bootstrap 仓库与 Starlight 配置

- **Goal**: 建 `CarlJia/monitor-docs` 仓库，搭起 Astro + Starlight 骨架，首次构建通过。
- **Requirements**: R9, R11, R13
- **Dependencies**: 无
- **Files**: `.gitignore`、`package.json`、`package-lock.json`、`astro.config.mjs`、`tsconfig.json`、`src/content.config.ts`、`src/styles/custom.css`、`README.md`
- **Approach**:
  1. `git init`，用 `npm create astro@latest -- --template starlight --no-install --no-git --yes .` 生成模板（**不传** `--typescript`）。
  2. 删除模板自带示例内容与示例数据脚本，只保留最小骨架。
  3. 写 `astro.config.mjs`：`site: 'https://carljia.github.io'`、`base: '/monitor-docs'`、starlight（title / description / locales per KTD2 / social 指向 `CarlJia/monitor-docs` / editLink 指向 `https://github.com/CarlJia/monitor-docs/edit/main/` / customCss）。
  4. 按 Implementation Constraints 注入首屏浅色脚本（R9）。
  5. `npm install` 并提交锁文件；`npm run build` 通过。
- **Test scenarios**:
  - `npm install` 与 `npm run build` 退出码 0；`dist/index.html` 存在。
  - `dist/index.html` 顶层 `<html>` 含 `lang="zh-CN"`（Covers R11 / KTD2）。
  - 系统偏好为深色时首屏仍为浅色（Covers R9）。
  - `dist/` 下无模板示例页残留（Covers KTD6）。
- **Verification**: 构建通过；语言属性正确；浅色默认生效；示例内容已清空。

### U2. 首页 Hero

- **Goal**: 实现 R10 的 Hero。
- **Requirements**: R10
- **Dependencies**: U1、U3、U4（CTA 目标页需存在）
- **Files**: `src/content/docs/index.md`、`src/styles/custom.css`
- **Approach**: 写 splash 模板 frontmatter：`title` 为站点名，`tagline` 用已定文案「monitor 二开版：自托管监控 + WASM 插件系统。」，`actions` 三项（链接带 base per KTD5）；正文写一段架构概览，指向 `/start/architecture`；`custom.css` 覆盖强调色 token 为 `#2563eb`（暗色下用高亮变体），并在浅色、暗色下各验一次对比度。
- **Test scenarios**:
  - 首页渲染三个按钮，链接分别指向 `/monitor-docs/install-hub/`、`/monitor-docs/install-agent/`、`/monitor-docs/extend/plugins/`（Covers R10 / KTD5）。
  - 三个链接均返回 200。
  - 375px 视口下三按钮可读可点。
- **Verification**: Hero 与三个 CTA 就位；链接无 404。

### U3. 认识 + 安装部署内容

- **Goal**: 写 `/start/*` 与 `/install/*` 共 7 页。
- **Requirements**: R1, R2, R5, R7, R8
- **Dependencies**: U1
- **Files**: `src/content/docs/start/what-is.md`、`start/architecture.md`、`install/hub.md`、`install/reverse-proxy.md`、`install/agent.md`、`install/docker.md`、`install/lifecycle.md`
- **Approach**:
  1. `what-is.md` 按 R5 写明与上游的关系、署名。
  2. `architecture.md` 从 `../monitor/README.md` 的组成段取拓扑，附 mermaid 图；**需先接入 mermaid 渲染**（Starlight 默认把 ` ```mermaid ` 当普通代码块输出源码）。
  3. `hub.md` 与 `reverse-proxy.md` 的权威来源是 `../monitor/install-hub.sh`（README 无安装章节，见 Sources）。
  4. `agent.md` 来源 `../agent/README.md` + `../monitor/install.sh`；`docker.md` 来源 `../monitor/Dockerfile`；`lifecycle.md` 来源脚本的卸载 / 升级段与 `CHANGELOG.md`。
  5. 每页末尾按 R7 加"原文链接"；代码块标语言（R8）。
- **Test scenarios**:
  - 7 个文件均写入；每页末尾含原文链接（Covers R7）。
  - `hub.md` / `reverse-proxy.md` 的原文链接指向 `install-hub.sh`，不是 README。
  - `architecture.md` 渲染出图而非 mermaid 源码。
  - `npm run build` 退出码 0；7 页均出现在 `dist/`（Covers R1 / R2）。
- **Verification**: 内容就位；原文链接指向正确；mermaid 渲染成图。

### U4. 运维 + 扩展开发内容

- **Goal**: 写 `/operate/*` 3 页与 `/extend/*` 8 页，共 11 页；插件 7 页是主体。
- **Requirements**: R1, R2, R6, R7, R8
- **Dependencies**: U1
- **Files**: `src/content/docs/operate/{auth,notify,themes}.md`、`src/content/docs/extend/{plugins,plugin-manifest,plugin-abi,plugin-panel,plugin-limits,plugin-lifecycle,plugin-caveats,theme-dev}.md`
- **Approach**:
  1. 插件 7 页从 `../monitor/README.md` 插件章节拆出；三张大表（宿主函数、错误码、资源限制）逐字保留，不改写字段名与数值。
  2. `operate/notify.md` 需按 fork 的实际形态写：通知由插件驱动，不是宿主内置配置。
  3. `extend/theme-dev.md` 来源 `../monitor-theme-gymin/README.md`。
  4. 每页末尾按 R7 加原文链接；表格与代码块带语言标签。
- **Test scenarios**:
  - 11 个文件均写入；每页末尾含原文链接（Covers R7）。
  - `plugin-abi.md` 的错误码 `-1`..`-9` 与来源逐字一致；`plugin-limits.md` 的 fuel / 墙钟 / kv 数值逐字一致。
  - `operate/notify.md` 不出现"在设置里配置 Telegram"这类上游形态的描述。
  - `npm run build` 退出码 0；11 页均出现在 `dist/`（Covers R6）。
- **Verification**: 插件板块 7 页齐备；表格与源一致；通知页与 fork 形态相符。

### U5. 参考内容与导航收尾

- **Goal**: 写 `/reference/*` 2 页，配好侧边栏五组的顺序与描述。
- **Requirements**: R1, R2, R12
- **Dependencies**: U1、U3、U4
- **Files**: `src/content/docs/reference/{faq,changelog}.md`、`astro.config.mjs`（sidebar）
- **Approach**: FAQ 从常见故障与 `CHANGELOG.md` 的破坏性变更提炼；changelog 初始收录 `../monitor/CHANGELOG.md` 与 `../monitor-theme-gymin/CHANGELOG.md` 的近期版本（agent 仓无 CHANGELOG）。侧边栏用显式配置（非目录自动聚合），顺序按 R1，才能满足 R2。
- **Test scenarios**:
  - 侧边栏五组顺序与 R1 一致，组内页面顺序与 IA 表一致（Covers R1 / R2）。
  - `dist/` 下存在 Pagefind 索引目录（Covers R12）。
  - `npm run build` 退出码 0。
- **Verification**: 侧边栏顺序正确；搜索索引生成。

### U6. GitHub Actions 部署

- **Goal**: 配置 CI 在 push main 时构建并发布到 GitHub Pages 项目页。
- **Requirements**: R13, R14
- **Dependencies**: U1（有可构建的骨架即可，不必等内容写完）
- **Files**: `.github/workflows/deploy.yml`、`README.md`
- **Approach**: `on.push.branches: [main]` + `workflow_dispatch`；`concurrency` 防并发；build job 用 `withastro/action@v6`（KTD3），deploy job 用 `actions/deploy-pages@v5`；README 记录一次性设置（Settings → Pages → Source = GitHub Actions）。
- **Test scenarios**:
  - workflow YAML 合法。
  - 一次 `workflow_dispatch` 后线上 URL 返回 200（可在 U1 完成后先跑通最小页）。
  - 合并一个改动到 main 后线上在数分钟内更新。
  - workflow 不含任何外部 API key 或数据库连接（Covers R13）。
- **Verification**: 首次部署成功；线上可访问；push 触发更新。

### U7. 上游指向改写

- **Goal**: 把三个 fork 仓内仍指向上游的地方改为指向 `CarlJia/*`。
- **Requirements**: R3
- **Dependencies**: 无（独立于文档站仓库）
- **Files**: `../monitor/Dockerfile`、`../agent/README.md`、`../monitor-theme-gymin/README.md`
- **Approach**: 逐个文件核对照 `monitor-probe/*` 的 URL，替换为 `CarlJia/*`；`LICENSE` 的署名按 R4 保留不动；`../monitor/install-hub.sh` 的 `REPO` 已是 `CarlJia/monitor`，无需改。
- **Test scenarios**:
  - `grep -rn 'monitor-probe/' ../monitor ../agent ../monitor-theme-gymin --include='*.md' --include='Dockerfile'` 的命中均为有意保留（如署名、上游致谢），无遗留的功能性链接。
  - 三个仓的 `LICENSE` 未被改动（Covers R4）。
- **Verification**: 功能性链接全部指向作者仓库；署名保留。

---

## Verification Contract

**构建**（U1–U5）

- `npm install` 与 `npm run build` 退出码 0；产出 `dist/index.html`
- `dist/index.html` 顶层 `<html>` 含 `lang="zh-CN"`
- 无模板示例页残留

**内容**（U3–U5）

- 所有源自源仓库的页面末尾含"原文链接"段
- 所有代码块带语言标签
- 插件页的三张大表与源文件逐字一致

**二开一致性**（全局）

- 构建产物中不出现指向 `monitor-probe/monitor`、`monitor-probe/agent`、`monitor-probe/monitor-theme-gymin` 的功能性链接
- `LICENSE` 与署名保留

**部署**（U6）

- workflow YAML 合法；一次 `workflow_dispatch` 成功
- 线上 URL 可访问；push main 后数分钟内更新

## Definition of Done

**Global**

- 6 个文档站单元 + U7 全部完成并通过各自 Verification
- 公开 URL 可访问，返回 U2 实现的 Hero
- 22 页全部可达，侧边栏顺序与 IA 一致
- 站内无指向上游仓库的功能性链接

**Cleanup**

- 无模板示例文件、无实验性配置残留
- `package-lock.json` 已提交；`node_modules/` 未提交

## Open Questions

**Deferred to Planning**

- `/install/docker` 是否需要 compose 示例（当前仓库只有 `Dockerfile`，无 compose 文件）。
