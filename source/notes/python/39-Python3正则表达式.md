---
title: "Python3 正则表达式"
tags: [正则]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 正则表达式

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

正则表达式（regex）是用特殊符号描述字符串匹配规则的表达式，配合 `re` 模块完成查找、替换、分割、提取等文本处理。

## 要点

- 核心模块是 `re`，使用前 `import re`。
- 普通字符匹配自身，元字符有特殊含义。
- 常用操作：`match`（从开头匹配）、`search`（扫描全文找第一个）、`findall`（找全部）、`sub`（替换）、`split`（分割）。
- 贪婪匹配默认取最长，加 `?` 变非贪婪（懒惰）匹配。
- 编译正则可提升重复使用的性能：`re.compile()`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `.` | 匹配任意字符（除换行） | `a.c` 匹配 `abc` |
| `^` / `$` | 匹配开头 / 结尾 | `^py`、`py$` |
| `*` / `+` / `?` | 前一个字符 0 次或多次 / 1 次或多次 / 0 次或 1 次 | `ab*c` |
| `{n}` / `{n,m}` | 前一个字符恰好 n 次 / n 到 m 次 | `a{2,3}` |
| `[]` | 字符集合，匹配其中一个 | `[abc]`、`[0-9]`、`[^0-9]` |
| `\d` / `\D` | 数字 / 非数字 | `\d+` 匹配整数 |
| `\w` / `\W` | 字母数字下划线 / 非 | 等价 `[A-Za-z0-9_]` |
| `\s` / `\S` | 空白字符 / 非空白 | 空格、`\t`、`\n` |
| `\b` | 单词边界 | `\bcat\b` |
| `\|` | 或 | `cat\|dog` |
| `(...)` | 分组，可用 `\1` 引用，`(?:...)` 不捕获 | `(ab)+` |
| `(?P<name>...)` | 命名分组 | `(?P<year>\d{4})` |
| 修饰符 `re.I` | 忽略大小写 | `re.search('py', s, re.I)` |
| 修饰符 `re.M` | 多行匹配，`^` `$` 作用于每行 | `re.findall('^a', s, re.M)` |
| 修饰符 `re.S` | 让 `.` 匹配换行 | `re.search('a.b', s, re.S)` |
| `re.match(pattern, s)` | 从开头匹配，返回 Match 对象或 None | `re.match(r'\d+', '123abc')` |
| `re.search(pattern, s)` | 全文搜索第一个匹配 | `re.search(r'\d+', 'a1b2')` |
| `re.findall(pattern, s)` | 返回所有匹配的列表 | `re.findall(r'\d', 'a1b2')` |
| `re.sub(pattern, repl, s)` | 替换所有匹配 | `re.sub(r'\d', '#', 'a1')` |
| `re.split(pattern, s)` | 按匹配分割 | `re.split(r'\s+', 'a b  c')` |
| `re.compile(pattern)` | 编译正则返回 Pattern 对象 | `p = re.compile(r'\d+')` |

## 代码示例

```python
import re

s = '联系方式: 138-1234-5678, 邮箱: tom@example.com'

# search: 找第一个电话号码
m = re.search(r'\d{3}-\d{4}-\d{4}', s)
print(m.group())          # 138-1234-5678
print(m.span())           # (5, 17) 匹配位置

# findall: 找所有数字
print(re.findall(r'\d+', s))   # ['138', '1234', '5678', '123', '4567', '890']

# 分组提取
m = re.search(r'(\w+)@(\w+\.\w+)', s)
print(m.group(1), m.group(2))  # tom example.com

# 命名分组
m = re.search(r'(?P<name>\w+)@(?P<domain>\w+\.\w+)', s)
print(m.group('domain'))       # example.com

# 替换: 隐藏手机号中间四位
masked = re.sub(r'(\d{3})-(\d{4})-(\d{4})', r'\1-****-\3', s)
print(masked)                  # 联系方式: 138-****-5678, ...

# 分割: 按任意空白拆分
print(re.split(r'\s+', 'python  is   great'))  # ['python', 'is', 'great']

# 编译后复用 + 非贪婪
p = re.compile(r'<.+?>')   # 非贪婪，只匹配一个标签
print(p.findall('<a>text</a>'))   # ['<a>', '</a>']
```

## 易错点

- `re.match` 只从字符串**开头**匹配，中间有匹配要用 `re.search`。
- 正则字符串前加 `r`（原始字符串），否则 `\d` 等会被 Python 转义处理。
- `*` 和 `+` 默认贪婪：`<.+>` 会吞掉多个标签，需要时加 `?`。
- `findall` 带分组时返回的是**分组元组**而非完整匹配：`re.findall(r'(\d+)-(\d+)', s)` 返回 `[('138','1234'),...]`。
- `\w` 只含字母数字下划线，匹配中文用 `[\u4e00-\u9fa5]` 或 `re.UNICODE` 下直接用 `\w` 之外的字符类。
- 反斜杠在普通字符串里是转义符，忘加 `r` 容易报 `bad escape` 或行为异常。
