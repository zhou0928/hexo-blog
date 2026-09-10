---
title: "Python PyQt"
tags: [GUI]
group: 高级
date: 2026-09-10 00:00:00
---

# Python PyQt

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

PyQt 是把 Qt 桌面 GUI 框架绑定到 Python 的库，用控件（Widget）搭界面、用信号槽响应用户操作。

## 要点

- 安装：`pip install PyQt5`（或 `PyQt6`），导入方式和类名在 5/6 之间略有差异。
- 每个程序都要一个 `QApplication` 实例，它是应用入口和事件循环的载体。
- 窗口从 `QWidget`（通用容器）或 `QMainWindow`（带菜单栏/状态栏）继承。
- 控件用布局管理器（`QVBoxLayout`、`QHBoxLayout`、`QGridLayout`）摆放，不要靠绝对坐标。
- **信号与槽**是核心：`控件.信号.connect(处理函数)`，用户点按钮时自动调用函数。
- `app.exec_()`（PyQt5）/ `app.exec()`（PyQt6）启动事件循环，程序在此阻塞直到窗口关闭。
- 用 `QTimer` 定时、`QMessageBox` 弹提示、`QLineEdit` 输入、`QLabel` 显示文本。
- 界面更新必须在主线程做；耗时任务放 `QThread`，通过信号回传结果。

## 语法 / 常用方法

| 语法/类 | 说明 | 示例 |
|---|---|---|
| `QApplication([])` | 应用实例（必需） | `app = QApplication(sys.argv)` |
| `QWidget()` | 基础窗口/容器 | `w = QWidget()` |
| `QMainWindow()` | 主窗口（含菜单栏） | 复杂应用用 |
| `setWindowTitle(title)` | 设置标题 | `w.setWindowTitle('标题')` |
| `resize(w, h)` | 设置尺寸 | `w.resize(400, 300)` |
| `QLabel('text')` | 文本标签 | 显示文字 |
| `QPushButton('btn')` | 按钮 | `.clicked.connect(fn)` |
| `QLineEdit()` | 单行输入框 | `.text()` 取值 |
| `QVBoxLayout()` | 垂直布局 | `.addWidget(w)` |
| `QHBoxLayout()` | 水平布局 | 横向排列 |
| `QGridLayout()` | 网格布局 | `.addWidget(w, r, c)` |
| `setLayout(layout)` | 应用布局 | `w.setLayout(vbox)` |
| `widget.signal.connect(fn)` | 连接信号槽 | `btn.clicked.connect(fn)` |
| `QTimer()` | 定时器 | `.timeout.connect(fn)` |
| `QMessageBox.information(...)` | 信息弹窗 | 提示用户 |
| `w.show()` | 显示窗口 | 显示 |
| `app.exec_()` | 启动事件循环 | 程序阻塞在此 |
| `sys.exit(app.exec_())` | 正常退出 | 主函数结尾 |

## 代码示例

```python
# pip install PyQt5
import sys
from PyQt5.QtWidgets import (
    QApplication, QWidget, QLabel, QPushButton,
    QLineEdit, QVBoxLayout, QMessageBox
)

# 1. 定义窗口类
class MyWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('我的第一个 PyQt 窗口')   # 标题
        self.resize(320, 200)                          # 尺寸

        # 2. 创建控件
        self.label = QLabel('请输入名字：')
        self.input = QLineEdit()
        self.input.setPlaceholderText('这里输入')
        self.button = QPushButton('打招呼')

        # 3. 布局：垂直摆放
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.input)
        layout.addWidget(self.button)
        self.setLayout(layout)

        # 4. 信号槽：点击按钮 → 调用 on_click
        self.button.clicked.connect(self.on_click)

    def on_click(self):
        name = self.input.text().strip() or '陌生人'
        self.label.setText(f'你好，{name}！')          # 更新标签
        QMessageBox.information(self, '提示', f'欢迎 {name}')  # 弹窗

# 5. 主流程
if __name__ == '__main__':
    app = QApplication(sys.argv)     # 必须有
    window = MyWindow()
    window.show()                    # 显示窗口
    sys.exit(app.exec_())            # 进入事件循环
```

## 易错点

- 忘了创建 `QApplication`，控件无法工作甚至直接崩溃。
- PyQt5 用 `exec_()`，PyQt6 改成 `exec()`；写混会报 `AttributeError`。
- 用绝对坐标 `move()` 摆控件，窗口缩放就错乱，应该用布局管理器。
- 槽函数忘了 `connect`，或信号名写错（如 `click` vs `clicked`），点了没反应。
- 耗时操作直接放主线程会让界面“未响应”，要用 `QThread` 或 `QTimer` 异步。
- 子线程中直接改 UI 会崩溃，必须通过信号把更新发回主线程执行。
- 跨版本 API 有差异（枚举写法、模块路径），换 PyQt6 时注意导入和常量变化。
