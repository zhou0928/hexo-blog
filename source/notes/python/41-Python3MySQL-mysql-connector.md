---
title: "Python3 MySQL(mysql-connector)"
tags: [数据库]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 MySQL(mysql-connector)

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`mysql-connector-python` 是 MySQL 官方提供的纯 Python 驱动，安装后用 `mysql.connector` 连接 MySQL 并执行增删改查。

## 要点

- 安装：`pip install mysql-connector-python`（官方驱动，纯 Python 实现）。
- 用 `mysql.connector.connect()` 建立连接，参数：host、user、passwd、database。
- `cursor()` 创建游标，用 `cursor.execute(sql)` 执行语句。
- **增删改必须 `conn.commit()`** 才会真正写入数据库；查询不需要。
- 占位符用 `%s`，不要用 f-string 拼 SQL（防注入）。
- 用完记得 `cursor.close()` 和 `conn.close()`；用 `with` 或 try/finally 保证释放。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `mysql.connector.connect(...)` | 建立数据库连接 | `conn = mysql.connector.connect(host='localhost', user='root', passwd='123456', database='test')` |
| `conn.cursor()` | 创建游标对象 | `cur = conn.cursor()` |
| `cur.execute(sql, params)` | 执行单条 SQL，params 为元组/字典 | `cur.execute("INSERT INTO t VALUES(%s,%s)", (1, 'a'))` |
| `cur.executemany(sql, list)` | 批量执行（参数为列表套元组） | `cur.executemany(sql, [(1,'a'),(2,'b')])` |
| `cur.fetchone()` | 取下一行（元组） | `row = cur.fetchone()` |
| `cur.fetchall()` | 取所有行（元组列表） | `rows = cur.fetchall()` |
| `cur.rowcount` | 受影响行数（DML 用） | `print(cur.rowcount)` |
| `cur.lastrowid` | 最后插入的自增 ID | `new_id = cur.lastrowid` |
| `conn.commit()` | 提交事务（写操作后必须调用） | `conn.commit()` |
| `conn.rollback()` | 回滚事务 | `conn.rollback()` |
| `cur.close()` / `conn.close()` | 关闭游标和连接 | `finally: conn.close()` |
| `conn.cursor(dictionary=True)` | 查询结果以字典返回 | `cur = conn.cursor(dictionary=True)` |

## 代码示例

```python
import mysql.connector

# 1. 连接数据库
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    passwd='123456',
    database='test'
)
cur = conn.cursor()

try:
    # 2. 建表
    cur.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(20),
            age INT
        )
    """)

    # 3. 插入（占位符 %s，参数化防注入）
    cur.execute("INSERT INTO students (name, age) VALUES (%s, %s)", ('Tom', 18))
    print('插入成功，ID =', cur.lastrowid)

    # 4. 批量插入
    cur.executemany("INSERT INTO students (name, age) VALUES (%s, %s)",
                    [('Jerry', 19), ('Lucy', 20)])
    conn.commit()   # 写操作必须提交

    # 5. 查询
    cur.execute("SELECT id, name, age FROM students WHERE age > %s", (18,))
    for row in cur.fetchall():
        print(row)          # (1, 'Tom', 18) 元组形式

    # 6. 更新、删除
    cur.execute("UPDATE students SET age = %s WHERE name = %s", (21, 'Lucy'))
    cur.execute("DELETE FROM students WHERE name = %s", ('Jerry',))
    conn.commit()
    print('受影响行数:', cur.rowcount)

except mysql.connector.Error as err:
    conn.rollback()          # 出错回滚
    print('数据库错误:', err)

finally:
    cur.close()
    conn.close()
```

## 易错点

- 忘写 `conn.commit()`：数据看起来"没插入"，这是最常见问题。
- 用字符串拼接 SQL（如 `f"WHERE name='{name}'"`）有 SQL 注入风险，一律用 `%s` 占位符。
- 占位符是 `%s`，不是 MySQL 的 `?`（那是很多其他驱动的写法）。
- `fetchone()` 没有数据时返回 `None`，要先判空再取值。
- 参数化查询时参数必须是元组或列表，单个参数写 `(value,)` 不要漏逗号。
- 连接参数写错（如密码、库名）会抛异常，建议包在 try/except 里并回滚。
