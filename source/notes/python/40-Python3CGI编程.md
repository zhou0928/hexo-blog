---
title: "Python3 CGI编程"
tags: [Web, 部署]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 CGI编程

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

CGI（Common Gateway Interface，公共网关接口）是 Web 服务器把请求交给外部程序处理并返回结果的标准接口，Python 脚本加 `cgi` 模块即可写 CGI 程序。

## 要点

- CGI 程序本质是普通脚本，通过 HTTP 请求被服务器调用，输出要符合 HTTP 协议格式。
- 第一行固定为 `#!/usr/bin/python3`（shebang），文件可执行（`chmod +x`）。
- 输出以 `Content-type: text/html\r\n\r\n` 开头，空行之后才是页面内容，否则浏览器可能显示 "500 Internal Server Error" 或空白。
- 表单数据：GET 在 URL 查询串中，POST 在请求体中，`cgi.FieldStorage()` 统一解析。
- 环境变量 `QUERY_STRING`、`REQUEST_METHOD`、`REMOTE_ADDR` 等携带请求信息。
- 现代开发多被 WSGI/框架替代，但 CGI 概念仍是理解 Web 编程的基础。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `#!/usr/bin/python3` | 脚本解释器声明，必须第一行 | 文件开头 |
| `cgi.FieldStorage()` | 解析 GET/POST 表单数据，返回字典式对象 | `form = cgi.FieldStorage()` |
| `form.getvalue('name')` | 取单个字段值 | `name = form.getvalue('name')` |
| `form['field']` | 取字段对象（可能是列表，多值时） | `f = form['hobby']` |
| `cgi.test()` | 打印当前 CGI 环境信息，用于调试 | `cgi.test()` |
| `cgi.escape(text)` | 转义 HTML 特殊字符（Python3.8 起废弃，用 `html.escape`） | `html.escape(s)` |
| `sys.exit()` | 提前结束脚本 | 出错时用 |
| 环境变量 `os.environ` | 读取服务器传入的环境变量 | `os.environ['REMOTE_ADDR']` |

## 代码示例

```python
#!/usr/bin/python3
# hello.py —— 最简单的 CGI 程序（需放到服务器 cgi-bin 目录并加执行权限）

import cgi

# 先输出 HTTP 头：Content-type 后必须空一行
print("Content-type: text/html")
print()
print("<html><head><title>Hello CGI</title></head><body>")
print("<h2>Hello, World!</h2>")

# 处理表单输入（GET 或 POST 均可）
form = cgi.FieldStorage()
name = form.getvalue('name', '游客')   # 无 name 字段时默认 '游客'
print(f"<p>你好，{name}！</p>")

# 输出 JSON 给前端接口用
import json
print("<p>" + json.dumps({'name': name, 'status': 'ok'}) + "</p>")
print("</body></html>")
```

```bash
# 提交表单示例（浏览器地址栏）
#   http://localhost/cgi-bin/hello.py?name=Tom
# 或在 HTML 表单中 method=GET/POST 提交
```

## 易错点

- 忘了在 HTTP 头后输出空行（`print()` 不带参数），浏览器会报错或显示乱码。
- 脚本没有执行权限或首行 shebang 路径不对，服务器返回 500。
- 输出顺序不能乱：所有 HTTP 头必须先于正文输出。
- 中文输出要保证编码一致，CGI 头可用 `Content-type: text/html; charset=utf-8`。
- `cgi.escape` 已废弃，转义 HTML 请用 `html.escape()`。
- 文件路径、文件名含空格或特殊字符，服务器可能找不到脚本。
