---
title: "Python requests"
tags: [网络与爬虫]
group: 高级
date: 2026-09-10 00:00:00
---

# Python requests

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`requests` 是最流行的第三方 HTTP 库，用几行代码完成 GET/POST、传参、传 JSON、带请求头、处理响应。

## 要点
- 先装：`pip install requests`。
- `requests.get(url, params=...)` 发 GET，`requests.post(url, data=/json=...)` 发 POST。
- `params` 走查询字符串（URL 上），`data` 走表单，`json` 走 JSON 请求体。
- 响应对象常用属性：`status_code`、`text`、`json()`、`content`、`headers`。
- `text` 是解码后的字符串，`content` 是原始 bytes（下载图片用）。
- 用 `headers` 传请求头，用 `cookies`/`Session` 维持登录态。
- `timeout` 必设，避免请求卡死。

## 语法 / 常用方法

| 方法 / 参数 | 说明 | 示例 |
|---|---|---|
| `requests.get(url)` | GET 请求 | `get("https://a.com")` |
| `requests.post(url, data=)` | POST 表单 | `post(url, data={"a": 1})` |
| `requests.post(url, json=)` | POST JSON | `post(url, json={"a": 1})` |
| `params={...}` | URL 查询参数 | `get(url, params={"q": "中文"})` |
| `headers={...}` | 自定义请求头 | `{"User-Agent": "..."}` |
| `data={...}` / `data="..."` | 表单数据 | 自动编码 |
| `json=` | JSON 请求体 | 自动序列化并设 Content-Type |
| `timeout=5` | 超时秒数 | 防卡死 |
| `r.status_code` | 状态码 | `200` |
| `r.text` | 解码后的文本 | 网页源码 |
| `r.content` | 原始字节 | 图片/文件 |
| `r.json()` | 解析 JSON | 返回 dict/list |
| `r.headers` | 响应头 | dict |
| `r.raise_for_status()` | 非 2xx 抛异常 | 统一错误处理 |
| `requests.Session()` | 会话对象 | 保持 cookie、复用连接 |

## 代码示例

```python
import requests

# 一、GET + 查询参数（中文自动编码）
r = requests.get("https://httpbin.org/get",
                 params={"q": "你好", "page": 1},
                 timeout=5)
print(r.status_code)          # 200
print(r.url)                  # 含编码后的查询串
print(r.json()["args"])       # {'q': '你好', 'page': '1'}

# 二、POST 表单
r = requests.post("https://httpbin.org/post",
                  data={"user": "tom", "pwd": "123"},
                  timeout=5)
print(r.json()["form"])       # {'user': 'tom', 'pwd': '123'}

# 三、POST JSON + 自定义请求头
headers = {"User-Agent": "Mozilla/5.0", "Authorization": "Bearer TOKEN"}
r = requests.post("https://httpbin.org/post",
                  json={"title": "笔记"},
                  headers=headers, timeout=5)
print(r.json()["json"])       # {'title': '笔记'}

# 四、下载文件用 content（二进制）
r = requests.get("https://httpbin.org/image/png", timeout=5)
with open("demo.png", "wb") as f:
    f.write(r.content)

# 五、会话保持登录态
s = requests.Session()
s.get("https://httpbin.org/cookies/set?token=abc", timeout=5)
print(s.get("https://httpbin.org/cookies", timeout=5).json())

# 六、统一错误处理
r = requests.get("https://httpbin.org/status/404", timeout=5)
try:
    r.raise_for_status()
except requests.HTTPError as e:
    print("请求失败:", e)
```

## 易错点
- 忘记 `.json()` 的括号，`r.json` 是方法不是属性。
- 服务端要 JSON 时别用 `data=json.dumps(...)`，直接 `json=...` 会同时设好 Content-Type。
- 不设 `timeout` 默认无限等待，程序可能永久卡住。
- 下载图片/二进制必须用 `r.content` 并以 `"wb"` 写文件，用 `r.text` 会损坏。
- 4xx/5xx 不会自动抛异常，需要 `raise_for_status()` 或自己判断 `status_code`。
- 编码乱码时用 `r.encoding = r.apparent_encoding` 让 requests 猜对编码。
