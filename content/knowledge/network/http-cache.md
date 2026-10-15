# HTTP 缓存

## 基础要点

HTTP 缓存让浏览器复用已获取的资源，减少请求、加快加载。核心分两类：

- **强缓存**：命中则不发请求，直接用本地副本（`200 from cache`）。
- **协商缓存**：发请求带校验字段，服务端判断未变则返回 `304`，否则返回新内容。

## 深入原理

### 强缓存字段

| 字段 | 说明 |
|------|------|
| `Cache-Control: max-age=3600` | 相对时间（秒），优先级高于 Expires |
| `Expires: <GMT 时间>` | 绝对时间，受本地时钟影响，已不推荐单独使用 |

```http
Cache-Control: public, max-age=31536000, immutable
```

- `public`：可被代理缓存；`private`：仅客户端缓存。
- `no-cache`：走协商缓存；`no-store`：完全不缓存。

### 协商缓存字段

| 请求带 | 响应带 | 机制 |
|--------|--------|------|
| `If-Modified-Since` | `Last-Modified` | 比较最后修改时间 |
| `If-None-Match` | `ETag` | 比较内容指纹（优先级更高，更精准） |

```http
# 首次响应
ETag: "abc123"
# 再次请求
If-None-Match: "abc123"
# 未变 → 304 Not Modified
```

> `ETag` 精度高于 `Last-Modified`（能识别内容未变但时间变了的情况，且支持秒级以下的变更）。

## 缓存策略实践

- **带指纹的静态资源**（`app.a1b2c3.js`）：`Cache-Control: max-age=31536000, immutable` 长效强缓存，内容变则文件名变。
- **HTML 入口**：`no-cache` 或较短 `max-age`，保证能及时拿到新引用的资源。
- **API 数据**：多用 `ETag`/`Last-Modified` 协商缓存。

## 面试要点

- 强缓存不发请求；协商缓存发请求但可能回 `304`。
- `Cache-Control` 优先级高于 `Expires`；`ETag` 优先级高于 `Last-Modified`。
- 静态资源用文件名指纹 + 长 `max-age`；HTML 用 `no-cache` 保活。
