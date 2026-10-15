import { framework } from '../knowledge';

// 公司简称
export const COMPANY_LABELS = {
  alibaba: '阿里',
  tencent: '腾讯',
  bytedance: '字节',
};

export const companyLabel = (c) => COMPANY_LABELS[c] || c;

// 题目难度 → 语义色 tone
export const DIFFICULTY_TONES = {
  简单: 'success',
  中等: 'warning',
  困难: 'danger',
};

// 知识分类 → 语义色 tone（低饱和大地色，区分 JS 赭黄 / CSS 青瓷 / 网络松绿）
export const CATEGORY_TONES = {
  js: 'clay',
  css: 'teal',
  network: 'pine',
};

export const categoryTone = (id) => CATEGORY_TONES[id] || 'stone';

// 分类 id → 中文标题
export const CATEGORY_LABELS = Object.fromEntries(
  framework.categories.map((c) => [c.id, c.title])
);

export const categoryLabel = (id) => CATEGORY_LABELS[id] || id;
