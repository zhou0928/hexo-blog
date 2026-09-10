---
title: "MCP 协议详解：AI 应用的 USB-C"
date: 2026-07-01
categories: ["AI"]
tags: ["MCP", "AI Agent", "工具调用", "协议"]
description: "理解 MCP 协议的分层架构、核心能力，以及如何在项目中接入 MCP Server"
---

# MCP 协议详解：AI 应用的 USB-C

以前每个 AI 应用要接工具，都得自己写适配层。数据库接一套、文件系统接一套、API 接一套。MCP（Model Context Protocol）就是来解决这个问题的：**定义一个标准协议，让 AI 应用和工具可以即插即用**。

这篇文章拆解 MCP 的架构、核心概念和工程实践。

<!-- more -->

## MCP 解决了什么问题

### 之前的状况

```
AI 应用 A → 自己写适配 → 数据库
AI 应用 B → 自己写适配 → 数据库
AI 应用 C → 自己写适配 → 数据库

AI 应用 A → 自己写适配 → GitHub
AI 应用 B → 自己写适配 → GitHub
```

每个应用都要重复造轮子。

### MCP 之后

```
AI 应用 A ─┐
AI 应用 B ──┤── MCP 协议 ── MCP Server（GitHub）
AI 应用 C ─┘

AI 应用 A ─┐
AI 应用 B ──┤── MCP 协议 ── MCP Server（数据库）
AI 应am C ─┘
```

**类比**：USB-C 之前，每个设备都有自己的充电口。USB-C 之后，一根线充所有设备。MCP 就是 AI 世界的 USB-C。

## MCP 的分层架构

```
┌─────────────────────────────────────────┐
│              MCP Host                   │
│  （AI 应用，如 Claude Desktop、Cursor）  │
├─────────────────────────────────────────┤
│            MCP Client                   │
│  （协议客户端，负责与 Server 通信）       │
├─────────────────────────────────────────┤
│            MCP Server                   │
│  （工具提供方，暴露工具和资源）           │
└─────────────────────────────────────────┘
```

### MCP Host

Host 是 AI 应用本身，比如：
- Claude Desktop
- Cursor
- 自己开发的 AI 应用

Host 负责管理 Client 和 Server 的连接。

### MCP Client

Client 是协议客户端，负责：
- 与 Server 建立连接
- 发送请求、接收响应
- 处理工具调用

### MCP Server

Server 是工具提供方，负责：
- 暴露可用的工具（Tools）
- 暴露可用的资源（Resources）
- 处理来自 Client 的请求

## 核心概念

### Tools（工具）

工具是 Server 暴露给 AI 的可调用函数：

```json
{
  "name": "get_weather",
  "description": "获取指定城市的天气信息",
  "inputSchema": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "城市名称"
      }
    },
    "required": ["city"]
  }
}
```

AI 模型看到这个定义后，就知道可以调用 `get_weather` 工具，并且需要传入 `city` 参数。

### Resources（资源）

资源是 Server 暴露给 AI 的只读数据：

```json
{
  "uri": "file:///home/user/documents/report.pdf",
  "name": "年度报告",
  "mimeType": "application/pdf"
}
```

AI 可以读取这个资源，但不能修改它。

### Prompts（提示词模板）

Server 可以预定义一些提示词模板：

```json
{
  "name": "code_review",
  "description": "代码审查模板",
  "arguments": [
    {
      "name": "code",
      "description": "要审查的代码",
      "required": true
    }
  ]
}
```

## MCP 通信协议

MCP 基于 JSON-RPC 2.0 协议，支持两种传输方式：

### stdio（标准输入输出）

适用于本地 Server：

```
Host ←→ Client ←→ stdio ←→ Server
```

配置示例（Claude Desktop）：

```json
{
  "mcpServers": {
    "weather": {
      "command": "python",
      "args": ["weather_server.py"]
    }
  }
}
```

### HTTP + SSE（Server-Sent Events）

适用于远程 Server：

```
Host ←→ Client ←→ HTTP/SSE ←→ Server
```

配置示例：

