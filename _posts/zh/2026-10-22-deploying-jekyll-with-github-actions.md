---
title: "用 GitHub Actions 部署 Jekyll 博客（以及让我栽了跟头的两件事）"
description: "逐行讲解免费发布这个博客的工作流——外加上线第一天遇到的配置报错和网址意外。"
date: 2026-10-22 07:30:00 +0000
ref: deploying-jekyll-with-github-actions
tags: [jekyll, github, ci, guide]
---

每次我推送到 `main`，这个博客就会自动重新构建，大约一分钟后上线。没有服务器，也没有账单。
整条流水线只是一个 YAML 文件。这篇文章会逐段讲解它，也会讲讲上线第一天让我挠头的两个问题。

## 为什么不直接让 GitHub Pages 自己构建？

GitHub Pages 本身就能构建 Jekyll 网站：推送源码，剩下的它全包。
问题在于，内置的构建器固定在较老的 **Jekyll 3.x** 版本，并且只允许使用一份固定的插件清单。

改用 **GitHub Actions** 来构建意味着：

- CI 里运行的 Jekyll 和我电脑上的**完全是同一个版本**，由 `Gemfile.lock` 锁定；
- 可以使用**任何插件**或构建步骤；
- 拉取请求（PR）在影响线上网站之前，会先经过一次**构建检查**。

## 逐段看工作流

它放在 `.github/workflows/pages.yml`。首先是什么时候运行、有哪些权限：

{% raw %}
```yaml
on:
  push:
    branches: [main]   # 每次推送到 main 时发布
  pull_request:        # PR 上只做构建检查
  workflow_dispatch:   # 在 Actions 页面提供“Run workflow”按钮

permissions:
  contents: read
  pages: write         # 允许发布到 Pages
  id-token: write      # 向 Pages 证明这次部署来自本仓库

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: false
```
{% endraw %}

`concurrency` 保证两次部署不会叠在一起运行。`cancel-in-progress: false`
让已经开始的部署跑完，而不是半路被打断。

### 构建任务

{% raw %}
```yaml
- uses: actions/checkout@v6

- uses: ruby/setup-ruby@v1
  with:
    ruby-version: "3.3"
    bundler-cache: true      # 执行 bundle install 并缓存 gem

- name: Configure Pages
  id: pages
  if: github.event_name != 'pull_request'
  uses: actions/configure-pages@v6

- name: Build site
  run: |
    if [ -n "${{ steps.pages.outputs.base_path }}" ]; then
      bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
    else
      bundle exec jekyll build
    fi
  env:
    JEKYLL_ENV: production

- name: Upload artifact
  if: github.event_name != 'pull_request'
  uses: actions/upload-pages-artifact@v5
```
{% endraw %}

`bundler-cache: true` 是提速最明显的一项：第一次运行会安装 gem，之后几秒钟就能从缓存里恢复。

`configure-pages` 会询问 GitHub 网站将部署在哪里，并返回一个 `base_path`。
把它传给 `--baseurl`，同一个工作流就既能用于 `https://user.github.io/`，
也能用于 `https://user.github.io/repo/`。后来证明这一点非常重要（见下文）。

### 部署任务

{% raw %}
```yaml
deploy:
  if: github.event_name != 'pull_request'
  needs: build
  runs-on: ubuntu-latest
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  steps:
    - id: deployment
      uses: actions/deploy-pages@v5
```
{% endraw %}

它等构建完成后，把上传的文件发布出去。这个任务以及 Pages 相关步骤上的 `if:` 条件，
正是让 PR 变成**只构建、不发布**检查的关键：模板写坏了，失败的是 PR，而不是线上网站。

## 第一个坑：“Get Pages site failed”

合并之后的第一次部署就在 *Configure Pages* 这一步失败了：

```text
Get Pages site failed. Please verify that the repository has Pages enabled
and configured to build using GitHub Actions, or consider exploring the
`enablement` parameter for this action.
```

工作流本身没有问题，只是仓库还没被告知要从 Actions 发布。解决办法是一个一次性设置：

> **Settings → Pages → Build and deployment → Source → GitHub Actions**

然后在 **Actions** 页面重新运行失败的工作流即可，代码一行都不用改。

## 第二个坑：网站到底在哪个地址？

GitHub Pages 网站的地址有两种，完全取决于**仓库名**：

| 仓库名                 | 网站地址                              |
| ---------------------- | ------------------------------------- |
| `<用户名>.github.io`   | `https://<用户名>.github.io/`         |
| 其他任意名字 `repo`    | `https://<用户名>.github.io/repo/`    |

我的博客一开始放在另一个名字的仓库里，所以挂在一个子路径下。
这就是为什么模板里的**每一个**内部链接都经过 Jekyll 的 `relative_url` 过滤器，
而不是直接以 `/` 开头。再加上前面的 `base_path` 技巧，模板在两种地址下都无需改动就能用。

当我把仓库重命名为 `<用户名>.github.io` 后，下一次部署时网站就搬到了根地址。有两件事出乎我的意料：

1. **旧地址不会重定向。** 重命名后 GitHub 会重定向旧的*仓库*地址，
   但旧的 Pages 子路径会直接返回 404。重命名之前分享出去的链接都需要更新。
2. **个人主页的 README 也跟着没了。** 只有和用户名同名的仓库，
   它的 README 才会显示在 GitHub 个人主页上。重命名之后，想要的话得重新建一个。

## 检查清单

如果你也要搭一套同样的东西，简短版本是这样的：

- [ ] 添加 `Gemfile` 并提交 `Gemfile.lock`，用
      `bundle lock --add-platform x86_64-linux` 加上 CI 的平台
- [ ] 把上面的工作流保存为 `.github/workflows/pages.yml`
- [ ] 所有内部链接和资源都用 `relative_url`
- [ ] 在第一次部署*之前*，把 **Settings → Pages → Source** 设为 **GitHub Actions**
- [ ] 想用根地址的话，把仓库命名为 `<用户名>.github.io`
- [ ] 推送到 `main`，然后去倒杯咖啡。大约一分钟就好。
