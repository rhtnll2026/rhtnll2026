---
title: "让静态博客支持双语——一个插件都不用"
description: "这个网站如何靠几行 CSS、一点 JavaScript 和一些 Liquid 小技巧在中英文之间切换，以及过程中学到的东西。"
date: 2026-10-22 07:00:00 +0000
ref: bilingual-static-blog
tags: [jekyll, i18n, css, guide]
---

这个博客的角落里有一个小小的 **中文 / EN** 按钮。点一下，整个网站就会切换语言：
导航、日期、阅读时长，甚至首页上显示哪些文章都会跟着变。没有服务器，没有翻译插件，
除了原生 Jekyll 之外也没有任何构建魔法。下面说说它是怎么做到的。

## 我想要什么

动手写代码之前，我先列出了“双语”到底应该意味着什么：

1. **点一下**就能切换所有界面文字，并且网站会**记住**这个选择。
2. 第一次访问的读者看到的是**浏览器的语言**。
3. 文章可以有**译文**，但不强制。
4. 读者只会看到**每篇文章一次**，用他们选择的语言——而不是两个版本并排出现。
5. 它必须仍然是部署在免费 GitHub Pages 上的**静态网站**。

最后一条排除了任何需要服务器来判断语言的方案。所有事情要么在构建时决定，要么在浏览器里决定。

## 技巧一：两种语言都渲染，只显示一种

最简单的想法最后被证明是最好的。每一段界面文字都渲染**两遍**——每种语言一遍——
然后用 CSS 隐藏没选中的那一种：

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

这样切换语言只需要改 `<html>` 上的一个属性。不用重新渲染，不用请求数据，也不会闪烁。
而且因为选择器写的是 `:not([data-ui-lang="zh"])`，即使关闭了 JavaScript，页面也会回退到英文。

所有文字都放在一个数据文件里，模板因此保持清爽：

```yaml
# _data/i18n.yml
nav_archive: { en: "Archive", zh: "归档" }
read_post:   { en: "Read post →", zh: "阅读全文 →" }
```

## 技巧二：在页面绘制之前决定语言

如果语言是在页面渲染*之后*才设置的，读者会先看到一闪而过的错误语言。
所以 `<head>` 里放了一小段内联脚本，在任何内容绘制之前运行：

```js
var lang = localStorage.getItem("lang");
if (lang !== "en" && lang !== "zh") {
  var first = (navigator.languages || [navigator.language])[0] || "";
  lang = /^zh/i.test(first) ? "zh" : "en";
}
document.documentElement.dataset.uiLang = lang;
```

保存过的选择优先；否则由浏览器的首选语言决定。

## 技巧三：用共同的 `ref` 关联译文

文章默认是英文。中文版放在 `_posts/zh/` 里，并和对应的英文版共用一个 `ref`：

```yaml
---
title: "让静态博客支持双语"
ref: bilingual-static-blog
---
```

通过 front matter 默认值，这个文件夹里的所有文章都会自动获得 `lang: zh` 和 `/zh/` 开头的地址，
所以写译文就是“同样的文件名，换个文件夹”。

在文章页面上，语言按钮知道译文的地址。点击它会保存新的语言偏好，**并且**跳转过去。
如果文章没有译文，按钮只切换界面，同时会有一条小提示说明这篇文章只有另一种语言的版本。

## 技巧四：每篇文章只显示一次

这是最费心思的部分。规则本身很简单：

> **有**译文的文章，只在它自己的语言下显示。
> **没有**译文的文章对所有人可见，并标注它的语言。

在 Liquid 里，一个小小的 include 负责算出一篇文章应该在哪种语言下隐藏：

{% raw %}
```liquid
{%- assign versions = site.posts | where: "ref", include.post.ref -%}
{%- if versions.size > 1 -%}
  {%- if include.post.lang == "zh" -%}hide-en{%- else -%}hide-zh{%- endif -%}
{%- endif -%}
```
{% endraw %}

这个 class 加在每张文章卡片上，再用和前面一样的 CSS 方法把它隐藏。
首页顶部的“精选”文章是*每种语言*下可见的最新一篇，所以会分别算两次，显示对应的那一篇。

## 那些很重要的小细节

- **阅读时长。** Jekyll 的 `number_of_words: "auto"` 会把每个汉字算作一个词。
  中文按字计算的阅读速度也更快，所以我用大约 400 而不是 220 来除。
- **标点。** 在大号标题里，`，`、`、` 这样的全角标点会留下很大的空隙。
  字体特性 `font-feature-settings: "palt"` 可以把它们收紧。
- **字间距。** 让英文标题显得利落的轻微负字距，放在中文上会显得拥挤，所以中文文字的字距重置为零。
- **SEO。** 每篇有译文的文章都会带上指向两个版本的 `<link rel="alternate" hreflang="…">` 标签，
  让搜索引擎知道它们是一对。

## 值得吗？

整个功能大约是 40 行 JavaScript、二十来行 CSS，再加几个小小的 Liquid include。
没有插件，除了 GitHub Pages 本来就会跑的构建之外，也没有任何额外步骤。
而写一篇译文，简单到只需把文件复制到另一个文件夹。

如果你也想在自己的 Jekyll 网站上这么做，完整源码就在这个博客的
[GitHub 仓库](https://github.com/rhtnll2026/rhtnll2026.github.io)里。
