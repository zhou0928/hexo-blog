---
title: "Excel 百万级数据导出性能优化"
date: 2026-06-24
tags: ["性能优化", "前端", "工单系统"]
description: "工单系统报表导出从 OOM 到秒级完成的优化历程，涵盖流式写入、分片导出、Web Worker 等方案。"
---

# Excel 百万级数据导出性能优化

工单系统的报表导出功能，一开始用的 `xlsx` 库直接在前端生成 Excel 文件。数据量小的时候没问题，但当运营需要导出半年的工单数据（100 万+ 行）时，浏览器直接崩了。

## 问题分析

100 万行数据 × 每行 15 列 = 1500 万个单元格。`xlsx` 库会把整个工作簿构建为一个内存中的 JS 对象，峰值内存占用可达 2-3GB，直接触发浏览器标签页崩溃。

核心问题：**一次性把所有数据加载到内存**。

## 方案演进

### 方案一：后端流式导出（推荐）

最彻底的方案是把导出逻辑放到后端。Java 用 Apache POI 的 SXSSFWorkbook（流式模式），Python 用 openpyxl 的 write_only 模式，内存占用恒定。

```java
// 后端 Java 流式导出
SXSSFWorkbook workbook = new SXSSFWorkbook(100); // 缓冲 100 行
Sheet sheet = workbook.createSheet("工单数据");

int rowNum = 0;
for (WorkOrder order : workOrderService.findAll()) {
    Row row = sheet.createRow(rowNum++);
    row.createCell(0).setCellValue(order.getId());
    row.createCell(1).setCellValue(order.getTitle());
    row.createCell(2).setCellValue(order.getStatus());
    // ... 写入其他字段
    if (rowNum % 100 == 0) {
        // 每 100 行刷新一次，写入临时文件
        workbook.write(tempOutputStream);
    }
}

workbook.write(outputStream);
workbook.dispose(); // 清理临时文件
```

SXSSFWorkbook 的核心原理是只在内存中保留最近 100 行，之前的行已经写到磁盘临时文件了。内存占用从 O(n) 降到 O(100)。

### 方案二：前端分片导出

如果必须在前端导出（比如数据来自前端已有的表格），可以用分片策略：

```ts
// composables/useExcelExport.ts
import { ref } from 'vue'
import * as XLSX from 'xlsx'

export function useExcelExport() {
  const progress = ref(0)
  const isExporting = ref(false)

  async function exportLargeData(data: any[], filename: string) {
    isExporting.value = true
    progress.value = 0

    const CHUNK_SIZE = 10000
    const chunks = Math.ceil(data.length / CHUNK_SIZE)
    const wb = XLSX.utils.book_new()

    // 用一个空工作表开始
    const ws = XLSX.utils.aoa_to_sheet([])

    for (let i = 0; i < chunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, data.length)
      const chunk = data.slice(start, end)

      // 分批写入
      XLSX.utils.sheet_add_json(ws, chunk, {
        origin: -1,
        skipHeader: i > 0, // 只有第一批写表头
      })

      progress.value = Math.round(((i + 1) / chunks) * 100)

      // 让出主线程，避免卡顿
      await new Promise(resolve => setTimeout(resolve, 0))
    }

    XLSX.utils.book_append_sheet(wb, ws, '数据')
    XLSX.writeFile(wb, filename)
    isExporting.value = false
  }

  return { progress, isExporting, exportLargeData }
}
```

### 方案三：Web Worker + 流式写入

把文件生成放到 Web Worker 里，主线程保持响应：

```ts
// worker/excel-worker.ts
self.onmessage = function(e) {
  const { data, columns } = e.data
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data, { header: columns })

  // 生成 ArrayBuffer 而不是直接下载
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  self.postMessage({ buffer }, [buffer])
}
```

## 数据库层面优化

导出慢的另一个原因是查询慢。100 万条数据的 `SELECT *` 本身就很耗时。

```sql
-- 优化前：全量查询
SELECT * FROM work_orders WHERE created_at >= '2026-01-01'

-- 优化后：流式游标
DECLARE cur CURSOR FOR
  SELECT id, title, status, created_at
  FROM work_orders
  WHERE created_at >= '2026-01-01'
  ORDER BY created_at

-- 后端分批 fetch，每批 1000 条
```

关键优化点：
1. **只查需要的字段** — 不要 `SELECT *`
2. **用游标而非 LIMIT/OFFSET** — 百万级数据 OFFSET 会越来越慢
3. **加合适的索引** — 导出条件字段必须有索引

## 前端进度条

导出时间长，进度条是必须的：

```vue
<template>
  <div v-if="isExporting" class="export-progress">
    <div class="progress-bar" :style="{ width: progress + '%' }" />
    <span>{{ progress }}% — 正在生成文件...</span>
  </div>
</template>
```

## 方案对比

| 方案 | 内存占用 | 速度 | 复杂度 | 适用场景 |
|------|---------|------|--------|---------|
| xlsx 一次性生成 | O(n) 极高 | 慢 | 低 | < 1万行 |
| 前端分片导出 | O(1万) | 中 | 中 | 1-10万行 |
| Web Worker | O(1万) 主线程空闲 | 中 | 中 | 需要保持 UI 响应 |
| 后端流式导出 | O(100) | 快 | 高 | > 10万行 |

## 最终方案

我们的选择是**后端流式导出 + 前端进度条**。超过 5 万行就走后端，前端只负责发起请求和显示进度。用户体验好，服务器内存也扛得住。

如果后端实在改不了，前端分片 + Web Worker 是保底方案，但要注意分片大小和主线程让出的节奏。
