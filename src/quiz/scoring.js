// 判分：单选比索引值，多选比选项集合（忽略顺序）是否完全相等
export function isCorrect(question, userAnswer) {
  const ans = question.answer || [];
  if (!userAnswer || userAnswer.length !== ans.length) return false;
  const a = [...userAnswer].sort();
  const b = [...ans].sort();
  return a.every((v, i) => v === b[i]);
}

// 选项索引数组 -> 字母串，如 [0,2] -> "A,C"
export function toLetters(arr) {
  return (arr || []).map((i) => String.fromCharCode(65 + i)).join(', ');
}
