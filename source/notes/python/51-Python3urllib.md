---
title: "Python3 urllib"
tags: [网络与爬虫]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 urllib

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
Python 标准库自带的 HTTP 客户端与 URL 处理模块，无需安装即可发请求、解析网址、编码参数。

## 要点
- `urllib` 是一个包，常用子模块有 `request`（发请求）、`parse`（解析/编码 URL）、`error`（异常）。
- `urllib.request.urlopen(url)` 是最基础的 GET 请求，返回类文件对象。
- POST 用 `urllib.request.Request(url, data=..., headers=...)`，`data` 要编码成 bytes。
- 中文参数、查询字符串用 `urllib.parse.urlencode()` 或 `quote()` 编码。
- Python3 里原来的 `urllib2` 已并入 `urllib.request`，不要再用旧名。
- 简单爬取够用，复杂场景（会话、重试、JSON 便捷处理）用 `requests` 更省事。

## 语法 / 常用方法

| 模块.方法 | 说明 | 示例 |
|---|---|---|
| `request.urlopen(url)` | 打开 URL 发 GET | `urlopen("http://example.com")` |
| `request.urlopen(req)` | 用 Request 对象发请求 | `urlopen(Request(url, data=d))` |
| `Request(url, data, headers)` | 构造请求 | `Request(url, data=b"a=1")` |
| `request.urlretrieve(url, file)` | 下载文件到本地 | `urlretrieve(url, "a.html")` |
| `.read()` / `.readline()` | 读响应内容（bytes） | `resp.read().decode("utf-8")` |
| `.getcode()` / `.status` | HTTP 状态码 | `resp.status` |
| `parse.urlencode(d)` | 字典转查询串 | `urlencode({"q": "中文"})` |
| `parse.quote(s)` | 字符串百分号编码 | `quote("中文")` |
| `parse.unquote(s)` | 百分号解码 | `unquote("%E4%B8%AD")` |
| `parse.urlparse(url)` | 拆解 URL 各部分 | 得 scheme/netloc/path 等 |
| `parse.urljoin(base, url)` | 拼接相对 URL | `urljoin("http://a/x", "y")` |
| `error.URLError` | 请求异常基类 | 捕获网络错误 |

## 代码示例

```python
import urllib.request
import urllib.parse
import json

# 一、GET 请求
url = "https://httpbin.org/get"
with urllib.request.urlopen(url, timeout=5) as resp:
    print(resp.status)                       # 200
    body = resp.read().decode("utf-8")       # bytes -> str
    print(json.loads(body)["url"])

# 二、带参数的 GET（中文要编码）
params = urllib.parse.urlencode({"q": "你好", "page": 1})
full = "https://httpbin.org/get?" + params
with urllib.request.urlopen(full) as resp:
    print(resp.status)

# 三、POST 表单
data = urllib.parse.urlencode({"user": "tom", "pwd": "123"}).encode("utf-8")
req = urllib.request.Request(
    "https://httpbin.org/post",
    data=data,
    headers={"User-Agent": "Mozilla/5.0"},   # 伪装浏览器
    method="POST",
)
with urllib.request.urlopen(req) as resp:
    print(json.loads(resp.read().decode("utf-8"))["form"])

# 四、URL 解析与拼接
p = urllib.parse.urlparse("https://example.com/a/b?x=1")
print(p.scheme, p.netloc, p.path, p.query)   # https example.com /a/b x=1
print(urllib.parse.urljoin("https://example.com/a/", "b"))  # .../a/b
```

## 易错点
- `read()` 返回的是 `bytes`，要显示中文必须 `.decode("utf-8")`。
- POST 的 `data` 必须是 bytes，`urlencode` 后一定记得 `.encode()`，否则报类型错误。
- 请求中文 URL 要先 `quote()`，否则可能抛 `UnicodeEncodeError`。
- 默认 User-Agent 是 `Python-urllib/3.x`，很多网站会拦截，建议自定义。
- 要捕获 `URLError` 和 `HTTPError`（`HTTPError` 是 `URLError` 子类，先捕子类）。
- 生产代码记得设 `timeout`，否则网络卡住会一直等。
