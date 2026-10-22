# Blog guide

This repository doubles as a free static blog built with [Jekyll](https://jekyllrb.com)
and hosted on [GitHub Pages](https://pages.github.com).

**Live site:** https://rhtnll2026.github.io/

The repository must be named `rhtnll2026.github.io` for the site to be served at that
address. (Under any other name it is served at `https://rhtnll2026.github.io/<repo-name>/`;
the deploy workflow adjusts the paths automatically, so nothing breaks either way.)

## One-time setup

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push any commit to `main` (or re-run the *Deploy blog to GitHub Pages* workflow from the **Actions** tab).

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-title.md`:

```markdown
---
title: "My post title"
description: "Short summary shown on the home page and in search results."
tags: [tag-one, tag-two]
image: /assets/images/cover.jpg   # optional cover image
---

Write your post in Markdown here.
```

Push to `main` and the site rebuilds automatically. Posts with a future date are not published until that date.

## Chinese / English

The **中文 / EN** button in the header switches all site text between English and Chinese.
The reader's choice is remembered; first-time visitors get the language of their browser.

- Posts are **English** by default. Chinese posts go in **`_posts/zh/`** and are served under `/zh/`.
- To link a post with its translation, give both files the same **`ref:`** (using the same
  file name in both folders keeps things tidy). Readers then see each post once, in their
  language, and the toggle on a post jumps to its translation.
- A post written in only one language is still listed for everyone, labelled with its language.
- Interface text (nav, buttons, headings) lives in **`_data/i18n.yml`**. Pages such as
  `about.md` hold both languages in `<div data-l="en" markdown="1">` / `<div data-l="zh" markdown="1">` blocks,
  with `title_zh` / `subtitle_zh` in the front matter.

## Customising

| What                          | Where                         |
| ----------------------------- | ----------------------------- |
| Title, tagline, description, author, links | `_config.yml`  |
| About page                    | `about.md`                    |
| Interface text (both languages) | `_data/i18n.yml`            |
| Colours, fonts, spacing       | `assets/css/main.css` (tokens at the top) |
| Page structure                | `_layouts/`, `_includes/`     |
| Favicon                       | `assets/favicon.svg`          |

## Running locally

Requires Ruby 3.x.

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000/.

## Project layout

```
_config.yml            site settings
_posts/                blog posts (Markdown, English)
_posts/zh/             Chinese posts, linked to English ones by `ref`
_data/i18n.yml         interface text in English and Chinese
_layouts/              page templates (default, home, post, page)
_includes/             shared snippets (header, footer, cards…)
assets/css/main.css    all styles, incl. light/dark themes
assets/js/main.js      language + theme toggles, reading progress, copy buttons
about.md, archive.html, tags.html, 404.html
.github/workflows/pages.yml   build + deploy to GitHub Pages
```
