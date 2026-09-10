---
title: "Python3 Pycharm"
tags: [基础]
group: 基础
date: 2026-09-10 00:00:00
---

# Python3 Pycharm

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
PyCharm 是 JetBrains 出品的专业 Python IDE，提供智能补全、调试、重构和虚拟环境管理。

## 要点
- **两个版本**：Community（社区版，免费）和 Professional（专业版，支持 Django、远程开发、数据库工具）。
- **官方下载**：https://www.jetbrains.com/pycharm/download/
- **项目与解释器**：新建项目时选择解释器，建议为每个项目创建独立虚拟环境。
- **核心功能**：代码补全、语法高亮、断点调试、运行配置、版本控制集成。
- **快捷键**：提高效率的关键，如运行、重命名、格式化。
- **pip 集成**：可在 Settings 里直接安装、升级、卸载第三方包。
- **调试器**：点击行号旁断点，用 Debug 模式逐行执行、查看变量。

## 语法 / 常用方法

| 操作 | 说明 | 快捷键 (Win / macOS) |
|---|---|---|
| 运行程序 | 运行当前文件 | `Shift+F10` / `Ctrl+R` |
| 调试程序 | 以调试模式启动 | `Shift+F9` / `Ctrl+D` |
| 重命名 | 安全重命名变量/文件 | `Shift+F6` / `Shift+F6` |
| 格式化代码 | 自动排版 | `Ctrl+Alt+L` / `Cmd+Opt+L` |
| 查找 | 全局搜索 | `Ctrl+Shift+F` / `Cmd+Shift+F` |
| 快速修复 | 提示修复建议 | `Alt+Enter` / `Opt+Enter` |
| 注释代码 | 注释/取消注释选中行 | `Ctrl+/` / `Cmd+/` |

## 代码示例

```python
# 在 PyCharm 中新建 hello.py，输入以下代码后按 Shift+F10 运行

def add(a: int, b: int) -> int:
    """两数相加，演示类型注解（PyCharm 会据此提示）"""
    return a + b


def main():
    # 在行号左侧点击可设置断点，用 Debug 模式查看 result
    result = add(3, 5)
    print("3 + 5 =", result)

    # PyCharm 的智能补全：输入对象后按 Ctrl+Space 弹出方法列表
    text = "pycharm"
    print(text.upper())        # 自动补全会提示 .upper()
    print(text.capitalize())


# __name__ 保护：直接运行时才执行 main
if __name__ == "__main__":
    main()


# 演示调试：把断点打在下面循环里，观察 i 与 total 的变化
total = 0
for i in range(1, 6):
    total += i                 # 断点停这里，可单步看变量
print("1~5 求和:", total)
```

## 易错点
- **解释器选错**：项目用的解释器没有目标包时会报 `ModuleNotFoundError`，在 Settings → Project → Python Interpreter 里确认。
- **虚拟环境未激活**：PyCharm 内部运行用的是项目解释器，和终端里的环境可能不一致。
- **社区版功能限制**：社区版不支持 Django、Flask 专属模板和远程调试，按需选版本。
- **断点不生效**：要以 Debug（虫子图标）启动，而不是 Run。
- **索引未完成**：刚打开大项目时补全/跳转可能卡顿，等索引建完即可。
