---
title: "Python AI 绘画"
tags: [AI]
group: 高级
date: 2026-09-10 00:00:00
---

# Python AI 绘画

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话
用 Python 调用 Stable Diffusion、DALL·E 等 AI 模型，根据文字提示（Prompt）自动生成图片。

## 要点
- **核心原理**：扩散模型（Diffusion）从噪声逐步去噪，按文字提示生成图像。
- **三种用法**：
  1. 在线 API（OpenAI DALL·E、文心一格等），几行代码就能出图。
  2. 本地部署（Stable Diffusion WebUI / ComfyUI），免费但要显卡。
  3. Python 库调用（`diffusers`、`openai`、`stability-sdk`），可编程、可批量。
- **Prompt 是关键**：主体 + 风格 + 画质词 + 负面提示，英文效果通常更好。
- **可控生成**：图生图（img2img）、ControlNet、LoRA 微调，控制构图与风格。
- **硬件门槛**：本地跑 SD 建议显存 6GB 以上，CPU 出图很慢。
- 生成内容注意版权、肖像权与平台合规，别拿来商用或造谣。

## 语法 / 常用方法

| 库 / 接口 | 说明 | 用途 |
|---|---|---|
| `openai` | 调用 DALL·E 接口 | 在线文字生图 |
| `diffusers` | Hugging Face 扩散模型库 | 本地文生图/图生图 |
| `transformers` | 加载文本编码器等组件 | 配合 diffusers |
| `torch` | 深度学习框架 | GPU 加速推理 |
| `Pillow (PIL)` | 图像读取与保存 | 处理生成结果 |
| Stable Diffusion WebUI | 可视化本地出图 | 零代码使用 |
| ComfyUI | 节点式工作流 | 精细控制流程 |
| ControlNet | 条件控制插件 | 控制姿态/线稿/深度 |

## 代码示例

```python
# 示例一：调用在线 API（以 OpenAI DALL·E 为例）
# pip install openai pillow
from openai import OpenAI

client = OpenAI(api_key="你的_API_KEY")

resp = client.images.generate(
    model="dall-e-3",
    prompt="a cute corgi wearing sunglasses, digital art, high detail",
    size="1024x1024",
    n=1,
)
print(resp.data[0].url)          # 图片链接，可直接下载

# 示例二：本地用 diffusers 生成（需 GPU，首次会下载模型）
# pip install diffusers transformers accelerate torch
from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16,
).to("cuda")                      # 没显卡改成 "cpu"，会很慢

image = pipe("a cat astronaut, oil painting, 4k").images[0]
image.save("cat_astronaut.png")   # 保存到本地
print("已保存 cat_astronaut.png")
```

## 易错点
- 在线 API 出图按次收费，循环批量调用前先估算成本。
- 本地首次运行会下载数 GB 模型权重，需要良好网络与磁盘空间。
- `torch_dtype=float16` 只在 GPU 上安全，CPU 用 `float32`，否则可能报错或全黑图。
- 显存不足会 `CUDA out of memory`，可减小分辨率、张数或启用 attention slicing。
- 图生图/ControlNet 的输入图尺寸要与模型匹配，常见为 512 或 768 的倍数。
- Prompt 里的负面词（negative prompt）能明显改善畸形手、多手指等问题。
- 生成人物尤其真人风格时，注意平台政策与法律风险。
