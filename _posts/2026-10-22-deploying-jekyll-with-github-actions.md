---
title: "Deploying a Jekyll blog with GitHub Actions (and the two things that tripped me up)"
description: "A line-by-line tour of the workflow that publishes this blog for free — plus the setup error and the URL surprise I ran into on day one."
date: 2026-10-22 07:30:00 +0000
ref: deploying-jekyll-with-github-actions
tags: [jekyll, github, ci, guide]
---

Every time I push to `main`, this blog rebuilds and goes live about a minute later.
No server, no bill. The whole pipeline is one YAML file. This post walks through
it, and through the two problems that cost me some head-scratching on day one.

## Why not just let GitHub Pages build it?

GitHub Pages can build a Jekyll site by itself: push the source and it does the
rest. The catch is that the built-in builder is pinned to an older **Jekyll 3.x**
and a fixed list of approved plugins.

Building with **GitHub Actions** instead means:

- the **same Jekyll version** runs in CI as on my laptop, locked by `Gemfile.lock`;
- I can use **any plugin** or build step I like;
- pull requests get a **build check** before anything reaches the live site.

## The workflow, piece by piece

It lives in `.github/workflows/pages.yml`. First, when it runs and what it may do:

{% raw %}
```yaml
on:
  push:
    branches: [main]   # publish on every push to main
  pull_request:        # build-only check on PRs
  workflow_dispatch:   # a "Run workflow" button in the Actions tab

permissions:
  contents: read
  pages: write         # allowed to publish to Pages
  id-token: write      # proves to Pages that the deploy came from this repo

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: false
```
{% endraw %}

`concurrency` makes sure two deploys never run on top of each other.
`cancel-in-progress: false` lets a deploy that has started finish rather than
being killed halfway.

### The build job

{% raw %}
```yaml
- uses: actions/checkout@v6

- uses: ruby/setup-ruby@v1
  with:
    ruby-version: "3.3"
    bundler-cache: true      # runs bundle install and caches the gems

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

`bundler-cache: true` is the biggest speed-up: the first run installs the gems,
and later runs restore them from cache in seconds.

`configure-pages` asks GitHub where the site will be served and hands back a
`base_path`. Feeding that into `--baseurl` means the same workflow works whether
the site lives at `https://user.github.io/` or `https://user.github.io/repo/`.
That turned out to matter a lot (see below).

### The deploy job

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

It waits for the build, then publishes the uploaded files. The `if:` conditions on
this job and on the Pages-specific steps are what turn pull requests into a
**build-only check**: a broken template fails the PR, not the live site.

## Trip-up #1: "Get Pages site failed"

The very first deploy after merging failed at the *Configure Pages* step:

```text
Get Pages site failed. Please verify that the repository has Pages enabled
and configured to build using GitHub Actions, or consider exploring the
`enablement` parameter for this action.
```

The workflow was fine. The repository just hadn't been told to publish from
Actions yet. The fix is a one-time setting:

> **Settings → Pages → Build and deployment → Source → GitHub Actions**

Then re-run the failed workflow from the **Actions** tab. Nothing in the code needs
to change.

## Trip-up #2: where does the site actually live?

GitHub serves Pages sites at two kinds of address, depending only on the
**repository name**:

| Repository name       | Site address                          |
| --------------------- | ------------------------------------- |
| `<user>.github.io`    | `https://<user>.github.io/`           |
| anything else, `repo` | `https://<user>.github.io/repo/`      |

My blog started in a repo with a different name, so it lived under a sub-path.
That's why **every** internal link in the templates goes through Jekyll's
`relative_url` filter instead of starting with a bare `/`. Combined with the
`base_path` trick above, the templates worked at either address without changes.

When I renamed the repo to `<user>.github.io`, it moved to the root on the next
deploy. Two things I didn't expect:

1. **The old address doesn't redirect.** GitHub redirects old *repository* URLs
   after a rename, but the old Pages sub-path simply returns 404. Any links shared
   before the rename need updating.
2. **The profile README went with it.** A repo named exactly after your username
   is what shows a README on your GitHub profile. Renaming it means making a new
   one if you want that back.

## Checklist

If you're setting up the same thing, this is the short version:

- [ ] Add a `Gemfile` and commit `Gemfile.lock`, with the CI platform added via
      `bundle lock --add-platform x86_64-linux`
- [ ] Add the workflow above as `.github/workflows/pages.yml`
- [ ] Use `relative_url` for every internal link and asset
- [ ] Set **Settings → Pages → Source** to **GitHub Actions** *before* the first deploy
- [ ] Name the repo `<user>.github.io` if you want the root address
- [ ] Push to `main`, then grab a coffee. It takes about a minute.
