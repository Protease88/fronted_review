import indexJson from '../content/knowledge/index.json';

// 构建期批量导入所有 Markdown 原文（as raw），新增 .md 自动进入内容集
const rawMap = import.meta.glob('../content/knowledge/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function loadRaw(file) {
  const matched = Object.keys(rawMap).find((k) => k.endsWith('/' + file));
  return matched ? rawMap[matched] : null;
}

// 知识框架树（分类 → 主题）
export const framework = indexJson;

// 扁平化所有主题，附带分类信息与 Markdown 原文
export const topics = framework.categories.flatMap((cat) =>
  cat.topics.map((t) => ({
    ...t,
    categoryId: cat.id,
    categoryTitle: cat.title,
    raw: loadRaw(t.file),
  }))
);

export function getTopic(categoryId, topicId) {
  return topics.find((t) => t.categoryId === categoryId && t.id === topicId) || null;
}
