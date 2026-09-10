---
title: "Hello, World — The Blog Is Live"
date: 2026-06-18
tags: ["Musings", "Frontend"]
description: "Built a sci-fi flavored personal blog from scratch. A few words on why now, and why VitePress."
---

# Hello, World — The Blog Is Live

After an entire evening of tinkering, the blog is finally up and running.

## Why Now

After years of doing frontend, I've stumbled into plenty of pitfalls and stepped on more than a few landmines. Offline reconnection in workflow systems, optimizing million-row Excel exports, the algorithm design behind vehicle lookup... each one took real time to crack. But keeping them only in my head means the details fade over time.

Writing them down gives me something to refer back to later, and maybe helps a fellow engineer who runs into the same problem.

## Why VitePress

I went back and forth a bit when picking a framework:

| Framework | Pros | Cons |
|-----------|------|------|
| VitePress | Blazing fast, Vue-native, zero-config | Not really a dedicated blog framework |
| Nuxt Content | Powerful, great blog features | Too heavy, overkill for this |
| Astro | Great performance, rich ecosystem | Have to learn new syntax |

In the end I went with **VitePress**. The reason is simple — I'm already a Vue developer, and the VitePress experience is identical to writing Vue SFCs. If I want to add a Vue component, I just write it. Plus it's built on Vite, so the dev experience is genuinely fast.

## About This Theme

The dark sci-fi look is hand-rolled. Core elements:

- Deep space blue-black base with a subtle grid texture
- Cyan-to-purple gradient accents
- Glassmorphism (backdrop-filter) cards
- Hero glow effects and typewriter animation on the home page
- Hydrogen-like glowing text

All styles are plain CSS, no extra UI library pulled in.

## What's Coming Next

- **Workflow system in production** — offline reconnection, message push, performance tuning for Excel export
- **Deep dives into Vue 3** — Composition API design patterns, component encapsulation thinking
- **Engineering** — Git workflows, CI/CD setup, project architecture evolution
- **Quick notes** — pitfalls encountered and how they were solved

---

That's it. Open for business. 🚀
