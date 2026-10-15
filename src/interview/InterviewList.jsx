import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { companies, DIFFICULTIES, filterQuestions } from './bank';
import { framework } from '../knowledge';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import {
  companyLabel,
  categoryLabel,
  categoryTone,
  DIFFICULTY_TONES,
} from '../constants/labels';

// 交错动画类需为完整字面量，确保被 Tailwind 扫描保留
const STAGGER = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];

const selectClass =
  'rounded-ctrl border border-paper-line bg-paper-raised px-2.5 py-1.5 text-[14px] text-ink transition-all duration-200 ease-paper hover:border-moss-200 focus:border-moss-300 focus:outline-none focus:ring-4 focus:ring-moss-600/10';

export default function InterviewList() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const results = useMemo(
    () => filterQuestions({ company: selectedCompanies, category, difficulty }),
    [selectedCompanies, category, difficulty]
  );

  function toggleCompany(c) {
    setSelectedCompanies((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function reset() {
    setSelectedCompanies([]);
    setCategory('all');
    setDifficulty('all');
  }

  const hasFilter =
    selectedCompanies.length > 0 || category !== 'all' || difficulty !== 'all';

  return (
    <div>
      <PageHeader
        eyebrow={
          <>
            <span>大厂面试题</span>
            <span aria-hidden="true">·</span>
            <span>共 {results.length} 题</span>
          </>
        }
        title="真题是最好的模拟卷"
        description="按公司、分类与难度筛选题目，先看题再对答案，效果最好。"
      />

      <Card variant="flat" className="mb-6 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[14px] font-medium text-ink-faint">公司（可多选）</p>
            <div className="flex flex-wrap gap-2">
              {companies.map((c) => {
                const active = selectedCompanies.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCompany(c)}
                    aria-pressed={active}
                    className={[
                      'rounded-pill px-3.5 py-1.5 text-[14px] transition-all duration-200 ease-paper',
                      active
                        ? 'bg-moss-600 font-medium text-white shadow-soft'
                        : 'border border-paper-line bg-paper-raised text-ink-soft hover:border-moss-200 hover:text-moss-700',
                    ].join(' ')}
                  >
                    {companyLabel(c)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="flex items-center gap-2 text-[14px] text-ink-faint">
              分类
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                <option value="all">全部</option>
                {framework.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-[14px] text-ink-faint">
              难度
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={selectClass}
              >
                <option value="all">全部</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            {hasFilter && (
              <Button type="button" onClick={reset} variant="ghost" size="sm">
                重置筛选
              </Button>
            )}
          </div>
        </div>
      </Card>

      {results.length === 0 ? (
        <EmptyState
          mark="·"
          title="没有符合条件的题目"
          description="试试放宽公司、分类或难度的筛选条件。"
          action={
            <Button type="button" onClick={reset} variant="secondary" size="sm">
              重置筛选
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {results.map((q, i) => (
            <Link
              key={q.id}
              to={`/interview/${q.id}`}
              className={`group block animate-fade-up ${i < STAGGER.length ? STAGGER[i] : ''}`}
            >
              <Card variant="interactive" accent={categoryTone(q.category)} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <Badge tone="primary">{companyLabel(q.company)}</Badge>
                    <Badge tone={categoryTone(q.category)}>{categoryLabel(q.category)}</Badge>
                    <Badge tone={DIFFICULTY_TONES[q.difficulty] || 'stone'}>{q.difficulty}</Badge>
                    {q.round && <Badge tone="neutral">{q.round}</Badge>}
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[15px] text-ink-faint transition-transform duration-200 ease-paper group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
                <p className="mt-2.5 line-clamp-2 text-[16px] leading-relaxed text-ink-soft transition-colors duration-200 ease-paper group-hover:text-ink">
                  {q.question}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
