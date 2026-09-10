---
title: "Python 爬虫"
tags: [网络与爬虫]
group: 高级
date: 2026-09-10 00:00:00
---

# Python 爬虫

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
爬虫就是用程序自动请求网页、解析 HTML、提取数据并保存的流程，核心三件套是 `requests + BeautifulSoup + 存储`。

## 要点
- **四步走**：发请求（requests）→ 拿响应 → 解析（BeautifulSoup/lxml）→ 保存（文件/数据库）。
- **请求三要素**：URL、`headers`（尤其 `User-Agent`）、`params`/`data`。
- **静态页面**用 `requests` 足够；**JS 渲染**的页面才需要 Selenium/Playwright。
- **解析选择器**：`find` / `find_all`、CSS 选择器 `select`、属性取值 `get("href")`。
- **编码**：中文乱码时设置 `resp.encoding = resp.apparent_encoding`。
- **超时与重试**：必须设 `timeout`，网络不稳时加重试，避免程序卡死。
- **合规**：遵守 `robots.txt`、控制频率、别抓隐私数据、别用于商业侵权。
- 大规模抓取用框架（Scrapy）、异步（aiohttp）或分布式，单机 requests 会慢。

## 语法 / 常用方法

| 语法 / 方法 | 说明 | 示例 |
|---|---|---|
| `requests.get(url, headers=)` | 发 GET 请求 | 抓页面 |
| `requests.post(url, data=)` | 发 POST 请求 | 提交表单/接口 |
| `resp.status_code` | HTTP 状态码 | 200 表示成功 |
| `resp.text` | 响应文本（str） | 解析 HTML |
| `resp.json()` | 解析 JSON 响应 | 调接口 |
| `resp.encoding` | 文本编码 | 中文乱码时设 |
| `BeautifulSoup(html, "lxml")` | 构造解析对象 | 需 `pip install bs4 lxml` |
| `soup.find("div", class_="x")` | 找第一个匹配 | 单元素 |
| `soup.find_all("a")` | 找全部匹配 | 列表 |
| `soup.select("div.item a")` | CSS 选择器 | 灵活精确 |
| `tag.get_text(strip=True)` | 取纯文本 | 去空白 |
| `tag.get("href")` | 取属性值 | 拿链接 |
| `time.sleep(1)` | 抓取间隔 | 降频防封 |

## 代码示例

```python
# pip install requests beautifulsoup4 lxml
import requests
from bs4 import BeautifulSoup
import csv
import time

url = "https://quotes.toscrape.com/"        # 专供练习的爬虫站点
headers = {
    # 伪装成浏览器，很多站点不带 UA 会拒绝
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

# 1) 发请求（一定要设超时）
resp = requests.get(url, headers=headers, timeout=10)
resp.raise_for_status()                     # 状态码非 2xx 直接抛异常
resp.encoding = resp.apparent_encoding      # 防止中文乱码

# 2) 解析 HTML
soup = BeautifulSoup(resp.text, "lxml")

# 3) 用 CSS 选择器批量提取名言
rows = []
for item in soup.select("div.quote"):
    text = item.select_one("span.text").get_text(strip=True)
    author = item.select_one("small.author").get_text(strip=True)
    rows.append({"名言": text, "作者": author})

# 4) 保存到 CSV
with open("quotes.csv", "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.DictWriter(f, fieldnames=["名言", "作者"])
    writer.writeheader()
    writer.writerows(rows)

print(f"共抓取 {len(rows)} 条，已保存 quotes.csv")

time.sleep(1)   # 抓取间隔，做个有礼貌的爬虫
```

## 易错点
- 不设 `User-Agent`，大量网站返回 403 或空内容。
- 不设 `timeout`，网络异常时 `requests` 会一直挂起。
- 直接 `resp.text` 中文乱码，需手动设 `resp.encoding` 或用 `apparent_encoding`。
- `find` 找不到返回 `None`，紧接着 `.get_text()` 会 `AttributeError`，先判空。
- JS 渲染的页面用 `requests` 抓到的是空壳，要换 Selenium/Playwright 或找接口。
- 请求太频繁轻则封 IP，重则触发法律风险，务必降频并遵守 robots 与相关法律。
- 别用 `eval` 或 `exec` 处理抓来的内容，可能执行恶意代码。
