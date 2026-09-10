---
title: "Python 量化"
tags: [量化交易]
group: 高级
date: 2026-09-10 00:00:00
---

# Python 量化

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
用 Python 抓取行情、计算指标、回测策略并自动交易，把投资决策变成可验证的代码流程。

## 要点
- **量化三件事**：数据（行情/财务）、策略（信号规则）、执行（回测或实盘）。
- **主流库**：`pandas` 处理时间序列，`numpy` 数值计算，`matplotlib`/`pyecharts` 画图。
- **行情数据**：`akshare`、`tushare`（A 股免费）、`yfinance`（美股），或券商 API。
- **回测框架**：`backtrader`、`vectorbt`、`bt`；A 股常用 `聚宽`、`米筐` 在线平台。
- **常用指标**：均线（MA）、MACD、RSI、布林带、夏普比率、最大回撤。
- **实盘接口**：聚宽/米筐/券商量化 API，需开通权限并注意风控。
- 回测收益不等于实盘收益，注意滑点、手续费、未来函数与幸存者偏差。
- 仅供学习研究，投资有风险，代码不构成投资建议。

## 语法 / 常用方法

| 库 / 概念 | 说明 | 典型用途 |
|---|---|---|
| `pandas` | 表格与时间序列 | 行情清洗、滚动计算 |
| `numpy` | 数值数组与向量化 | 收益率、矩阵运算 |
| `akshare` | 免费财经数据接口 | 抓 A 股行情/财务 |
| `tushare` | 财经数据（需 token） | 股票、基金数据 |
| `yfinance` | 雅虎财经数据 | 美股/指数 |
| `backtrader` | 事件驱动回测框架 | 写策略回测 |
| `vectorbt` | 向量化高速回测 | 批量参数扫描 |
| `matplotlib` / `pyecharts` | 绘图 | K 线、净值曲线 |
| `TA-Lib` / `pandas_ta` | 技术指标库 | MA、MACD、RSI |
| `rolling().mean()` | 移动平均 | 均线策略核心 |
| 夏普比率 | 收益/波动比 | 评价策略质量 |
| 最大回撤 | 峰值到谷底跌幅 | 风险控制 |

## 代码示例

```python
# pip install pandas numpy
# 用模拟数据演示一个双均线策略的核心逻辑（不含真实交易接口）
import pandas as pd
import numpy as np

np.random.seed(0)

# 1) 构造一段模拟收盘价（真实场景用 akshare/yfinance 获取）
dates = pd.date_range("2024-01-01", periods=200, freq="D")
price = pd.Series(100 + np.random.randn(200).cumsum(), index=dates)

df = pd.DataFrame({"close": price})

# 2) 计算 5 日、20 日移动平均
df["ma5"] = df["close"].rolling(5).mean()
df["ma20"] = df["close"].rolling(20).mean()

# 3) 生成信号：金叉买入(1)，死叉卖出(-1)
df["signal"] = 0
df.loc[df["ma5"] > df["ma20"], "signal"] = 1
df.loc[df["ma5"] <= df["ma20"], "signal"] = -1

# 4) 用信号的位置变化模拟持仓（1 为持有）
df["position"] = df["signal"].diff().clip(lower=0).fillna(0)

# 5) 计算累计收益，对比"买入持有"
df["ret"] = df["close"].pct_change().fillna(0)
strategy_ret = (df["ret"] * df["signal"].shift(1).fillna(0)).cumsum()
print("策略累计收益:", round(strategy_ret.iloc[-1], 4))

# 6) 最大回撤
cum = (1 + df["ret"]).cumprod()
drawdown = (cum / cum.cummax() - 1).min()
print("最大回撤:", round(drawdown, 4))
```

## 易错点
- **未来函数**：用当天收盘价决定当天买入，现实中来不及，回测必须用前一天信号。
- 手续费与滑点不设，回测虚高；A 股还有印花税与涨跌停限制。
- 复权问题：未复权价格遇除权除息会跳空，须用前复权/后复权数据。
- 免费数据源有频率限制或非官方接口，生产勿依赖，注意接口变动。
- `rolling` 会引入前几个 `NaN`，计算信号前要处理掉。
- 回测过拟合很常见，参数越调越美不代表能赚钱，务必样本外验证。
- 量化是工程 + 金融交叉，别只看代码，先理解策略背后的市场逻辑。
