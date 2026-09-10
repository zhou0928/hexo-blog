---
title: "为什么 AI 写前端时，总是优先选择 React，而不是 Vue？"
date: 2026-07-16
tags: []
description: "AI编程工具默认生成React+Tailwind代码，而非Vue，本质是模型对语言结构纯粹性的偏好。React的JSX在AST层面更接近标准JS，而Vue的模板与脚本分离增加了模型理解成本，导致生成质量下降。"
author: "ErpanOmer"
---

# 为什么 AI 写前端时，总是优先选择 React，而不是 Vue？

> 本文转载自掘金，作者：ErpanOmer。原文链接：[点击查看](https://juejin.cn/post/7661833071121530926)

AI编程工具默认生成React+Tailwind代码，而非Vue，本质是模型对语言结构纯粹性的偏好。React的JSX在AST层面更接近标准JS，而Vue的模板与脚本分离增加了模型理解成本，导致生成质量下降。

---

*本文为自动转载草稿，请编辑后发布。*
