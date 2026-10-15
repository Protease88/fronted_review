// 面试题库加载：构建期批量导入 content/interview/*.json（按公司组织）
const modules = import.meta.glob('../../content/interview/*.json', {
  eager: true,
  import: 'default',
});

// 合并所有公司的题目，每题已自带 company / category / difficulty / round? / topic? 等字段
export const allQuestions = [];

for (const path of Object.keys(modules)) {
  const data = modules[path];
  const company = data.company;
  (data.questions || []).forEach((q) => {
    allQuestions.push({ ...q, company: q.company || company });
  });
}

// 公司列表（去重，保持首次出现顺序），供列表页筛选选项使用
export const companies = [...new Set(allQuestions.map((q) => q.company))];

// 难度枚举（与数据层约定一致）
export const DIFFICULTIES = ['简单', '中等', '困难'];

// 按 id 定位单题；不存在返回 null
export function getQuestionById(id) {
  return allQuestions.find((q) => q.id === id) || null;
}

// 三维筛选：
// - company：公司数组，空数组 / 缺省 = 不限
// - category：分类字符串，'all' / 缺省 = 不限
// - difficulty：难度字符串，'all' / 缺省 = 不限
export function filterQuestions({ company, category, difficulty } = {}) {
  return allQuestions.filter((q) => {
    if (Array.isArray(company) && company.length && !company.includes(q.company)) {
      return false;
    }
    if (category && category !== 'all' && q.category !== category) return false;
    if (difficulty && difficulty !== 'all' && q.difficulty !== difficulty) return false;
    return true;
  });
}
