---
title: "Markdown style guide: everything this blog can render"
description: "A quick tour of headings, lists, quotes, tables, and syntax-highlighted code — useful as a reference when writing."
ref: markdown-style-guide
tags: [guide, markdown]
---

This post is a reference for all the formatting the blog supports. Copy
whatever you need into your own posts.

## Text

You can write **bold**, *italic*, ~~strikethrough~~, `inline code`, and
[links](https://github.com/rhtnll2026). Paragraphs are separated by a blank line.

## Lists

1. Ordered lists
2. Look like this
   - And can be nested
   - With bullets inside

- [x] Task lists work too
- [ ] Like this unchecked item

## Quotes

> Simplicity is prerequisite for reliability.
>
> — Edsger W. Dijkstra

## Code

Fenced code blocks get syntax highlighting and a copy button (hover to see it):

```python
def fibonacci(n: int) -> list[int]:
    """Return the first n Fibonacci numbers."""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]

print(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

```javascript
const greet = (name = "world") => `Hello, ${name}!`;
console.log(greet("blog"));
```

## Tables

| Shortcut     | Result         |
| ------------ | -------------- |
| `**bold**`   | **bold**       |
| `*italic*`   | *italic*       |
| `` `code` `` | `code`         |

## Images

Put images in an `assets/images/` folder and reference them like this:

{% raw %}
```markdown
![Alt text describing the image]({{ '/assets/images/photo.jpg' | relative_url }})
```
{% endraw %}

---

That's everything. Happy writing! ✍️
