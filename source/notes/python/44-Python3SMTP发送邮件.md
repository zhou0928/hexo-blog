---
title: "Python3 SMTP发送邮件"
tags: [网络与爬虫]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 SMTP发送邮件

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

用 Python 标准库 `smtplib`（负责传输）和 `email`（负责构造邮件内容）通过 SMTP 服务器发送邮件，支持纯文本、HTML 和带附件邮件。

## 要点

- `smtplib.SMTP(host, port)` 连接 SMTP 服务器，`login()` 登录，`sendmail()` 发送。
- 常用 SMTP 服务器：QQ 邮箱 `smtp.qq.com:465(SSL)/587`，163 邮箱 `smtp.163.com:465`，Gmail `smtp.gmail.com:587`。
- 第三方邮箱一般要用**授权码**登录，而不是登录密码。
- 构造邮件用 `email.mime`：`MIMEText`（文本/HTML）、`MIMEImage`（图片）、`MIMEBase`（附件），`MIMEMultipart` 组装多部分。
- 邮件对象设置 `From`、`To`、`Subject` 头，Subject 中文要编码（Python3 自动处理）。
- 发送前建议 `starttls()` 或使用 `SMTP_SSL` 加密，避免明文传输。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `smtplib.SMTP(host, port)` | 建立 SMTP 连接 | `smtp = smtplib.SMTP('smtp.qq.com', 587)` |
| `smtplib.SMTP_SSL(host, port)` | SSL 加密连接（465 端口常用） | `smtp = smtplib.SMTP_SSL('smtp.qq.com', 465)` |
| `smtp.starttls()` | 升级为 TLS 加密 | `smtp.starttls()` |
| `smtp.login(user, password)` | 登录，password 用授权码 | `smtp.login('xx@qq.com', '授权码')` |
| `smtp.sendmail(from, to, msg.as_string())` | 发送邮件，to 可为列表 | `smtp.sendmail(sender, [receiver], msg.as_string())` |
| `smtp.quit()` | 关闭连接 | `smtp.quit()` |
| `email.mime.text.MIMEText(text, 'plain'/'html', 'utf-8')` | 构造文本/HTML 邮件体 | `msg = MIMEText('<h1>hi</h1>', 'html', 'utf-8')` |
| `email.mime.multipart.MIMEMultipart()` | 多部分容器（正文+附件） | `msg = MIMEMultipart()` |
| `msg['From'] / ['To'] / ['Subject']` | 设置邮件头 | `msg['Subject'] = '测试邮件'` |
| `msg.attach(part)` | 添加正文或附件部件 | `msg.attach(mime_text)` |
| `email.header.Header` | 手动编码中文主题（一般用不到） | `Header('标题', 'utf-8')` |

## 代码示例

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# 发件配置（以 QQ 邮箱为例）
sender = 'your@qq.com'
auth_code = '你的授权码'          # 不是登录密码！
receiver = 'target@example.com'

# 1. 构造 HTML 正文
html_body = '<h2>Python SMTP 测试</h2><p>这是一封<strong>HTML</strong>邮件。</p>'
msg = MIMEMultipart()
msg['From'] = sender
msg['To'] = receiver
msg['Subject'] = 'Python 邮件测试'
msg.attach(MIMEText(html_body, 'html', 'utf-8'))

# 2. 添加附件
attachment = MIMEBase('application', 'octet-stream')
with open('report.txt', 'rb') as f:
    attachment.set_payload(f.read())
encoders.encode_base64(attachment)
attachment.add_header('Content-Disposition', 'attachment',
                      filename='report.txt')
msg.attach(attachment)

# 3. 连接 SMTP 服务器并发送
try:
    smtp = smtplib.SMTP_SSL('smtp.qq.com', 465)   # SSL 直连
    smtp.login(sender, auth_code)
    smtp.sendmail(sender, [receiver], msg.as_string())
    print('邮件发送成功')
except smtplib.SMTPException as e:
    print('发送失败:', e)
finally:
    smtp.quit()
```

## 易错点

- 用登录密码登录第三方邮箱会报认证失败，必须用邮箱设置的**授权码**。
- 未开启 SMTP 服务（在邮箱设置里打开）也会认证失败。
- 端口要匹配协议：465 用 `SMTP_SSL`，587 用 `SMTP` + `starttls()`，混用会超时或报错。
- 收件人是列表，但 `msg['To']` 是字符串；多人用逗号拼接字符串。
- 附件中文文件名可能乱码，可手动编码 `filename=('utf-8', '', '中文.txt')`。
- 发送大量邮件容易被服务器限流，发送频率过高会触发封禁。
