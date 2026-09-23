---
name: gc987-clone
description: >-
  Boot gc987 local+live Chrome tabs and clone or update Vue routes/modals
  against gc987.com. Use only for the gc987 prompt set (开机, 打开987本地和线上,
  更新路由, 更新弹窗, or a clone whose target is gc987.com). Do not use when the
  user has scoped the conversation to another site folder such as brjornal.com.
---

# gc987 本地对照 + 克隆

覆盖全局 `clone-website` 里所有 Next.js / shadcn / Tailwind / worktree 默认。
用户只要说短口令；不要再向用户要那份长提示词。短口令见 [prompts.md](prompts.md)。

源站：`https://gc987.com`
本地：`http://localhost:5987`（Vite `strictPort`，端口不可改）
仓库：当前 app-root，禁止另起工程。

## 什么时候不要用本技能

用户点名了别的站点目录（例如 `brjornal.com/`）时，不要读本技能，不要改 gc987。那些目录的规则在 `.cursor/rules/site-folder.mdc`。

只有用户改用 987 口令（开机、打开 987 本地和线上、更新路由、更新弹窗，或克隆目标是 gc987.com）时才执行下面的流程。执行时不要改仓库根目录下的站点目录。

## 何时跑哪段

| 用户说法 | 流程 |
|---|---|
| 开机 / 打开本地和线上 / 运行项目 / 上次做到哪 | **开机**；若还要求继续干活，开完再做 |
| 更新路由 `/path` | **更新**（已有页） |
| 更新弹窗「某层」 | **更新**（覆盖层，默认不新建路由） |
| 克隆 / 目标 URL / 从某入口点进去 | **克隆**（先判断覆盖层 vs 新路由） |

更新/克隆前若本地 dev 或 Chrome 双页没就绪，先跑开机。

---

## 流程 A：开机

1. 看 terminals：已有 `npm run dev` 且 5987 在听就复用，不要再开一份。
2. 否则在仓库根目录 `npm run dev`（后台）。
3. 只用 Chrome DevTools MCP（`user-chrome-devtools`）。先 `GetDynamicTools`，再 `CallDynamicTool`。不要用 `cursor-ide-browser` 顶替；工具不可用就停下来说明。
4. `list_pages`。需要 **两个标签**：
   - 本地：`http://localhost:5987/main/inicio`（可按用户指定改路径）
   - 线上：`https://gc987.com/main/inicio`
   已有同 origin 标签就 `select_page` + `navigate_page`；没有就 `new_page`。
5. 两个标签都 `emulate`：`390x844x3,mobile,touch`。
6. `wait_for` 或等到 `.ion-page`。线上若跳登录：**停下等用户在这个 Chrome 里登录**。不要注册、不要绕登录。Compulsory PWA 挡住入口就先关掉再继续。
7. 简短汇报两个 URL 已打开、dev 端口、线上是否已登录。不要一开机就改代码，除非用户同时给了更新/克隆任务。

---

## 流程 B：更新已有路由或弹窗

用户典型输入：

```
更新路由 /main/entrar
1. 输入框提示词太大了
2. 桌面端左右边距不对
```

或：

```
更新弹窗 首页登录弹窗
1. 国旗位置偏下
```

执行：

1. 读 `src/router/index.ts` 和对应 view/组件，确认改的是点名目标。
2. Chrome 双页都开到同一源站路径 / 同一弹层。主视口 **390×844×3**。用户写了「桌面端 / 取消手机模式」才加测桌面（约 1440），改桌面不得把 390 带歪。
3. 每个差异都用 `getComputedStyle` 对源站和本地同一选择器，禁止目测补 1px。
4. 只改点名的页面/弹层和它明确依赖的文件。禁止改未点名路由、已有 token 的值，禁止改仓库根目录下的站点目录（如 `brjornal.com/`）。
5. 改完在 Chrome 里把点名的交互再走一遍（含空态、禁用、hover/transition）。相关路由若共用被改状态，也要看一眼。
6. `npx vue-tsc --noEmit -p tsconfig.app.json`；整页克隆再 `npm run build`。

弹窗：pathname 没变就还是覆盖层，不要新建路由。

---

## 流程 C：克隆新页 / 新弹层

沿用 clone-website 的提取 → spec → 实现 → 对照，但全部写进本仓库 Vue SFC。

### 覆盖层 vs 新路由（先点再决定）

在源站点目标入口（按钮/图标/卡片），看 pathname：

