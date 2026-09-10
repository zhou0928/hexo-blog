---
title: "Python3 字符串"
tags: [数据类型, 容器, 字符串]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 字符串

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
字符串是用引号包裹的不可变字符序列，支持索引、切片、格式化，并内置大量处理方法。

## 要点
- **四种写法**：单引号 `'...'`、双引号 `"..."`、三引号 `'''...'''` / `"""..."""`（可跨行）。
- **不可变**：任何“修改”方法都返回新字符串，原字符串不变。想改只能重新赋值。
- **索引/切片**：`s[0]` 取字符，`s[-1]` 取最后；`s[a:b]` 左闭右开，`s[::-1]` 反转。
- **转义字符**：`\n` 换行、`\t` 制表、`\\` 反斜杠、`\'` 引号；原始字符串 `r"..."` 不转义。
- **三种格式化**：`%` 老式、`str.format()`、`f-string`（3.6+，推荐，最简洁）。
- **常用运算符**：`+` 拼接、`*` 重复、`in` 判断子串、`==` 比较内容。
- **编码**：`str.encode()` → bytes，`bytes.decode()` → str，默认 UTF-8。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `s[i]` / `s[a:b:c]` | 索引 / 切片（步长 c） | `"abcde"[1:4]` → `"bcd"` |
| `s[::-1]` | 反转字符串 | `"abc"[::-1]` → `"cba"` |
| `len(s)` | 长度 | `len("你好")` → 2 |
| `+` / `*` | 拼接 / 重复 | `"a" * 3` → `"aaa"` |
| `in` / `not in` | 子串判断 | `"ab" in "abc"` → True |
| `s.upper()` / `s.lower()` | 全大写 / 全小写 | `"Ab".upper()` → `"AB"` |
| `s.strip([chars])` | 去除两端空白（或指定字符） | `"  x  ".strip()` → `"x"` |
| `s.split(sep, maxsplit)` | 按分隔符切片成列表 | `"a,b".split(",")` → `['a','b']` |
| `"sep".join(iter)` | 用分隔符拼接可迭代对象 | `"-".join(["a","b"])` → `"a-b"` |
| `s.replace(old, new, n)` | 替换（最多 n 次） | `"aaa".replace("a","b",2)` → `"bba"` |
| `s.find(sub)` / `s.rfind(sub)` | 首次 / 最后一次出现的索引，无返回 -1 | `"abc".find("b")` → 1 |
| `s.index(sub)` | 同 find，找不到抛 ValueError | `"abc".index("b")` → 1 |
| `s.count(sub)` | 子串出现次数 | `"aaa".count("a")` → 3 |
| `s.startswith(p)` / `s.endswith(p)` | 是否以 p 开头 / 结尾 | `"ab".startswith("a")` → True |
| `s.capitalize()` | 首字母大写，其余小写 | `"hi There".capitalize()` → `"Hi there"` |
| `s.title()` | 每个单词首字母大写 | `"hi there".title()` → `"Hi There"` |
| `s.swapcase()` | 大小写互换 | `"Ab".swapcase()` → `"aB"` |
| `s.center(w, fill)` | 居中填充 | `"x".center(5,"-")` → `"--x--"` |
| `s.ljust(w)` / `s.rjust(w)` | 左 / 右对齐填充 | `"x".rjust(3,"0")` → `"00x"` |
| `s.zfill(w)` | 左侧补 0 | `"5".zfill(3)` → `"005"` |
| `s.isdigit()` / `s.isalpha()` / `s.isalnum()` | 是否全数字 / 字母 / 字母数字 | `"12".isdigit()` → True |
| `s.isspace()` / `s.isupper()` / `s.islower()` | 是否全空白 / 大写 / 小写 | `"  ".isspace()` → True |
| `s.partition(sep)` | 按首个 sep 切成三元组 | `"a=b".partition("=")` → `('a','=','b')` |
| `s.format(*a, **k)` | 格式化 | `"{} {}".format("a","b")` |
| `f"{x}"` | f-string 格式化 | `f"{3.14159:.2f}"` → `"3.14"` |
| `s.encode()` / `b.decode()` | str↔bytes 编解码 | `"中".encode()` |

## 代码示例

```python
# ---- 创建与切片 ----
s = "Hello, Python"
print(s[0], s[-1])        # H n
print(s[0:5])             # Hello   左闭右开
print(s[7:])              # Python
print(s[::-1])            # nohtyP ,olleH  反转

# ---- 不可变：方法返回新串 ----
t = "abc"
t2 = t.upper()
print(t, t2)              # abc ABC

# ---- 拼接 / 重复 ----
print("Py" + "thon")      # Python
print("-" * 10)           # ----------

# ---- 三种格式化 ----
name, age = "小明", 18
print("我叫 %s，今年 %d 岁" % (name, age))          # 老式 %
print("我叫 {}，今年 {} 岁".format(name, age))      # format
print(f"我叫 {name}，今年 {age} 岁")                # f-string（推荐）
print(f"{3.14159:.2f}")   # 3.14   保留两位小数

# ---- 常用方法 ----
print("  hi  ".strip())           # hi
print("a,b,c".split(","))         # ['a', 'b', 'c']
print(",".join(["1", "2", "3"]))  # 1,2,3
print("abcabc".replace("a", "X")) # XbcXbc
print("abc".find("z"))            # -1   找不到返回 -1
print("Hello".startswith("He"))   # True
print("  ".isspace())             # True

# ---- 多行字符串与转义 ----
text = """第一行
第二行"""
print(text)
print(r"C:\new\test")   # 原始字符串，\n \t 不转义

# ---- 编码 ----
data = "中文".encode("utf-8")
print(data, data.decode("utf-8"))  # b'\xe4\xb8\xad\xe6\x96\x87' 中文
```

## 易错点
- **字符串不可变**：`s[0] = "X"` 会报 `TypeError`，要重新拼接或转列表。
- **切片越界不报错**：`"ab"[10:]` 返回 `""`，但 `"ab"[10]` 索引会报 `IndexError`。
- **`+` 不能拼接非字符串**：`"a" + 1` 报错，用 `"a" + str(1)` 或 f-string。
- **`find` 与 `index` 区别**：找不到时 `find` 返回 `-1`，`index` 抛异常。
- **`split()` 无参数的坑**：`"a  b".split()` 按任意空白分割并去空串，结果 `['a','b']`；`split(" ")` 则保留空串。
- **`strip` 是按字符集剥除**：`"xxabxx".strip("x")` → `"ab"`，不是去前缀。
- **f-string 引号冲突**：3.12 前 `f"{'x'}"` 内外引号不能相同。
