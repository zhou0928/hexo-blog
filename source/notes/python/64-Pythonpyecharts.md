---
title: "Python pyecharts"
tags: [数据可视化]
group: 高级
date: 2026-09-10 00:00:00
---

# Python pyecharts

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
`pyecharts` 是基于 ECharts 的 Python 可视化库，用几行代码生成交互式 HTML 图表。

## 要点
- 输出的图表是 HTML 页面，可交互（缩放、悬浮提示、图例开关）。
- 所有图表继承自 `Chart`，用 `.add_xaxis()` 加类目、`.add_yaxis()` 加数值。
- 用 `.render("chart.html")` 生成文件，浏览器打开即可看。
- 在 Jupyter 用 `.render_notebook()` 直接内嵌显示。
- 常见图表：柱状 `Bar`、折线 `Line`、饼图 `Pie`、散点 `Scatter`、地图 `Map`。
- 链式调用：设置完直接返回对象，可以一行接一行写。
- 2.x 版本要求 Python 3.6+，安装：`pip install pyecharts`。

## 语法 / 常用方法

| 类 / 方法 | 说明 | 示例 |
|---|---|---|
| `Bar()` | 柱状图对象 | `Bar()` |
| `Line()` | 折线图对象 | `Line()` |
| `Pie()` | 饼图对象 | `Pie()` |
| `Scatter()` | 散点图 | `Scatter()` |
| `add_xaxis(list)` | 添加 X 轴类目 | `add_xaxis(["A","B"])` |
| `add_yaxis(name, data)` | 添加一组数据序列 | `add_yaxis("销量",[1,2])` |
| `set_global_opts(...)` | 全局配置（标题/图例/工具箱） | `title_opts=...` |
| `set_series_opts(...)` | 系列配置（标签/线型） | `label_opts=...` |
| `render(path)` | 输出 HTML 文件 | `render("a.html")` |
| `render_notebook()` | Jupyter 内嵌渲染 | 只在 notebook 用 |
| `opts.TitleOpts` | 标题配置对象 | `title="图"` |
| `Grid` 多图组合 | 上下/左右拼图 | `Grid(init_opts=...)` |

## 代码示例

```python
# pip install pyecharts
from pyecharts import options as opts
from pyecharts.charts import Bar, Line, Pie

# 1) 柱状图：各城市销量
bar = (
    Bar()
    .add_xaxis(["北京", "上海", "广州", "深圳"])
    .add_yaxis("销量", [120, 200, 150, 80])
    .set_global_opts(
        title_opts=opts.TitleOpts(title="城市销量对比"),
        yaxis_opts=opts.AxisOpts(name="件"),
        xaxis_opts=opts.AxisOpts(name="城市"),
    )
)
bar.render("bar.html")          # 生成 HTML，浏览器打开

# 2) 折线图：一周温度
line = (
    Line()
    .add_xaxis(["周一", "周二", "周三", "周四", "周五"])
    .add_yaxis("温度", [20, 22, 19, 25, 23], is_smooth=True)
    .set_global_opts(title_opts=opts.TitleOpts(title="一周温度"))
)
line.render("line.html")

# 3) 饼图：占比
pie = (
    Pie()
    .add("", [("A", 30), ("B", 45), ("C", 25)])
    .set_global_opts(title_opts=opts.TitleOpts(title="占比"))
    .set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {d}%"))
)
pie.render("pie.html")

print("已生成 bar.html / line.html / pie.html")
```

## 易错点
- `add_yaxis` 的数据长度必须与 `add_xaxis` 一致，否则图不显示或报错。
- 输出是 HTML，必须在浏览器打开；`.render()` 不会自动弹窗。
- pyecharts 2.x 与 1.x API 差别大，网上老代码的 `overlap()` 写法可能不兼容。
- 地图、3D、词云等特殊图需要额外安装 `echarts-countries-pypkg` 等扩展包。
- Jupyter 里用 `render_notebook()`，直接 `render()` 只会生成文件不内嵌。
- 中文标题正常，但部分主题需要配置；`render` 路径别写成系统保留目录。
- 静态图片导出（PNG）需额外装 `snapshot-selenium`，默认只出 HTML。
