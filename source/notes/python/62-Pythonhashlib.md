---
title: "Python hashlib"
tags: [加密]
group: 高级
date: 2026-09-10 00:00:00
---

# Python hashlib

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`hashlib` 是标准库的哈希/摘要模块，把任意数据算成固定长度的指纹（MD5、SHA-256 等），常用于校验和与密码存储。

## 要点
- 哈希是**单向**的：只能由数据算摘要，不能反推原文。
- 相同输入永远得到相同摘要；输入改一个字节，摘要完全不同（雪崩效应）。
- 支持 `md5`、`sha1`、`sha224`、`sha256`、`sha384`、`sha512`、`blake2b` 等。
- 用法两步：`hashlib.xxx(数据)` 或先 `new()` 再 `update()`，最后 `hexdigest()`。
- 大文件分块读取、反复 `update()`，不必一次性读进内存。
- **安全提醒**：MD5 和 SHA-1 已被证明不安全，别用于密码；存密码用 `bcrypt` / `argon2`。
- 数据必须编码为 `bytes`（`str.encode()`），不能直接传字符串。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `hashlib.md5(data)` | 构造 MD5 哈希对象 | 快速校验，不用于安全 |
| `hashlib.sha256(data)` | 构造 SHA-256 对象 | 推荐，安全级 |
| `hashlib.sha512(data)` | 构造 SHA-512 对象 | 更长摘要 |
| `hashlib.new(name)` | 按名字构造哈希 | `new("sha256")` |
| `h.update(data)` | 追加数据（可分多次） | 大文件分块 |
| `h.hexdigest()` | 返回十六进制字符串 | `'9f86d0…'` |
| `h.digest()` | 返回原始字节摘要 | `b'\x9f\x86…'` |
| `hashlib.algorithms_available` | 当前可用的算法集合 | 查环境支持 |
| `hashlib.file_digest(f, name)` | 直接算文件摘要（3.11+） | 一行算文件哈希 |

## 代码示例

```python
import hashlib

text = "hello python"
b = text.encode("utf-8")                 # 必须先转 bytes

# 1) MD5：32 位十六进制
md5 = hashlib.md5(b).hexdigest()
print(md5)                               # 5c7a3b9d...（固定 32 位）

# 2) SHA-256：64 位十六进制，推荐用于完整性校验
sha = hashlib.sha256(b).hexdigest()
print(sha)                               # 固定 64 位

# 3) 分多次 update，结果与一次性相同
h = hashlib.sha256()
h.update(b"hello ")
h.update(b"python")
print(h.hexdigest() == sha)              # True

# 4) 大文件分块计算，避免吃内存
def file_sha256(path, chunk=8192):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk_data := f.read(chunk):
            h.update(chunk_data)
    return h.hexdigest()

# 5) 加盐存储密码示例（教学用，生产请用 bcrypt/argon2）
import os
salt = os.urandom(16)
pwd_hash = hashlib.sha256(salt + b"my_password").hexdigest()
print("salt:", salt.hex())
print("hash:", pwd_hash)
```

## 易错点
- 传字符串会报 `TypeError`，必须 `"abc".encode("utf-8")`。
- `update()` 是累积的，同一个对象多次 update 等于拼接后再算。
- `hexdigest()` 返回带前导 0 的定长字符串，不要 `int()` 后再格式化，会丢前导零。
- MD5、SHA-1 已被碰撞攻击攻破，不要用于签名或密码。
- 不要自己给密码"加盐"就完事，标准做法用 `bcrypt` 或 `argon2-cffi`。
- 大文件别 `f.read()` 整读，内存会爆，用分块。
