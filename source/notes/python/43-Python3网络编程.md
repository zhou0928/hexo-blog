---
title: "Python3 网络编程"
tags: [网络与爬虫]
group: 高级
date: 2026-09-10 00:00:00
---

# Python3 网络编程

> Python3 学习笔记 · 整理自菜鸟教程

## 一句话

Python 通过 `socket` 模块实现基于 TCP/UDP 的网络通信，socket 是应用层与传输层之间的编程接口，负责建立连接、收发数据。

## 要点

- 两个核心协议：TCP（可靠、面向连接，如网页、文件传输）和 UDP（不可靠、无连接，如视频、DNS）。
- `socket.socket(family, type)` 创建套接字：`AF_INET`（IPv4）、`SOCK_STREAM`（TCP）、`SOCK_DGRAM`（UDP）。
- TCP 服务端四步：`bind` 绑定地址 → `listen` 监听 → `accept` 接受连接 → `recv/send` 收发。
- TCP 客户端三步：`connect` 连接 → `send/recv` 收发 → `close` 关闭。
- UDP 不需要连接：服务端 `bind` 后用 `recvfrom/sendto`，客户端直接 `sendto/recvfrom`。
- 数据以**字节**（bytes）传输，收发都要 encode/decode。
- 服务端常开多线程或多进程处理多客户端（见 45-Python3多线程）。

## 语法 / 常用方法

| 语法/方法 | 说明 | 示例 |
|---|---|---|
| `socket.socket(family, type)` | 创建套接字 | `s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)` |
| `s.bind((host, port))` | 绑定 IP 和端口 | `s.bind(('127.0.0.1', 9999))` |
| `s.listen(n)` | 开始监听，n 为最大等待连接数 | `s.listen(5)` |
| `s.accept()` | 接受连接，返回 (客户端socket, 地址) | `conn, addr = s.accept()` |
| `s.connect((host, port))` | 客户端连接服务器 | `s.connect(('127.0.0.1', 9999))` |
| `s.send(data)` / `s.sendall(data)` | 发送字节数据，sendall 确保全发 | `conn.sendall(b'hello')` |
| `s.recv(bufsize)` | 接收数据，返回 bytes | `data = conn.recv(1024)` |
| `s.recvfrom(bufsize)` | UDP 接收，返回 (数据, 地址) | `data, addr = s.recvfrom(1024)` |
| `s.sendto(data, addr)` | UDP 发送到指定地址 | `s.sendto(b'hi', addr)` |
| `s.close()` | 关闭套接字 | `s.close()` |
| `s.settimeout(t)` | 设置超时秒数，超时抛 `socket.timeout` | `s.settimeout(5)` |
| `socket.gethostname()` | 获取本机主机名 | `socket.gethostname()` |
| `socket.gethostbyname(name)` | 域名解析为 IP | `socket.gethostbyname('www.baidu.com')` |
| `with socket.socket(...) as s` | 上下文管理，自动关闭 | `with socket.socket() as s:` |

## 代码示例

```python
# ---------- TCP 服务端 ----------
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('127.0.0.1', 9999))   # 本机端口 9999
server.listen(5)
print('服务端已启动，等待连接...')

while True:
    conn, addr = server.accept()          # 阻塞等待客户端
    print('客户端接入:', addr)
    conn.sendall(b'Welcome to Python TCP!')  # 发送字节
    data = conn.recv(1024).decode('utf-8')   # 接收并解码
    print('收到:', data)
    conn.close()
```

```python
# ---------- TCP 客户端 ----------
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(('127.0.0.1', 9999))
msg = client.recv(1024).decode('utf-8')
print('服务器说:', msg)
client.sendall('你好，服务器'.encode('utf-8'))
client.close()
```

```python
# ---------- UDP 通信（无连接） ----------
import socket

# 服务端
udp_server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
udp_server.bind(('127.0.0.1', 8888))
data, addr = udp_server.recvfrom(1024)
print('UDP 收到:', data.decode(), '来自', addr)
udp_server.sendto(b'pong', addr)

# 客户端
udp_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
udp_client.sendto('ping'.encode(), ('127.0.0.1', 8888))
resp, _ = udp_client.recvfrom(1024)
print('UDP 响应:', resp.decode())
```

## 易错点

- `recv` 可能一次收不全（TCP 流式），大消息要循环接收或约定长度/结束标记。
- `send` 不保证一次发完，可靠发送用 `sendall`。
- 端口被占用会报 `Address already in use`，换端口或先关掉旧进程。
- 收发的是 bytes：字符串必须 `.encode()`，收回来要 `.decode()`，编码不一致会乱码。
- 服务端 `accept` 是阻塞的，单线程只能服务一个客户端，需多线程处理。
- 网络异常（对方断开）会抛异常，客户端代码要加 try/except，防止程序崩溃。
