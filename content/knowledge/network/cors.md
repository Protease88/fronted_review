# 跨域 CORS

## 基础要点

**同源策略**限制不同源（协议、域名、端口任一不同）的脚本读取彼此资源。**CORS（跨源资源共享）** 是一套基于 HTTP 头的机制，让服务端声明"允许哪些源访问"。

> 同源 = 协议 + 域名 + 端口 三者全同。如 `http://a.com:80` 与 `https://a.com` 不同源。

## 深入原理

### 简单请求 vs 预检请求

**简单请求**（同时满足）直接发，带 `Origin`：
- 方法为 `GET`/`POST`/`HEAD`
- 头字段在允许集合内（`Accept`、`Content-Type` 限 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` 等）

**非简单请求**（如 `PUT`、携带自定义头、`Content-Type: application/json`）会先发**预检（OPTIONS）**：

```http
OPTIONS /api/data HTTP/1.1
Origin: http://a.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: x-token
```

服务端通过预检后，浏览器才发真实请求。

### 关键响应头

```http
Access-Control-Allow-Origin: http://a.com   # 允许的源，* 表示任意（不能带凭据）
Access-Control-Allow-Credentials: true       # 允许携带 Cookie
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: x-token
Access-Control-Max-Age: 86400                # 预检结果缓存时间
```

> 携带凭据（`withCredentials`）时，`Allow-Origin` 不能为 `*`，必须指定具体源，且 `Allow-Credentials: true`。

## 常见跨域解决方案

| 方案 | 适用 |
|------|------|
| CORS（服务端加头） | 标准、推荐 |
| 开发代理（Vite `server.proxy`） | 本地开发绕过浏览器限制 |
| Nginx 反向代理 | 生产环境同域转发 |
| JSONP | 仅 GET、已过时 |

## 面试要点

- 跨域是**浏览器**行为，同源策略保护的是读取响应；`<img>`/`<script>` 等标签不受限（所以 JSONP 可行）。
- 非简单请求先 OPTIONS 预检；`Allow-Credentials` 与 `Allow-Origin: *` 不能共存。
- 本地开发用 Vite proxy，生产用 CORS 或反向代理。
