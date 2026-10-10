# deantzzz 的博客

中文个人博客，使用 Astro、Markdown 与 GitHub Pages。首页、文章、标签、归档、关于、RSS 和明暗主题已经配置好。

网站地址：https://deantzzz.github.io/

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
- 日期晚于构建时刻的文章不会发布；到时间后需要再次触发构建。
- 文件名是文章地址的一部分，建议发布后保持不变。
- 本地图片放在文章旁边，用相对路径引用；构建时会自动处理。

完成后，把改动提交到 `main`，GitHub Actions 会自动检查、构建并发布。

也可以直接在 GitHub 网页的 `src/content/posts/` 目录选择 Add file → Create new file，新建 `.md` 文件并提交到 `main`。不需要每次在本地运行开发环境。

## 调整博客

- 名称、介绍、GitHub 链接：`src/config.ts`
- 关于页：`src/pages/about.astro`
- 配色、字体与间距：`src/styles/global.css`
- 博客 URL：`astro.config.mjs` 与 `src/config.ts`
- 山景图片：`src/assets/mountains.png`（由 OpenAI Image Gen 为本博客生成）

## GitHub Pages

仓库 Settings → Pages 的 Source 应为 **GitHub Actions**。

工作流在 `.github/workflows/deploy.yml`，使用 Astro 官方 action，权限限于读取源码和部署 Pages，不需要配置个人访问令牌。`package-lock.json` 固定构建依赖。

如果 Pages 因账号套餐不支持私人仓库而无法开启，需要由仓库所有者选择公开博客仓库，或使用支持私人仓库 Pages 的套餐。网站发布后的页面对互联网公开。

官方参考：[Astro 的 GitHub Pages 部署指南](https://docs.astro.build/en/guides/deploy/github/)、[GitHub Pages 创建站点指南](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