- **变了** → 按源站规范化路径在 `src/router/index.ts` **追加**路由（catch-all 之前）。例：`/game/search/POPULAR`、`/main/withdraw`、`/withdrawSubView`。
- **没变** → 覆盖层，挂在当前页组件上，不新建路由。例：登录弹窗、资金密码 TIPS。
- 说不清 → 停下问用户。不要把新页做成弹层，也不要把弹层做成新页。

目标 pathname 已存在：先问「更新 / 换路由 / 跳过」，不要覆盖。

### 写代码前的 Output Plan（只列本页）

目标 URL、`<page-key>`、本地路由、view、组件目录、研究/截图/资源目录、将复用的组件、是否改 `tokens.css` / router。有冲突先问。

`<page-key>`：源站 pathname 可读 slug（`/main/entrar` → `main-entrar`）。覆盖层用所在页的 page-key。

### 落点（不要用 sites/site-key/page-key）

- 研究：`docs/research/gc987-com/<page-key>/`（`PAGE_TOPOLOGY.md`、`BEHAVIORS.md`、`components/*.spec.md`）
- 截图：`docs/design-references/gc987-com/<page-key>/`
- 页面：`src/views/<Area>Page.vue` 或 `src/views/perfil/<Name>Page.vue`
- 组件：`src/components/<area>/`（`inicio` | `promo` | `entrar` | `perfil` | `withdraw` | 现有子目录）
- 位图：`public/images/<area>/`
- SVG：`src/assets/icons/<name>.svg`，经 `SvgIcon` 的 `name` 引用
- 下载脚本：`scripts/download-assets-gc987-<page-key>.mjs`

### 提取（Chrome DevTools MCP）

1. `list_pages` → 选页/开页 → emulate `390x844x3,mobile,touch`
2. `navigate_page` 到源站 URL；登录墙就停；PWA 挡住就先关
3. 全页截图、snapshot、`evaluate_script` 跑资源发现和 `getComputedStyle` 树
4. 先滚后点：header/sticky/动画、每个 tab 的内容和样式、hover before/after + transition
5. `list_network_requests` 补图、字体、XHR

CSS：每个值来自 `getComputedStyle`，禁止 Tailwind 近似。同时记 live 的 rem（390 上根字号 16px）。颜色映射已有 `--ion-*` / `--theme-*` 等 token；没有再 **追加**，禁止改已有 token 值。文案用 `element.textContent` 原文。

主布局按移动站实现，不要做成桌面栅格。768/1440 做记录；用户点名桌面差异再修桌面。

### 实现（Vue，不是 React）

禁止：新建工程/worktree、Next.js/React/shadcn/Tailwind 脚手架、把「没有 Next.js 就先搭脚手架」当开工条件。

- 先写 spec，再在本仓库写 Vue SFC。复杂区块可 Task，但仍写本仓库。
- 一个组件一份 spec；prompt 大约超 150 行就拆。
- 先判定交互模型：static / click / scroll / time。
- 壳：`.ion-page` + `.page-scroller`；源站有底栏才挂 `TabBar`。
- 不引入 Ionic 运行时，用 class 复刻外观。
- 假数据进 Pinia / `src/api/mock.ts`。提交、充值、提现、绑定 **一律本地 mock**，不要打到 gc987.com。
- 能复用就不新建：`tokens.css` `fonts.css` `app-shell.css`、`SvgIcon`、`TabBar`、`AbSelect` `DropdownSelect` `DatePickerPopover`、`LoginModal` `PwaModal` `SideMenu` `AppHeader` `SideFab`、现有 store。
- 共享文件只允许 **追加** 本页需要的能力。改完确认 `/main/inicio` `/main/perfil` `/main/entrar` `/main/promo` 和登录弹窗没被带坏。

页面骨架：

```html
<div class="ion-page">
  <!-- 可选 header -->
  <div class="page-scroller ...">...</div>
  <!-- 源站有底栏才：TabBar -->
</div>
```

### 验收

1. `npx vue-tsc --noEmit -p tsconfig.app.json`；新路由再 `npm run build`
2. Chrome 源站 vs 本地，同一 390×844×3（点名了再加桌面）
3. 逐段对布局、字体、间距、颜色、文案、交互
4. 有差：重提取 → 更新 spec → 改组件，不要停在「看起来差不多」

汇报：源 URL → 本地路由；新建/复用组件；spec/截图路径；资源数量；构建结果；残留视觉差；未做项（真后台、登录墙后的子页）。
