---
title: "Python Markdown"
tags: [参考]
group: 高级
date: 2026-09-10 00:00:00
---

# Python Markdown

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`markdown` 库把 Markdown 文本转换成 HTML，常用于博客、文档渲染和内容发布。

## 要点
- 安装：`pip install markdown`，导入 `import markdown`。
- 核心就一个函数：`markdown.markdown(text)` 返回 HTML 字符串。
- **扩展（extensions）**是重点：表格、代码高亮、目录、脚注等都要开扩展。
- 常用扩展：`extra`（表格/属性/围栏代码）、`codehilite`、`toc`（自动生成目录锚点）、`nl2br`（换行转 `<br>`）。
- `extensions_configs` 可给扩展传参，如代码高亮样式、目录层级。
- 配合 `bleach` 或 `DOMPurify` 过滤 HTML，防止用户内容 XSS。
- 反向转换（HTML→Markdown）用 `html2text` 或 `markdownify`，不是本库功能。

## 语法 / 常用方法

| 语法 / 方法 | 说明 | 示例 |
|---|---|---|
| `markdown.markdown(text)` | 转 HTML | 基础用法 |
| `markdown.markdown(text, extensions=[...])` | 带扩展转换 | 常用形态 |
| `"extra"` | 表格/围栏代码/属性等合集 | 最常用扩展 |
| `"toc"` | 生成标题锚点与目录 | `[TOC]` 占位 |
| `"codehilite"` | 代码语法高亮 | 需 Pygments |
| `"nl2br"` | 单换行转 `<br>` | 聊天/评论场景 |
| `"tables"` | 仅启用表格 | 按需最小化 |
| `"fenced_code"` | ``` 围栏代码块 | 现代写法 |
| `"footnotes"` | 脚注支持 | `[^1]` |
| `extensions_configs` | 扩展参数 | 高亮样式等 |
| `html2text` / `markdownify` | HTML→MD（第三方） | 反向转换 |

## 代码示例

```python
# pip install markdown
import markdown

# 用 chr(96)*3 拼接三反引号，避免示例里嵌套代码围栏
fence = chr(96) * 3

md_text = f"""
# 标题

这是一段**加粗**文字和 `行内代码`。

| 姓名 | 年龄 |
|------|------|
| Tom  | 18   |

{fence}python
print("fenced code")
{fence}
"""

# 1) 基础转换（注意：表格、代码块需要扩展才生效）
html = markdown.markdown(md_text)
print(html)

# 2) 开启常用扩展
html = markdown.markdown(
    md_text,
    extensions=["extra", "toc", "codehilite", "nl2br"],
    extension_configs={
        "codehilite": {"guess_lang": False, "noclasses": True},
    },
)
print(html)                       # 现在表格、代码高亮、目录锚点都有了

# 3) 生成目录：需要 "toc" 扩展，正文里放 [TOC] 占位
doc = "[TOC]\n\n# 第一章\n## 1.1 小节\n"
print(markdown.markdown(doc, extensions=["toc"]))

# 4) 把 Markdown 文件渲染为 HTML 页面
def md_to_html(infile, outfile):
    with open(infile, encoding="utf-8") as f:
        text = f.read()
    body = markdown.markdown(text, extensions=["extra", "toc"])
    page = f"<html><body>{body}</body></html>"
    with open(outfile, "w", encoding="utf-8") as f:
        f.write(page)

# md_to_html("readme.md", "readme.html")   # 取消注释即可运行

print("转换完成")
```

## 易错点
- 不加 `extra`/`tables` 扩展，Markdown 表格不会渲染成 `<table>`。
- `codehilite` 需要额外安装 `Pygments`，否则高亮不生效甚至报错。
- 生成的 HTML 若来自用户输入，直接渲染有 XSS 风险，务必过滤或转义。
- `toc` 扩展要靠 `[TOC]` 占位符插入目录，不是自动加在页面上。
- `nl2br` 会让所有单换行变 `<br>`，写 HTML 时可能产生多余空行。
- 中英文混排时标题锚点可能含非 ASCII 字符，前端跳转要对应处理。
- `markdown` 只负责 MD→HTML，反向转换请用 `html2text` 等库。
