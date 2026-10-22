---
title: "Markdown 样式指南：这个博客能渲染的一切"
description: "快速浏览标题、列表、引用、表格和语法高亮代码——写作时可以当作参考。"
ref: markdown-style-guide
tags: [guide, markdown]
---

这篇文章汇总了博客支持的所有格式，需要什么直接复制到你自己的文章里就行。

## 文本

你可以写**粗体**、*斜体*、~~删除线~~、`行内代码`，以及
[链接](https://github.com/rhtnll2026)。段落之间用一个空行分隔。

## 列表

1. 有序列表
2. 长这个样子
   - 还可以嵌套
   - 里面放无序列表

- [x] 任务列表也可以
- [ ] 比如这个未勾选的条目

## 引用

> 简单是可靠的先决条件。
>
> —— Edsger W. Dijkstra

## 代码

围栏代码块支持语法高亮，并带有复制按钮（鼠标悬停即可看到）：

```python
def fibonacci(n: int) -> list[int]:
    """返回前 n 个斐波那契数。"""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]

print(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

```javascript
const greet = (name = "世界") => `你好，${name}！`;
console.log(greet("博客"));
```

## 表格

| 写法         | 效果           |
| ------------ | -------------- |
| `**粗体**`   | **粗体**       |
| `*斜体*`     | *斜体*         |
| `` `代码` `` | `代码`         |

## 图片

把图片放进 `assets/images/` 文件夹，然后这样引用：

{% raw %}
```markdown
![描述图片内容的替代文字]({{ '/assets/images/photo.jpg' | relative_url }})
```
{% endraw %}

---

就这些。写作愉快！✍️
