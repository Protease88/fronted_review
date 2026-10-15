// 题库加载：构建期批量导入 content/quiz/*.json（与 Phase1 分类 id 对齐）
const modules = import.meta.glob('../../content/quiz/*.json', {
  eager: true,
  import: 'default',
});

// 扁平化所有题目，附带 category 字段
export const allQuestions = [];
export const quizCategories = [];

for (const path of Object.keys(modules)) {
  const data = modules[path];
  const cat = data.category;
  if (!quizCategories.includes(cat)) quizCategories.push(cat);
  (data.questions || []).forEach((q) => allQuestions.push({ ...q, category: cat }));
}

// Fisher–Yates 洗牌
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 抽题：按分类（可空=全题库）+ 数量；题量超上限则取全部；单次会话内不重复
export function drawQuestions(category, count) {
  const pool = category
    ? allQuestions.filter((q) => q.category === category)
    : allQuestions;
  const n = count && count > 0 ? Math.min(count, pool.length) : pool.length;
  return shuffle(pool).slice(0, n);
}
