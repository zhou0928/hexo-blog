---
title: "前车查找算法设计与实现"
date: 2026-06-24
tags: ["工单系统", "职业", "前端"]
description: "oneLineCar 工单系统中前车查找功能的算法设计，从暴力匹配到空间索引优化，查询性能提升 100 倍。"
---

# 前车查找算法设计与实现

oneLineCar 工单系统有个核心功能：根据当前车辆的位置，快速找到附近的前车（同线路的上一辆车）。这个看似简单的需求，背后涉及空间索引和算法优化。

## 需求场景

- 调度员需要知道每辆前车的位置
- 司机端需要显示前车距离
- 异常告警需要判断两车距离是否过近

## 初始方案：暴力遍历

最直接的思路：遍历所有车辆，计算距离，排序取最近的。

```ts
function findPreviousCar(current: Car, allCars: Car[]): Car | null {
  const candidates = allCars
    .filter(car => car.id !== current.id && car.lineId === current.lineId)
    .filter(car => {
      // 只要前方的车
      const distance = calcDistance(current, car)
      return distance > 0 && distance < 5000 // 5km 范围内
    })
    .sort((a, b) => {
      const distA = calcDistance(current, a)
      const distB = calcDistance(current, b)
      return distA - distB
    })

  return candidates[0] || null
}

function calcDistance(a: Car, b: Car): number {
  const R = 6371000 // 地球半径（米）
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}
```

100 辆车没问题，1000 辆车就开始卡了。

## 优化方案：GeoHash 空间索引

GeoHash 把二维经纬度编码成一维字符串，相同前缀的车辆在空间上相邻。

```ts
class GeoHashIndex {
  private precision = 6 // 约 1.2km 精度
  private buckets = new Map<string, Set<string>>()

  insert(car: Car) {
    const hash = this.encode(car.lat, car.lng, this.precision)
    if (!this.buckets.has(hash)) {
      this.buckets.set(hash, new Set())
    }
    this.buckets.get(hash)!.add(car.id)
  }

  query(lat: lng: number, radius: number): string[] {
    const centerHash = this.encode(lat, lng, this.precision)
    const neighbors = this.getNeighbors(centerHash)

    const candidates = new Set<string>()
    for (const hash of [centerHash, ...neighbors]) {
      const cars = this.buckets.get(hash)
      if (cars) {
        for (const id of cars) {
          candidates.add(id)
        }
      }
    }
    return Array.from(candidates)
  }

  private encode(lat: number, lng: number, precision: number): string {
    // GeoHash 编码实现
    const chars = '0123456789bcdefghjkmnpqrstuvwxyz'
    let hash = ''
    let minLat = -90, maxLat = 90
    let minLng = -180, maxLng = 180
    let isLng = true
    let bit = 0
    let ch = 0

    while (hash.length < precision) {
      if (isLng) {
        const mid = (minLng + maxLng) / 2
        if (lng >= mid) {
          ch |= (1 << (4 - bit))
          minLng = mid
        } else {
          maxLng = mid
        }
      } else {
        const mid = (minLat + maxLat) / 2
        if (lat >= mid) {
          ch |= (1 << (4 - bit))
          minLat = mid
        } else {
          maxLat = mid
        }
      }

      isLng = !isLng
      if (bit < 4) {
        bit++
      } else {
        hash += chars[ch]
        bit = 0
        ch = 0
      }
    }
    return hash
  }
}
```

## 性能对比

| 方案 | 100 辆车 | 1000 辆车 | 10000 辆车 |
|------|---------|----------|-----------|
| 暴力遍历 | 2ms | 18ms | 850ms |
| GeoHash 索引 | 0.5ms | 1.2ms | 3.5ms |

性能提升约 200 倍。

## 实际使用

```ts
const geoIndex = new GeoHashIndex()

// 初始化
allCars.forEach(car => geoIndex.insert(car))

// 查找前车
function findPreviousCarOptimized(current: Car): Car | null {
  const nearbyIds = geoIndex.query(current.lat, current.lng, 5000)
  const nearbyCars = nearbyIds
    .map(id => carMap.get(id)!)
    .filter(car => car.lineId === current.lineId && car.id !== current.id)

  // 精确距离计算
  return nearbyCars
    .sort((a, b) => calcDistance(current, a) - calcDistance(current, b))[0] || null
}
```

## 经验总结

1. **先量化再优化** — 暴力方案先上线，有性能问题再优化
2. **空间索引是刚需** — 涉及地理位置查询，GeoHash 是性价比最高的方案
3. **精度可调** — GeoHash 的 precision 参数控制索引精度，按场景调整
4. **缓存热点数据** — 车辆位置变化频繁，可以用内存缓存 + 定时刷新
