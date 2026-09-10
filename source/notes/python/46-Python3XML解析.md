---
title: "Python3 XML 解析"
tags: [数据格式]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 XML 解析

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

XML 是标记语言，Python 用标准库 `xml.dom.minidom`、`xml.sax`、`xml.etree.ElementTree`（常用）解析 XML 文档，读取和生成 XML 数据。

## 要点

- XML 结构：声明 + 根元素 + 子元素 + 属性 + 文本，标签成对，区分大小写。
- 三种解析方式：
  - **SAX**：事件驱动流式解析，占用内存小，适合大文件，但只能向前读、不能回溯。
  - **DOM**：一次性载入构建树，可任意读写，简单直观但大文件占内存。
  - **ElementTree**：介于两者之间，轻量树形 API，日常最常用。
- `ElementTree` 用法：`parse`/`fromstring` 得到根 `Element`，`find`/`findall` 按路径找子元素，`iter` 遍历所有元素，`.text` 取文本，`.attrib` 取属性。
- 也可用第三方库 `lxml`（更快、支持 XPath），需要 `pip install lxml`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `xml.etree.ElementTree.parse(file)` | 解析 XML 文件，返回 ElementTree | `tree = ET.parse('data.xml')` |
| `tree.getroot()` | 获取根元素 | `root = tree.getroot()` |
| `ET.fromstring(xml_str)` | 从字符串解析，返回根元素 | `root = ET.fromstring(xml_str)` |
| `elem.tag` / `elem.text` / `elem.attrib` | 标签名 / 文本 / 属性字典 | `elem.tag`、`elem.get('id')` |
| `elem.find('子标签')` | 找第一个匹配的直接子元素 | `elem.find('name')` |
| `elem.findall('子标签')` | 找所有匹配子元素 | `elem.findall('item')` |
| `elem.iter('标签')` | 递归遍历所有匹配元素 | `for e in root.iter('price')` |
| `elem.get('属性名', default)` | 取元素属性 | `elem.get('id')` |
| `ET.Element('标签')` | 创建新元素 | `item = ET.Element('item')` |
| `ET.SubElement(parent, '标签')` | 创建子元素 | `ET.SubElement(item, 'name')` |
| `elem.set('attr', value)` / `elem.text = ...` | 设置属性 / 文本 | `item.set('id','1')` |
| `ET.tostring(elem, encoding='utf-8')` | 序列化为字节 | `data = ET.tostring(root, encoding='utf-8')` |
| `ET.indent(tree)` | 美化缩进（Python 3.9+） | `ET.indent(tree)` |
| `minidom.parse(file)` / `.getElementsByTagName('tag')` | DOM 解析 / 按标签取节点 | `doc.getElementsByTagName('name')[0].firstChild.data` |

## 代码示例

```python
import xml.etree.ElementTree as ET

xml_data = '''<?xml version="1.0" encoding="utf-8"?>
<bookstore>
    <book category="python">
        <title>Python 入门</title>
        <price>59.9</price>
    </book>
    <book category="web">
        <title>HTML 教程</title>
        <price>39.9</price>
    </book>
</bookstore>
'''

# 1. 从字符串解析
root = ET.fromstring(xml_data)
print('根标签:', root.tag)

# 2. 遍历所有 book
for book in root.findall('book'):
    title = book.find('title').text
    price = book.find('price').text
    cat = book.get('category')          # 取属性
    print(f'{title} ({cat}) ￥{price}')

# 3. 递归找所有 price 文本
prices = [e.text for e in root.iter('price')]
print('所有价格:', prices)

# 4. 创建并写出新 XML
new_root = ET.Element('shop')
item = ET.SubElement(new_root, 'item')
item.set('id', '1')
ET.SubElement(item, 'name').text = '笔记本'
ET.SubElement(item, 'qty').text = '10'

tree = ET.ElementTree(new_root)
ET.indent(tree)                         # 美化（Python 3.9+）
tree.write('shop.xml', encoding='utf-8', xml_declaration=True)
print(ET.tostring(new_root, encoding='unicode'))
```

## 易错点

- `find`/`findall` 只找**直接子元素**，深层匹配要用 `iter` 或 XPath 路径（如 `find('.//price')`）。
- 属性要用 `get('attr')`，不是 `.text`；文本在 `.text` 里，属性在 `.attrib` 里，别搞混。
- XML 大小写敏感，`<Book>` 和 `<book>` 是两个标签。
- 解析外部输入时要防 XXE 漏洞，避免解析不可信含外部实体的 XML。
- 写中文 XML 记得 `encoding='utf-8'`，否则报错或乱码。
- `findall` 返回空列表表示没匹配，`find` 返回 None，先判空再取 `.text` 否则抛 AttributeError。
