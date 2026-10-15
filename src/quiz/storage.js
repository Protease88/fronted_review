// localStorage 持久化：错题本 + 统计（纯前端、本机）
const WRONG_KEY = 'quiz-wrong';
const STATS_KEY = 'quiz-stats';
const BACKUP_VERSION = 1;

function defaultStats() {
  return { totalAnswered: 0, totalCorrect: 0, byCategory: {}, history: [] };
}

// 写入失败（隐私模式、配额超限）不应中断答题流程，仅告警
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[storage] 写入 ${key} 失败，本次数据未持久化：`, e);
  }
}

export function getWrong() {
  try {
    return JSON.parse(localStorage.getItem(WRONG_KEY)) || [];
  } catch {
    return [];
  }
}

// 写入/更新一道错题：以 category+id 去重，重复答错则更新而非堆积
export function addWrong(entry) {
  const list = getWrong();
  const idx = list.findIndex((w) => w.category === entry.category && w.id === entry.id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  save(WRONG_KEY, list);
}

export function clearWrong() {
  try {
    localStorage.removeItem(WRONG_KEY);
  } catch (e) {
    console.warn(`[storage] 清除 ${WRONG_KEY} 失败：`, e);
  }
}

export function getStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) || defaultStats();
  } catch {
    return defaultStats();
  }
}

// 记录一次交卷：逐题累计总/分类正确率，并追加一条历史记录
export function recordSession(results, duration) {
  const s = getStats();
  results.forEach((r) => {
    const c = r.question.category;
    s.totalAnswered += 1;
    if (r.correct) s.totalCorrect += 1;
    s.byCategory[c] = s.byCategory[c] || { answered: 0, correct: 0 };
    s.byCategory[c].answered += 1;
    if (r.correct) s.byCategory[c].correct += 1;
  });
  const sessionCorrect = results.filter((r) => r.correct).length;
  const sessionAccuracy = results.length
    ? Math.round((sessionCorrect / results.length) * 100)
    : 0;
  s.history.push({
    date: new Date().toISOString().slice(0, 10),
    accuracy: sessionAccuracy,
    duration,
  });
  save(STATS_KEY, s);
}

/* ============ 备份：导出 / 导入 ============ */

// 组装备份对象，供下载或预览
export function exportBackup() {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    wrong: getWrong(),
    stats: getStats(),
  };
}

// 触发 JSON 文件下载
export function downloadBackup() {
  const data = exportBackup();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quiz-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 覆盖式导入：解析 + 结构校验通过后才写入，失败时抛出错误且不破坏现有数据
export function importBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('不是合法的 JSON 文件');
  }
  if (!data || typeof data !== 'object') throw new Error('文件内容不是备份对象');
  if (!Array.isArray(data.wrong)) throw new Error('缺少 wrong（错题）数组');
  if (!data.stats || typeof data.stats !== 'object') throw new Error('缺少 stats（统计）对象');

  // 统计对象缺失字段时用默认值补齐，避免旧备份导入后页面崩溃
  const merged = { ...defaultStats(), ...data.stats };
  merged.byCategory = data.stats.byCategory || {};
  merged.history = Array.isArray(data.stats.history) ? data.stats.history : [];

  save(WRONG_KEY, data.wrong);
  save(STATS_KEY, merged);
  return { wrongCount: data.wrong.length, stats: merged };
}
