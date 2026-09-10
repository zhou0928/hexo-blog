---
title: "Python Scrapy 库"
tags: [网络与爬虫]
group: 高级
date: 2026-09-10 00:00:00
---

# Python Scrapy 库

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
Scrapy 是专业的爬虫框架，把"请求-解析-存数据"拆成可复用的组件，适合大规模、结构化抓取。

## 要点
- **框架 vs 库**：requests 是工具，Scrapy 是流水线，自带调度、去重、并发、重试。
- **五大组件**：Engine、Scheduler、Downloader（下载）、Spider（解析）、Pipeline（存储）。
- **流程**：Spider 产出 Request → 下载器返回 Response → Spider 的 `parse` 解析 → 产出 Item → Pipeline 保存。
- 创建项目：`scrapy startproject 项目名`，再用 `scrapy genspider 名字 域名` 生成爬虫。
- 运行：`scrapy crawl 爬虫名`，可加 `-o out.json` 直接导出。
- 异步并发基于 Twisted，速度快；支持中间件插入代理、UA、去重策略。
- 适合新闻、电商、招聘等大量列表页抓取；小任务用它反而重。

## 语法 / 常用方法

| 概念 / 方法 | 说明 | 示例 |
|---|---|---|
| `scrapy startproject name` | 创建项目 | 命令行执行 |
| `scrapy genspider s domain` | 生成爬虫文件 | 自动建模板 |
| `class MySpider(scrapy.Spider)` | 自定义爬虫类 | 继承 Spider |
| `name = "myspider"` | 爬虫唯一名 | `crawl` 时用 |
| `start_urls = [url]` | 起始 URL 列表 | 入口页面 |
| `def parse(self, response)` | 默认解析回调 | 必须实现 |
| `response.css("a::text")` | CSS 选择器取值 | 提取文本 |
| `response.xpath("//h1/text()")` | XPath 选择器 | 提取节点 |
| `response.follow(url, cb)` | 跟进链接 | 翻页/详情页 |
| `yield {"k": v}` | 产出字典/Item | 交给 Pipeline |
| `scrapy crawl name -o a.json` | 运行并导出 | 常见命令 |
| `process_item(item, spider)` | Pipeline 处理项 | 清洗/入库 |
| `DOWNLOAD_DELAY` | 下载延迟（settings） | 防封 |
| `ROBOTSTXT_OBEY` | 遵守 robots（settings） | 默认 True |

## 代码示例

```python
# pip install scrapy
# 命令行：scrapy startproject demo && cd demo && scrapy genspider quotes quotes.toscrape.com

# ---- 文件：demo/spiders/quotes.py ----
import scrapy

class QuotesSpider(scrapy.Spider):
    name = "quotes"                       # 运行：scrapy crawl quotes
    start_urls = ["https://quotes.toscrape.com/"]

    def parse(self, response):
        # 1) 遍历每一条名言
        for item in response.css("div.quote"):
            yield {
                "text": item.css("span.text::text").get(),
                "author": item.css("small.author::text").get(),
                "tags": item.css("div.tags a.tag::text").getall(),
            }

        # 2) 翻页：找到"下一页"链接并跟进，回调仍是 parse
        next_page = response.css("li.next a::attr(href)").get()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)


# ---- 文件：demo/pipelines.py（可选，存储/清洗）----
class DemoPipeline:
    def open_spider(self, spider):
        self.f = open("quotes.jsonl", "w", encoding="utf-8")

    def process_item(self, item, spider):
        item["text"] = item["text"].strip() if item["text"] else ""
        self.f.write(str(dict(item)) + "\n")   # 简化演示，实际可用 json.dumps
        return item

    def close_spider(self, spider):
        self.f.close()

# 别忘了在 settings.py 里注册 Pipeline：
# ITEM_PIPELINES = {"demo.pipelines.DemoPipeline": 300}
```

## 易错点
- 忘了在 `settings.py` 注册 Pipeline，`process_item` 永远不会被调用。
- 选择器语法用混：`::text` 取文本、`::attr(href)` 取属性，`get()` 取单个、`getall()` 取列表。
- `yield` 出的必须是可序列化对象，存数据库要自己写 Pipeline。
- 默认 `ROBOTSTXT_OBEY=True`，有的站点会因此抓不到，按需调整并注意合规。
- 不设 `DOWNLOAD_DELAY` 和 `AUTOTHROTTLE`，高频请求容易被封。
- Scrapy 基于 Twisted 异步，回调里别用阻塞操作（如 `time.sleep`），会拖慢全局。
- 小规模、一次性任务用 `requests` 更简单，别为几页数据上框架。
