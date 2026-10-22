# Blog guide

This repository doubles as a free static blog built with [Jekyll](https://jekyllrb.com)
and hosted on [GitHub Pages](https://pages.github.com).

**Live site:** https://rhtnll2026.github.io/rhtnll2026/

## One-time setup

1. Merge this branch into `main`.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push any commit to `main` (or re-run the *Deploy blog to GitHub Pages* workflow from the **Actions** tab).

The site will be live at `https://rhtnll2026.github.io/rhtnll2026/` within a minute or two.

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

## Customising

| What                          | Where                         |
| ----------------------------- | ----------------------------- |
| Title, tagline, description, author, links | `_config.yml`  |
| About page                    | `about.md`                    |
| Colours, fonts, spacing       | `assets/css/main.css` (tokens at the top) |
| Page structure                | `_layouts/`, `_includes/`     |
| Favicon                       | `assets/favicon.svg`          |

## Running locally

Requires Ruby 3.x.

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000/rhtnll2026/.

## Project layout

```
_config.yml            site settings
_posts/                blog posts (Markdown)
_layouts/              page templates (default, home, post, page)
_includes/             shared snippets (header, footer, cards…)
assets/css/main.css    all styles, incl. light/dark themes
assets/js/main.js      theme toggle, reading progress, copy buttons
about.md, archive.html, tags.html, 404.html
.github/workflows/pages.yml   build + deploy to GitHub Pages
```
