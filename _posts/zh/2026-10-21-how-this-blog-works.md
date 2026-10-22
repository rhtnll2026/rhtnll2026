---
title: "这个博客是怎么运作的（以及如何写一篇文章）"
description: "一个由 Markdown、Jekyll 和 GitHub Pages 驱动的免费、快速的静态博客——完整搭建过程都在这里。"
ref: how-this-blog-works
tags: [guide, jekyll, github]
---

运行这个网站不花一分钱。没有服务器、没有数据库，也没有 CMS——
只有 GitHub 仓库里的 Markdown 文件，它们会被自动转换成 HTML。

## 技术栈

| 组成部分           | 作用                                   |
| ------------------ | -------------------------------------- |
| **Markdown**       | 文章就是 `_posts/` 里的 `.md` 文件     |
| **Jekyll**         | 把 Markdown 和模板转换成静态 HTML      |
| **GitHub Actions** | 每次推送到 `main` 时自动构建网站       |
| **GitHub Pages**   | 免费托管生成的网站，并提供 HTTPS       |

## 写一篇新文章

在 `_posts/` 里新建一个文件，命名为 `YYYY-MM-DD-标题.md`，例如
`_posts/2026-11-01-my-new-post.md`，开头写一小段*front matter*：

```yaml
---
title: "My new post"
description: "One sentence that shows up on the home page and in search results."
tags: [notes, ideas]
---

Your content goes here, written in **Markdown**.
```

提交并推送到 `main`，大约一分钟后就会上线。

## 双语写作

页面顶部的 **中文 / EN** 按钮可以把整个网站在中英文之间切换。文章默认是英文；
要添加中文版本，在 `_posts/zh/` 里放一个**同名**文件，并给两个文件设置相同的 `ref`：

```yaml
---
title: "我的新文章"
description: "首页和搜索结果里显示的一句话简介。"
ref: my-new-post
tags: [notes, ideas]
---
```

这样读者只会看到自己所选语言的那一篇。只有一种语言的文章依然对所有人可见，并会标注它的语言。

## 本地预览（可选）

如果你装了 Ruby，可以在发布前先在本地预览：

```bash
bundle install
bundle exec jekyll serve --livereload
# 打开 http://localhost:4000/
```

就这些——剩下的就是写作了。
