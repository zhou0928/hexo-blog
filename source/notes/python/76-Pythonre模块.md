---
title: "Python re 模块"
tags: [正则]
group: 高级
date: 2026-09-10 00:00:00
---

# Python re 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`re` 模块用正则表达式做字符串的查找、匹配、替换和分割，`search` 找第一个、`findall` 找全部、`sub` 替换。

## 要点

- 四个最常用的查找函数：`match`（从头匹配）、`search`（任意位置找第一个）、`findall`（返回全部列表）、`finditer`（返回迭代器）。
- `sub(pattern, repl, s)` 替换、`split(pattern, s)` 按模式分割。
- `compile(pattern)` 预编译，重复使用时更快、更清晰。
- 匹配结果 `Match` 对象：`group()` 取整体，`group(n)` 取第 n 组，`groups()` 取所有组元组。
- 括号 `()` 是**捕获分组**，`(?:...)` 是非捕获分组。
- 命名分组 `(?P<name>...)`，用 `group('name')` 取。
- 常用函数标志 `flags`：`re.I` 忽略大小写、`re.M` 多行、`re.S` 让 `.` 匹配换行。
- 默认**贪婪**匹配（尽量多），加 `?` 变非贪婪（如 `.*?`）。
- 原始字符串 `r'\d+'` 写正则，避免反斜杠被 Python 二次转义。
- `match` 只从开头匹配，位置不对就返回 `None`，别和 `search` 混用。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `re.match(p, s)` | 从开头匹配，失败返回 None | `re.match(r'\d+', '123abc')` |
| `re.search(p, s)` | 找第一个匹配 | `re.search(r'\d+', 'ab12cd')` |
| `re.findall(p, s)` | 返回所有匹配的列表 | `re.findall(r'\d+', 'a1b22')` |
| `re.finditer(p, s)` | 返回 Match 迭代器 | 适合大文本 |
| `re.sub(p, repl, s)` | 替换匹配部分 | `re.sub(r'\d+', '#', 'a1b2')` |
| `re.sub(p, func, s)` | 用函数动态替换 | 回调返回替换串 |
| `re.split(p, s)` | 按模式分割 | `re.split(r'[,;]', 'a,b;c')` |
| `re.compile(p)` | 预编译模式 | `pat = re.compile(r'\d+')` |
| `pat.match(s)` / `pat.search(s)` | 用已编译模式匹配 | 复用更快 |
| `m.group()` | 整个匹配串 | `'2026'` |
| `m.group(1)` | 第 1 个捕获组 | 括号内容 |
| `m.groups()` | 所有组的元组 | `('a', 'b')` |
| `m.start()` / `m.end()` | 匹配起止位置 | 下标 |
| `re.escape(s)` | 转义正则特殊字符 | 用户输入做字面匹配 |
| `re.I` / `re.M` / `re.S` | 忽略大小写 / 多行 / 点匹配换行 | `re.findall(p, s, re.I)` |

### 常用正则符号

| 符号 | 含义 | 示例 |
|---|---|---|
| `.` | 任意字符（默认不含换行） | `a.c` |
| `\d` / `\D` | 数字 / 非数字 | `\d+` |
| `\w` / `\W` | 字母数字下划线 / 反之 | `\w+` |
| `\s` / `\S` | 空白 / 非空白 | `\s+` |
| `^` / `$` | 行首 / 行尾 | `^\d` |
| `*` / `+` / `?` | 0次+ / 1次+ / 0或1次 | `a*` `a+` `a?` |
| `{m,n}` | 重复 m 到 n 次 | `\d{2,4}` |
| `[]` | 字符集 | `[aeiou]` |
| `\|` | 或 | `cat\|dog` |
| `()` | 捕获分组 | `(\d+)-(\d+)` |

## 代码示例

```python
import re

s = '张三:13800138000, 李四:13900139000'

# 1. search：找第一个
m = re.search(r'\d{11}', s)
print(m.group())                     # 13800138000

# 2. findall：找全部
print(re.findall(r'\d{11}', s))      # ['13800138000', '13900139000']

# 3. match：必须从头匹配
print(re.match(r'\d+', s))           # None（开头是“张”）
print(re.match(r'\d+', '123abc').group())  # 123

# 4. 分组提取：日期拆年月日
m = re.search(r'(\d{4})-(\d{2})-(\d{2})', '今天是 2026-09-10')
print(m.group(0))                    # 2026-09-10
print(m.group(1), m.group(2))        # 2026 09
print(m.groups())                    # ('2026', '09', '10')

# 5. 命名分组
m = re.search(r'(?P<y>\d{4})-(?P<m>\d{2})', '2026-09')
print(m.group('y'), m.group('m'))    # 2026 09

# 6. sub 替换（支持函数动态替换）
masked = re.sub(r'\d{11}', '***********', s)
print(masked)

def up(match):
    return match.group().upper()
print(re.sub(r'\w+', up, 'hello world'))   # HELLO WORLD

# 7. split 分割
print(re.split(r'[,;]\s*', 'a,b; c'))      # ['a', 'b', 'c']

# 8. 编译复用 + 标志
pat = re.compile(r'python', re.I)
print(pat.findall('Python and PYTHON'))    # ['Python', 'PYTHON']

# 9. 贪婪 vs 非贪婪
html = '<b>粗</b><i>斜</i>'
print(re.findall(r'<.*>', html))           # 贪婪：整串
print(re.findall(r'<.*?>', html))          # 非贪婪：逐个标签
```

## 易错点

- `match` 只从开头匹配，想“任意位置找”要用 `search`；两者忘了判 `None` 就 `.group()` 会崩。
- 正则字符串不加 `r` 前缀，`\d`、`\b` 等可能被 Python 转义，写法出错。
- 贪婪匹配吃太多：`.*` 配到最后一个，需要时改成 `.*?`。
- 用 `re.sub` 替换串里有 `\1`、`\g<name>` 时语义特殊，普通反斜杠要 `re.escape` 或双写。
- `.` 默认不匹配换行，跨行匹配要加 `re.S`。
- 分组括号改变 `findall` 结果：有分组时返回的是组内容而非整体。
- 用用户输入直接当正则，特殊字符会破坏匹配或引发灾难性回溯，先 `re.escape`。
- `re.match` 和 `re.fullmatch` 不同：前者匹配前缀即可，后者要求整串完全匹配。
