---
title: "Python3 MongoDB"
tags: [数据库]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 MongoDB

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
用 `pymongo` 库连接 MongoDB 文档数据库，对集合做增删改查，数据以类 JSON 的 BSON 文档存储。

## 要点
- MongoDB 是 NoSQL 文档数据库，一条记录就是一个文档（类似字典），无需固定表结构。
- Python 通过第三方库 `pymongo` 操作，先 `pip install pymongo`。
- 层级：数据库 (database) → 集合 (collection) → 文档 (document)。
- `insert_one` / `insert_many` 插入，`find_one` / `find` 查询，`update_*` 改，`delete_*` 删。
- `find` 返回游标，可迭代；条件用字典表达，如 `{"age": {"$gt": 18}}`。
- 连接字符串形如 `mongodb://user:pwd@host:27017/`。

## 语法 / 常用方法

| 方法 | 说明 | 示例 |
|---|---|---|
| `MongoClient(url)` | 建立连接 | `MongoClient("mongodb://localhost:27017/")` |
| `client.db` / `client["db"]` | 选择数据库 | `db = client.test` |
| `db.col` / `db["col"]` | 选择集合 | `col = db.users` |
| `col.insert_one(doc)` | 插入一个文档 | `col.insert_one({"name": "Tom"})` |
| `col.insert_many([...])` | 插入多个文档 | `col.insert_many([{...}, {...}])` |
| `col.find_one(query)` | 查一条 | `col.find_one({"name": "Tom"})` |
| `col.find(query)` | 查多条（游标） | `col.find({"age": {"$gt": 18}})` |
| `col.update_one(q, op)` | 改一条 | `col.update_one({"name": "Tom"}, {"$set": {"age": 20}})` |
| `col.update_many(q, op)` | 改多条 | `col.update_many({}, {"$inc": {"age": 1}})` |
| `col.delete_one(q)` | 删一条 | `col.delete_one({"name": "Tom"})` |
| `col.delete_many(q)` | 删多条 | `col.delete_many({"age": {"$lt": 18}})` |
| `col.count_documents(q)` | 计数 | `col.count_documents({})` |
| `col.drop()` | 删除整个集合 | `col.drop()` |

常用查询操作符：`$gt` 大于、`$lt` 小于、`$in` 属于、`$regex` 正则、`$and`/`$or` 逻辑。

## 代码示例

```python
from pymongo import MongoClient

# 连接（本地默认 27017，无需账号）
client = MongoClient("mongodb://localhost:27017/")
db = client["testdb"]
col = db["users"]

# 增
col.insert_one({"name": "Tom", "age": 18})
col.insert_many([
    {"name": "Jerry", "age": 22},
    {"name": "Lucy", "age": 25},
])

# 查
print(col.find_one({"name": "Tom"}))          # 返回一个 dict
for doc in col.find({"age": {"$gt": 20}}):    # 游标遍历
    print(doc["name"], doc["age"])

# 改：$set 覆盖字段，$inc 自增
col.update_one({"name": "Tom"}, {"$set": {"age": 19}})
col.update_many({}, {"$inc": {"age": 1}})

# 删
col.delete_one({"name": "Lucy"})
col.delete_many({"age": {"$lt": 19}})

print("剩余文档数:", col.count_documents({}))
client.close()   # 用完关闭连接
```

## 易错点
- `find_one` 查不到返回 `None`，直接下标取值会报 `TypeError`，要判空。
- `update` 必须带更新操作符（`$set`/`$inc`），直接传 `{"age": 20}` 会整条替换文档。
- `insert_one` 会往原字典里塞 `_id` 字段，之后再用这个字典可能被污染。
- MongoDB 不自带主键自增，用 `_id`（ObjectId）做主键，返回后可用 `str(result.inserted_id)` 取字符串。
- 每次连接建议复用 `MongoClient`，不要每个操作都新建，它内部自带连接池。
- 中文写入前确认集合编码，默认 UTF-8 一般没问题，但读出来仍是 Python `str`。
