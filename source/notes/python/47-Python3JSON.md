---
title: "Python3 JSON"
tags: [数据格式]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 JSON

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

JSON 是轻量级数据交换格式，Python 用标准库 `json` 在 Python 对象与 JSON 字符串之间转换：`json.dumps()` 序列化、`json.loads()` 反序列化。

## 要点

- JSON 语法：对象 `{"key": value}`、数组 `[...]`、字符串、数字、布尔、`null`；键必须双引号。
- 类型对应：`dict ↔ 对象`，`list/tuple ↔ 数组`，`str ↔ 字符串`，`int/float ↔ 数字`，`True/False ↔ true/false`，`None ↔ null`。
- `dumps` 带参数控制格式：`indent` 缩进、`ensure_ascii=False` 保留中文、`sort_keys` 排序、`separators` 紧凑。
- `loads` 解析字符串；`load`/`dump` 直接读写文件。
- 中文默认被转成 `\uXXXX`，加 `ensure_ascii=False` 输出原始中文。
- 不支持的 Python 类型（datetime、自定义对象）默认会报错，需传 `default` 参数自定义转换。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `json.dumps(obj)` | Python 对象 → JSON 字符串 | `s = json.dumps({'a': 1})` |
| `json.dumps(obj, indent=2)` | 带缩进美化输出 | `json.dumps(data, indent=2)` |
| `json.dumps(obj, ensure_ascii=False)` | 保留中文不转义 | `json.dumps(d, ensure_ascii=False)` |
| `json.dumps(obj, sort_keys=True)` | 键按字母排序 | `json.dumps(d, sort_keys=True)` |
| `json.loads(json_str)` | JSON 字符串 → Python 对象 | `d = json.loads('{"a":1}')` |
| `json.dump(obj, file)` | 对象写入 JSON 文件 | `json.dump(data, f, ensure_ascii=False)` |
| `json.load(file)` | 从 JSON 文件读取 | `data = json.load(f)` |
| `json.loads(s, parse_float=...)` | 自定义数字解析 | `parse_int=int` 等 |
| `default` 参数 | 处理不可序列化类型 | `json.dumps(d, default=str)` |

## 代码示例

```python
import json

# 1. 基本转换
data = {
    'name': '张三',
    'age': 25,
    'skills': ['Python', 'SQL'],
    'is_admin': False,
    'score': 88.5,
    'remark': None
}

json_str = json.dumps(data)
print(json_str)                     # {"name": "\u5f20\u4e09", ...} 中文被转义

# 2. 保留中文 + 美化
pretty = json.dumps(data, ensure_ascii=False, indent=2)
print(pretty)

# 3. 反序列化
d = json.loads('{"name": "Tom", "age": 20}')
print(d['name'], d['age'])          # Tom 20
print(type(d))                      # <class 'dict'>

# 4. 读写文件
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open('data.json', 'r', encoding='utf-8') as f:
    loaded = json.load(f)
print(loaded['name'], loaded['skills'])

# 5. 处理不可序列化类型（如 datetime）
from datetime import datetime
now = {'time': datetime.now()}
s = json.dumps(now, default=str)    # default=str 转成字符串
print(s)
```

## 易错点

- JSON 的键必须是双引号 `"key"`，单引号字符串会 `json.loads` 报错（`JSONDecodeError`）。
- 字典的键若不是字符串（如 int）会被自动转成字符串；`True` 变 `true`、`None` 变 `null`，注意大小写。
- 元组序列化后变数组（list），`loads` 回来是 list 不是 tuple。
- 解析失败会抛 `json.JSONDecodeError`，对不可信输入要 try/except。
- 读文件要指定 `encoding='utf-8'`，否则中文可能乱码。
- 默认 `ensure_ascii=True`，忘设 `False` 时中文显示为 `\uXXXX`（用于传输没问题，但可读性差）。
