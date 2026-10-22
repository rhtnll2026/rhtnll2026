---
title: "Making a static blog bilingual — without a single plugin"
description: "How this site switches between English and Chinese with a few lines of CSS, a pinch of JavaScript, and some Liquid tricks — and what I learned along the way."
date: 2026-10-22 07:00:00 +0000
ref: bilingual-static-blog
tags: [jekyll, i18n, css, guide]
---

This blog has a small **中文 / EN** button in the corner. Click it and the whole
site switches language: navigation, dates, reading times, even which posts show
up on the home page. There's no server, no translation plugin and no build-time
magic beyond plain Jekyll. Here's how it works.

## What I wanted

Before writing any code, I listed what "bilingual" should actually mean:

1. **One click** switches all interface text, and the site **remembers** the choice.
2. First-time visitors get **their browser's language**.
3. A post can have a **translation**, but doesn't have to.
4. Readers see **each post once**, in their language — not two copies side by side.
5. It has to stay a **static site** on free GitHub Pages hosting.

The last point rules out anything that needs a server to pick the language.
Everything has to be decided either at build time or in the browser.

## Trick 1: render both languages, show one

The simplest idea turned out to be the best one. Every piece of interface text is
rendered **twice** — once per language — and CSS hides the one you didn't pick:

```html
<a href="/archive/">
  <span data-l="en" lang="en">Archive</span>
  <span data-l="zh" lang="zh-CN">归档</span>
</a>
```

```css
:root:not([data-ui-lang="zh"]) [data-l="zh"],
:root[data-ui-lang="zh"] [data-l="en"] { display: none !important; }
```

Switching language is then a single attribute change on `<html>`. No re-render,
no fetching, no flicker. And because the selector is `:not([data-ui-lang="zh"])`,
the page falls back to English if JavaScript is turned off.

The strings live in one data file, so templates stay readable:

```yaml
# _data/i18n.yml
nav_archive: { en: "Archive", zh: "归档" }
read_post:   { en: "Read post →", zh: "阅读全文 →" }
```

## Trick 2: decide the language before the page paints

If the language is set *after* the page renders, readers see a flash of the wrong
language. So a tiny inline script in `<head>` runs before anything is drawn:

```js
var lang = localStorage.getItem("lang");
if (lang !== "en" && lang !== "zh") {
  var first = (navigator.languages || [navigator.language])[0] || "";
  lang = /^zh/i.test(first) ? "zh" : "en";
}
document.documentElement.dataset.uiLang = lang;
```

A saved choice wins; otherwise the browser's preferred language decides.

## Trick 3: link translations with a shared `ref`

Posts are English by default. A Chinese version goes in `_posts/zh/` and shares a
`ref` with its English twin:

```yaml
---
title: "让静态博客支持双语"
ref: bilingual-static-blog
---
```

A front-matter default gives everything in that folder `lang: zh` and a `/zh/`
URL, so writing a translation is just "same file name, different folder".

On a post, the language button knows the URL of the translation. Clicking it
saves the new preference **and** navigates there. If a post has no translation,
the button only switches the interface, and a small note explains that the post
is only available in the other language.

## Trick 4: show each post once

This was the fiddliest part. The rule is simple:

> A post that **has** a translation only shows in its own language.
> A post **without** one shows for everyone, labelled with its language.

In Liquid, a small include works out which language a post should be hidden in:

{% raw %}
```liquid
{%- assign versions = site.posts | where: "ref", include.post.ref -%}
{%- if versions.size > 1 -%}
  {%- if include.post.lang == "zh" -%}hide-en{%- else -%}hide-zh{%- endif -%}
{%- endif -%}
```
{% endraw %}

That class goes on each post card, and the same CSS approach as before hides it.
The "featured" post at the top of the home page is the newest post visible in
*each* language, so it's worked out twice and the right one is shown.

## Small details that mattered

- **Reading time.** Jekyll's `number_of_words: "auto"` counts each Chinese character
  as one word. Chinese also reads faster per character, so I divide by about 400
  instead of 220.
- **Punctuation.** Full-width punctuation like `，` and `、` leaves big gaps in large
  headings. The font feature `font-feature-settings: "palt"` tightens it up.
- **Letter spacing.** The slightly negative tracking that makes English headings look
  sharp crowds Chinese characters, so it's reset to zero for Chinese text.
- **SEO.** Each translated post gets `<link rel="alternate" hreflang="…">` tags
  pointing at both versions, so search engines know they belong together.

## Was it worth it?

The whole feature is about 40 lines of JavaScript, a couple of dozen lines of CSS and a few
small Liquid includes. No plugins, no build step beyond what GitHub Pages already
runs. And writing a translation is as easy as copying a file into another folder.

If you want to do the same on your own Jekyll site, the full source is in this
blog's [GitHub repository](https://github.com/rhtnll2026/rhtnll2026.github.io).
