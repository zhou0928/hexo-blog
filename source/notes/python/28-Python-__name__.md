---
title: "Python __name__"
tags: [模块与工程]
group: 基础
date: 2026-09-10 00:00:00
---

# Python __name__

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

`__name__` 是每个模块的内置变量：直接运行该文件时它等于 `"__main__"`，被别的模块导入时它等于模块名。

## 要点

- 每个 `.py` 文件都有一个 `__name__` 变量。
- 作为**主程序**直接运行时，`__name__ == "__main__"`。
- 被 **import** 时，`__name__` 是该模块的名字（文件名去掉 `.py`）。
- 惯用法：`if __name__ == "__main__":` 只在直接运行时执行测试/入口代码，被导入时不执行。
- 这让一个文件**既可当脚本运行，又可当模块导入**。
- 同理，包内模块的 `__name__` 形如 `包名.模块名`。
- 用 `python -m 包.模块` 运行时，该模块 `__name__` 也是 `"__main__"`。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `__name__` | 模块的内置名字变量 | `print(__name__)` |
| `if __name__ == "__main__":` | 仅直接运行才执行的入口块 | 放主逻辑 |
| `python file.py` | 直接运行，`__name__` 为 `"__main__"` | 执行主线 |
| `import file` | 导入，`__name__` 为 `"file"` | 不执行主线 |
| `__name__`（包内） | 形如 `mypkg.util` | 带包前缀 |
| `python -m mypkg.main` | 以模块方式运行 | `__name__` 为 `"__main__"` |

## 代码示例

```python
# 文件名：demo.py

def main():
    print("我是主程序逻辑")

def add(a, b):
    return a + b

print("模块被加载，__name__ =", __name__)

# 关键惯用法：仅直接运行时执行
if __name__ == "__main__":
    main()          # 只有 python demo.py 才打印
    print(add(1, 2))

# ---------- 运行效果 ----------
# $ python demo.py
# 模块被加载，__name__ = __main__
# 我是主程序逻辑
# 3

# $ python -c "import demo"
# 模块被加载，__name__ = demo
# （main() 不执行）

# 包内模块示例：mypkg/util.py
# print(__name__)   # 结果：mypkg.util
```

## 易错点

- 忘了写 `if __name__ == "__main__":`，导入该模块时会意外执行入口代码。
- 把 `__main__` 写成 `"main"` 或漏下划线，判断恒为 False。
- `__name__` 是字符串 `"__main__"`，比较时注意是双下划线包围。
- 包内相对路径/资源加载会因运行方式（直接运行 vs 导入）不同而失败，用 `__file__` 或 `importlib.resources` 更稳。
- 用 `python -m pkg.mod` 运行时，`__name__` 是 `"__main__"` 而非 `pkg.mod`，程序内取模块名要小心。
