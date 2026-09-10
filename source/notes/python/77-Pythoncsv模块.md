---
title: "Python csv 模块"
tags: [数据格式]
group: 高级
date: 2026-09-10 00:00:00
---

# Python csv 模块

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`csv` 模块读写逗号分隔表格文件，`reader`/`writer` 按行处理，`DictReader`/`DictWriter` 按表头字段处理，最省事。

## 要点

- 读用 `csv.reader(f)`，每行是字符串列表；写用 `csv.writer(f)`，用 `writerow` / `writerows`。
- `DictReader` 把每行读成字典（表头当 key）；`DictWriter` 反过来把字典写成行。
- 打开文件务必加 `newline=''`，否则 Windows 下会多出空行。
- 编码显式指定：中文场景写 `encoding='utf-8'`（或带 BOM 的 `utf-8-sig` 让 Excel 正常显示）。
- `delimiter` 换分隔符（如制表符 `\t`）、`quotechar` 定引号、`quoting` 控引用策略。
- 字段里的逗号、引号、换行会被自动加引号转义，不用手动处理。
- 都是字符串，读进来数字要自己 `int()` / `float()` 转换。
- `dialect` 可整体指定方言（如 `excel`、`excel-tab`、`unix`）。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `csv.reader(f)` | 逐行读为列表 | `for row in csv.reader(f)` |
| `csv.writer(f)` | 逐行写列表 | `w.writerow(['a', 'b'])` |
| `w.writerows(rows)` | 一次写多行 | `w.writerows(data)` |
| `csv.DictReader(f)` | 按表头读成字典 | `row['name']` |
| `csv.DictWriter(f, fieldnames)` | 按字段写字典 | `w.writeheader()` |
| `w.writeheader()` | 写表头行 | DictWriter 用 |
| `delimiter=','` | 分隔符 | `delimiter='\t'` |
| `quotechar='"'` | 引用字符 | 含分隔符的字段自动加 |
| `quoting=csv.QUOTE_ALL` | 所有字段都加引号 | 常量 |
| `lineterminator='\n'` | 行终止符 | 写入时用 |
| `dialect='excel-tab'` | 方言 | 制表符分隔 |
| `csv.field_size_limit(n)` | 字段最大长度 | 超长字段调大 |

## 代码示例

```python
import csv

# 1. 写入：writer + writerow / writerows
rows = [
    ['名字', '年龄', '城市'],
    ['张三', 25, '北京'],
    ['李四', 30, '上海, 浦东'],         # 含逗号会被自动加引号
]
with open('people.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(rows[0])                  # 写表头
    w.writerows(rows[1:])                # 写数据

# 2. 读取：reader，每行是列表
with open('people.csv', 'r', newline='', encoding='utf-8') as f:
    for row in csv.reader(f):
        print(row)                       # ['张三', '25', '北京']

# 3. DictReader：按表头读成字典（推荐）
with open('people.csv', 'r', newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        print(row['名字'], int(row['年龄']))   # 字符串手动转数字

# 4. DictWriter：按字段写字典
fields = ['名字', '年龄', '城市']
data = [
    {'名字': '王五', '年龄': 28, '城市': '广州'},
    {'名字': '赵六', '年龄': 35, '城市': '深圳'},
]
with open('out.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=fields)
    w.writeheader()                      # 写表头
    w.writerows(data)

# 5. 自定义分隔符：制表符
with open('tab.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['A', 'B'])

# 6. 让 Excel 正确识别中文：用 utf-8-sig
with open('excel.csv', 'w', newline='', encoding='utf-8-sig') as f:
    csv.writer(f).writerow(['中文', '正常显示'])
```

## 易错点

- `open` 忘了 `newline=''`，Windows 上写出的文件每行之间会多个空行。
- 中文 Excel 打开乱码，多半是编码问题，写入改用 `utf-8-sig`。
- 读到的字段**全是字符串**，直接当数字运算会报错或字符串拼接出错，需显式转换。
- `DictReader` 的表头有重复或缺失时会互相覆盖/丢字段，确保首行唯一。
- 字段里本身含分隔符或换行时，必须靠 csv 的引用机制，手写拼接会破坏格式。
- 用 `DictWriter` 时字段多于 `fieldnames` 会抛异常，多余的键要么加进 `extraaction` 要么先过滤。
- 空行会被 `reader` 解析成空列表 `[]`，遍历时要跳过，避免下标越界。
