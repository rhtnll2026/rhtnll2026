---
title: "How this blog works (and how to write a post)"
description: "A free, fast static blog powered by Markdown, Jekyll and GitHub Pages — here's the whole setup."
ref: how-this-blog-works
tags: [guide, jekyll, github]
---

This site costs nothing to run. There's no server, no database and no CMS —
just Markdown files in a GitHub repository that get turned into HTML automatically.

## The stack

| Piece            | What it does                                   |
| ---------------- | ---------------------------------------------- |
| **Markdown**     | Posts are plain `.md` files in `_posts/`       |
| **Jekyll**       | Turns Markdown + templates into static HTML    |
| **GitHub Actions** | Builds the site on every push to `main`      |
| **GitHub Pages** | Hosts the result for free, with HTTPS          |

## Writing a new post

Create a file in `_posts/` named `YYYY-MM-DD-your-title.md`, for example
`_posts/2026-11-01-my-new-post.md`, and start it with a small block of *front matter*:

```yaml
---
title: "My new post"
description: "One sentence that shows up on the home page and in search results."
tags: [notes, ideas]
---

Your content goes here, written in **Markdown**.
```

Commit and push it to `main`. About a minute later, it's live.

## Writing in two languages

The **中文 / EN** button in the header switches the whole site between English
and Chinese. Posts are English by default; to add a Chinese version, put a file
with the **same name** in `_posts/zh/` and give both files the same `ref`:

```yaml
---
title: "我的新文章"
description: "首页和搜索结果里显示的一句话简介。"
ref: my-new-post
tags: [notes, ideas]
---
```

Readers then see each post once, in the language they picked. A post written in
only one language still shows up for everyone, labelled with its language.

## Previewing locally (optional)

If you have Ruby installed you can preview the site before publishing:

```bash
bundle install
bundle exec jekyll serve --livereload
# open http://localhost:4000/
```

That's it — the rest is just writing.