```json
{
  "mcpServers": {
    "github": {
      "url": "https://mcp.github.com/sse",
      "headers": {
        "Authorization": "Bearer ghp_xxxx"
      }
    }
  }
}
```

## 工具调用流程

```
1. Client 连接到 Server
2. Client 获取 Server 暴露的工具列表
3. Client 把工具列表告诉 AI 模型
4. 用户提问
5. AI 决定调用某个工具
6. Client 发送工具调用请求给 Server
7. Server 执行工具，返回结果
8. Client 把结果传给 AI
9. AI 基于结果生成回答
```

```python
# 伪代码
# 1. 连接 Server
client = MCPClient("stdio", command="python", args=["server.py"])

# 2. 获取工具列表
tools = client.list_tools()

# 3. 把工具告诉模型
response = model.chat(
    messages=[{"role": "user", "content": "北京今天天气怎么样？"}],
    tools=tools
)

# 4. 处理工具调用
if response.has_tool_call():
    tool_call = response.get_tool_call()
    result = client.call_tool(tool_call.name, tool_call.arguments)
    
    # 5. 把结果传回模型
    final_response = model.chat(
        messages=[
            {"role": "user", "content": "北京今天天气怎么样？"},
            {"role": "assistant", "tool_calls": [tool_call]},
            {"role": "tool", "content": result}
        ]
    )
```

## 开发 MCP Server

### Python 示例

```python
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("weather-server")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="get_weather",
            description="获取指定城市的天气信息",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名称"}
                },
                "required": ["city"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_weather":
        city = arguments["city"]
        # 调用天气 API
        weather = fetch_weather(city)
        return [TextContent(type="text", text=str(weather))]

if __name__ == "__main__":
    import asyncio
    asyncio.run(server.run_stdio())
```

### TypeScript 示例

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

const server = new Server({ name: "weather-server" });

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_weather",
      description: "获取指定城市的天气信息",
      inputSchema: {
        type: "object",
        properties: {
          city: { type: "string", description: "城市名称" }
        },
        required: ["city"]
      }
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  if (name === "get_weather") {
    const weather = await fetchWeather(args.city);
    return { content: [{ type: "text", text: JSON.stringify(weather) }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## 安全考量

### 权限控制

```python
# 只允许读取特定目录
ALLOWED_PATHS = ["/home/user/documents", "/tmp"]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "read_file":
        file_path = arguments["path"]
        if not any(file_path.startswith(p) for p in ALLOWED_PATHS):
            return [TextContent(type="text", text="权限不足：无法访问该路径")]
        # 读取文件...
```

### 输入校验

```python
import re

def validate_email(email: str) -> bool:
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email))

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "send_email":
        if not validate_email(arguments["to"]):
            return [TextContent(type="text", text="邮箱格式不正确")]
        # 发送邮件...
```

### 调用限制

```python
from collections import defaultdict
from datetime import datetime, timedelta

call_counts = defaultdict(list)

def rate_limit(tool_name: str, max_calls: int = 10, window: int = 60):
    now = datetime.now()
    call_counts[tool_name] = [
        t for t in call_counts[tool_name] 
        if (now - t).seconds < window
    ]
    if len(call_counts[tool_name]) >= max_calls:
        return False
    call_counts[tool_name].append(now)
    return True
```

## 现有的 MCP Server

社区已经有很多现成的 MCP Server：

| Server | 功能 |
|--------|------|
| GitHub | 仓库管理、Issue、PR |
| PostgreSQL | 数据库查询 |
| Filesystem | 文件读写 |
| Brave Search | 网页搜索 |
| Slack | 消息发送 |
| Google Drive | 文件管理 |

## 小结

- MCP 是 AI 应用和工具之间的标准协议
- 分层架构：Host → Client → Server
- 核心概念：Tools（可调用函数）、Resources（只读数据）、Prompts（提示词模板）
- 两种传输方式：stdio（本地）、HTTP+SSE（远程）
- 安全很重要：权限控制、输入校验、调用限制

---

**下一篇**：[AI 编程实战：Claude Code 使用指南](/posts/ai-coding/claude-code)
