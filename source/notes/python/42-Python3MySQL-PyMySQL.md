---
title: "Python3 MySQL(PyMySQL)"
tags: [数据库]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 MySQL(PyMySQL)

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

PyMySQL 是纯 Python 写的 MySQL 客户端库，安装后用 `pymysql.connect()` 连接 MySQL，用法与 mysql-connector 基本一致。

## 要点

- 安装：`pip install PyMySQL`，纯 Python 实现，无需编译。
- `pymysql.connect()` 返回连接对象，参数：host、user、password、database、charset。
- 连接时建议指定 `charset='utf8mb4'`，否则中文可能乱码。
- 写操作（增删改）后必须 `conn.commit()`，否则不生效。
- 查询结果默认返回元组；`pymysql.cursors.DictCursor` 可返回字典。
- 占位符同样是 `%s`，参数化防注入。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `pymysql.connect(host, user, password, database, charset)` | 建立连接 | `conn = pymysql.connect(host='localhost', user='root', password='123456', database='test', charset='utf8mb4')` |
| `conn.cursor()` | 创建游标 | `cur = conn.cursor()` |
| `conn.cursor(cursor=pymysql.cursors.DictCursor)` | 字典游标，行返回 dict | `cur = conn.cursor(cursor=pymysql.cursors.DictCursor)` |
| `cur.execute(sql, params)` | 执行 SQL | `cur.execute("SELECT * FROM t WHERE id=%s", (1,))` |
| `cur.executemany(sql, seq)` | 批量执行 | `cur.executemany("INSERT ... VALUES(%s,%s)", [(1,'a'),(2,'b')])` |
| `cur.fetchone()` | 取一行 | `row = cur.fetchone()` |
| `cur.fetchmany(n)` | 取 n 行 | `rows = cur.fetchmany(10)` |
| `cur.fetchall()` | 取全部行 | `rows = cur.fetchall()` |
| `cur.rowcount` | 受影响行数 | `print(cur.rowcount)` |
| `conn.commit()` / `conn.rollback()` | 提交 / 回滚事务 | `conn.commit()` |
| `conn.ping(reconnect=True)` | 检查连接是否有效，断线自动重连 | `conn.ping(reconnect=True)` |
| `pymysql.err.IntegrityError` | 唯一键冲突等完整性错误 | `except pymysql.err.IntegrityError` |

## 代码示例

```python
import pymysql

# 1. 连接
conn = pymysql.connect(
    host='localhost',
    user='root',
    password='123456',
    database='test',
    charset='utf8mb4'
)
cur = conn.cursor()

try:
    # 2. 建表
    cur.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(100),
            price DECIMAL(10,2)
        )
    """)

    # 3. 插入 + 提交
    cur.execute("INSERT INTO books (title, price) VALUES (%s, %s)", ('Python 入门', 59.9))
    conn.commit()
    print('新书 ID:', cur.lastrowid)

    # 4. 查询（字典形式）
    cur = conn.cursor(cursor=pymysql.cursors.DictCursor)
    cur.execute("SELECT id, title, price FROM books")
    for row in cur.fetchall():
        print(row['title'], row['price'])   # 用字段名取值

    # 5. 删除 + 事务回滚演示
    try:
        cur.execute("DELETE FROM books WHERE id = %s", (999,))  # 不存在的行
        conn.commit()
    except Exception:
        conn.rollback()

finally:
    cur.close()
    conn.close()
```

## 易错点

- 参数名是 `password` 不是 `passwd`（和 mysql-connector 不同）。
- 忘 `commit()` 导致数据不写入；查询语句则不需要 commit。
- 中文乱码：连接参数必须带 `charset='utf8mb4'`。
- `%s` 占位符不支持 `%d` 等格式化写法，全部用 `%s`。
- 事务要成对使用：要么 commit 要么 rollback，避免连接挂着未提交事务。
- 字典游标要在**执行查询前**创建，否则拿到的还是元组。
