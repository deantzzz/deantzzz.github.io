# deantzzz 的博客

未来极客风中文个人博客，使用 Astro、Markdown 与 GitHub Pages。源码仓库和网站均公开。深空背景、悬浮轨道核心与青紫光场组成首页；文章、标签、归档、关于和 RSS 均支持静态发布。

网站地址：https://deantzzz.github.io/

## 光场与交互

- 移动指针：粒子连线、追光和轨道视差。
- 点击轨道核心或聚焦后按回车：释放光波。
- **极光 / 余烬**：切换青紫或琥珀光场，配色保留到下次访问。
- **暂停动效 / 继续动效**：控制持续动画；自动遵循系统的减少动态效果设置。
- 右上角搜索，或 **⌘ K / Ctrl K**：按标题、摘要、标签搜索真实文章；回车打开，Esc 返回。

手机端使用独立的纵向构图与较少粒子。光场离开视口或标签页隐藏时停止绘制，图片通过 Astro 生成适配尺寸的 WebP。文章正文保持独立的阅读宽度。

## 本地预览

需要 Node.js 22.12 或更新版本，推荐 Node.js 24。

```bash
npm ci
npm run dev
```

打开终端显示的本地地址。生产构建验证：

```bash
npm run check
npm run build
npm run preview
```

## 写一篇文章

在 `src/content/posts/` 新建 Markdown 文件，或运行：

```bash
npm run new:post -- my-first-post "我的第一篇文章"
```

生成的文章默认是草稿。格式如下：

```markdown
---
title: "我的第一篇文章"
description: "一句简短摘要。"
publishedAt: "2026-10-11T09:00:00+08:00"
tags: ["技术", "随笔"]
draft: false
---

在这里写正文，支持 Markdown、图片、列表、表格和代码块。
```

- `draft: true` 的文章不会出现在生产构建、RSS、标签页或站点地图中。
- 仓库为 Public，提交到仓库的草稿也可以被他人阅读；尚未准备公开的草稿请留在本地。
- 日期晚于构建时刻的文章不会发布；到时间后需要再次触发构建。
- 文件名是文章地址的一部分，建议发布后保持不变。
- 本地图片放在文章旁边，用相对路径引用；构建时会自动处理。

完成后，把改动提交到 `main`，GitHub Actions 会自动检查、构建并发布到 GitHub Pages。

也可以直接在 GitHub 网页的 `src/content/posts/` 目录选择 Add file → Create new file，新建 `.md` 文件并提交到 `main`。网站会自动更新，不需要在本地运行开发环境或在聊天中单独请求发布。

## 调整博客

- 名称、介绍、GitHub 链接：`src/config.ts`
- 关于页：`src/pages/about.astro`
- 配色、字体与间距：`src/styles/global.css`
- 博客 URL：`astro.config.mjs`、`src/config.ts` 与 `public/robots.txt`
- 交互逻辑：`src/scripts/experience.ts`
- 轨道与背景：`src/assets/orbital-core.png`、`src/assets/deep-space.png`（由 OpenAI Image Gen 根据本博客概念图分别生成，界面文字和控件由代码实现）

## 托管与后续发布

网站由 GitHub Pages 免费托管，仓库 `deantzzz/deantzzz.github.io` 为 Public。Settings → Pages 的 Source 使用 **GitHub Actions**。

工作流在 `.github/workflows/deploy.yml`，使用 Astro 官方 action 自动安装依赖、检查、构建并上传生产文件，再通过 GitHub 的部署 action 发布网站。不需要添加个人访问令牌。`package-lock.json` 固定构建依赖。

拉取请求和开发分支使用 `.github/workflows/check.yml` 检查和构建。只有提交到 `main` 或手动运行部署工作流会更新网站。

在仓库的 Actions 页面可以查看发布进度。构建或检查失败时不会发布该次修改；修复后再次提交即可。

官方参考：[Astro 的 GitHub Pages 部署指南](https://docs.astro.build/en/guides/deploy/github/)、[GitHub Pages 创建站点指南](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
