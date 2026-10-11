# deantzzz 的博客

未来极客风中文个人博客，使用 Astro、Markdown 与 ChatGPT Sites。GitHub 源码仓库保持私有，网站公开阅读。深空背景、悬浮轨道核心与青紫光场组成首页；文章、标签、归档、关于和 RSS 均支持静态发布。

网站地址：https://deantzzz.lovelysage6.chatgpt.site/

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
- 日期晚于构建时刻的文章不会发布；到时间后需要再次触发构建。
- 文件名是文章地址的一部分，建议发布后保持不变。
- 本地图片放在文章旁边，用相对路径引用；构建时会自动处理。

完成后，把改动提交到 `main`，GitHub Actions 会自动检查和构建。网站部署由本聊天中的 Sites 工具执行；GitHub 提交目前不会直接更新网站。

也可以直接在 GitHub 网页的 `src/content/posts/` 目录选择 Add file → Create new file，新建 `.md` 文件并提交到 `main`。随后在本聊天说“发布博客最新文章”，即可同步源码、构建并发布。不需要每次在本地运行开发环境。

## 调整博客

- 名称、介绍、GitHub 链接：`src/config.ts`
- 关于页：`src/pages/about.astro`
- 配色、字体与间距：`src/styles/global.css`
- 博客 URL：`astro.config.mjs`、`src/config.ts` 与 `public/robots.txt`
- 交互逻辑：`src/scripts/experience.ts`
- 轨道与背景：`src/assets/orbital-core.png`、`src/assets/deep-space.png`（由 OpenAI Image Gen 根据本博客概念图分别生成，界面文字和控件由代码实现）

## 托管与后续发布

公开网站由 ChatGPT Sites 托管，使用当前账号已有的 Sites 公测额度。GitHub Pages 因当前套餐不支持私有仓库而未启用。没有将 GitHub 源码仓库公开，也不需要升级 GitHub Pro。

工作流在 `.github/workflows/check.yml`，权限限于读取源码，执行 `npm ci`、`npm run check` 与 `npm run build`。`package-lock.json` 固定构建依赖。

Sites 使用独立的托管源码副本；源文件和 Markdown 不作为静态网站文件公开。发布时只上传生产构建目录，网站不会包含草稿、环境变量或 Git 元数据。

Sites 的托管身份与部署配置保存在 `.openai/hosting.json`。后续更新必须复用其中的 `project_id`，获取新的短期源码凭据并通过 Sites 工具发布；不要重建站点或保存凭据到 Git。

官方参考：[ChatGPT Sites 使用说明](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites)、[Astro 的静态构建](https://docs.astro.build/en/guides/deploy/)。
