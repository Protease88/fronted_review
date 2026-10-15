# 前端面试复习站

JavaScript / CSS / 网络与 HTTP 知识框架 + 大厂真题 + 在线答题自测，纯前端静态站点。

## 在线访问

推送到 GitHub 仓库的 `main` 分支后，GitHub Actions 会自动构建并发布到 Pages：

```
https://<用户名>.github.io/<仓库名>/
```

首次需要在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**（工作流首次运行通常会自动设置）。

## 本地开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

Node 版本要求 18+（CI 使用 Node 20）。

## 数据存储

- 答题统计与错题本保存在**浏览器 localStorage**（键 `quiz-wrong`、`quiz-stats`），不上传服务器。
- 数据按「浏览器 + 域名」隔离：换设备、换浏览器、清理缓存后数据不互通；从 localhost 换到 github.io 也不会自动带过去。
- 需要迁移时，在「答题统计」或「错题本」页面使用 **导出备份 / 导入备份** 按钮，导出为 JSON 文件，在另一台设备导入即可（导入为覆盖式，会覆盖当前浏览器内的数据）。

## 目录结构

```
src/
├─ pages/        知识框架页
├─ interview/    真题列表与详情
├─ quiz/         答题、错题本、统计、localStorage 持久化
├─ components/   通用 UI
└─ constants/    分类文案等常量
content/         题库与知识内容（JSON / Markdown）
```

## 部署说明

Dify AI 助手的 token 不入库，需要在仓库 **Settings → Secrets and variables → Actions** 中配置 `VITE_DIFY_TOKEN`（Secret），工作流会在构建时注入；未配置时助手不加载，站点其余功能不受影响。
本地开发可复制 `.env.example` 为 `.env.local` 填写同样的变量。


路由使用 `HashRouter`，`vite.config.js` 使用 `base: './'`，因此仓库名可任意，无需硬编码。
工作流见 `.github/workflows/deploy.yml`：push main → `npm ci` → `npm run build` → 上传 `dist` → 部署 Pages。
