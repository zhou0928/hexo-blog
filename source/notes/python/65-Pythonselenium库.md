---
title: "Python selenium 库"
tags: [网络与爬虫]
group: 高级
date: 2026-09-10 00:00:00
---

# Python selenium 库

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`selenium` 用代码驱动真实浏览器，自动点击、输入、抓取，专治 JavaScript 渲染的网页。

## 要点
- 驱动真实浏览器，能执行 JS、处理登录与动态加载，是爬虫的"重武器"。
- 三大组件：`webdriver`（驱动浏览器）、`WebDriverWait`（显式等待）、定位器（找元素）。
- Selenium 4 自带 Selenium Manager，多数情况无需手动下载浏览器驱动。
- 定位方式：`By.ID`、`By.CLASS_NAME`、`By.XPATH`、`By.CSS_SELECTOR` 等。
- **等待**是核心：页面动态加载，必须用显式等待，别用 `time.sleep`。
- 常用于自动化测试、表单填写、网页截图、反爬较弱的站点数据采集。
- 无头模式 `--headless` 可后台运行，适合服务器环境。

## 语法 / 常用方法

| 语法 / 方法 | 说明 | 示例 |
|---|---|---|
| `webdriver.Chrome()` | 启动 Chrome | 需装 `selenium` |
| `driver.get(url)` | 打开网址 | `driver.get("https://x.com")` |
| `driver.find_element(By.ID, v)` | 找一个元素 | 定位器 + 值 |
| `driver.find_elements(...)` | 找多个，返回列表 | 找不到返回 `[]` |
| `el.click()` | 点击元素 | 按钮/链接 |
| `el.send_keys("x")` | 输入文本 | 填表单 |
| `el.text` | 取可见文本 | 抓内容 |
| `el.get_attribute("href")` | 取属性 | 拿链接 |
| `WebDriverWait(driver, 10)` | 显式等待 | 配 `until` |
| `EC.presence_of_element_located` | 等待条件：元素出现 | 常用 |
| `driver.execute_script(js)` | 执行 JavaScript | 滚动、取数据 |
| `driver.quit()` | 关闭并释放驱动 | 必须调用 |

## 代码示例

```python
# pip install selenium
# Selenium 4.6+ 通常自动管理驱动，无需手动下载 chromedriver
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 1) 启动浏览器（无头模式可在后台跑）
options = webdriver.ChromeOptions()
options.add_argument("--headless=new")        # 无界面，服务器适用
options.add_argument("--no-sandbox")

driver = webdriver.Chrome(options=options)
try:
    driver.get("https://www.baidu.com")

    # 2) 显式等待：最多 10 秒直到输入框出现
    wait = WebDriverWait(driver, 10)
    search_box = wait.until(
        EC.presence_of_element_located((By.ID, "kw"))
    )

    # 3) 输入关键词并提交
    search_box.send_keys("Python selenium")
    search_box.submit()

    # 4) 等结果标题出现，抓取文本
    title = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h3"))
    )
    print("首个结果标题:", title.text)

    # 5) 执行 JS：把页面滚到底
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    # 6) 截图保存
    driver.save_screenshot("result.png")
    print("已截图 result.png")
finally:
    driver.quit()          # 无论是否出错都要关闭，避免进程泄漏
```

## 易错点
- 忘记 `driver.quit()` 会残留浏览器进程，内存越占越多。
- 页面动态加载时直接 `find_element` 会找不到，必须用 `WebDriverWait`。
- `find_element`（单数）找不到会抛异常，`find_elements`（复数）返回空列表，用途不同。
- XPath 写太长太脆，优先用 ID、CSS 选择器，稳定性更高。
- 无头模式某些网站会检测并拒绝，需要设置 `User-Agent` 或改用有头。
- 频繁请求会被封 IP 或触发验证码，注意加延时、控制频率。
- Selenium 慢，纯静态页面用 `requests + BeautifulSoup` 即可，不必上重武器。
