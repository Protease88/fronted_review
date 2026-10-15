import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from './storage';
import BackupButtons from './BackupButtons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { categoryLabel, categoryTone } from '../constants/labels';

// 分类色条类需为完整字面量，确保被 Tailwind 扫描保留
const ACCENTS = {
  clay: 'accent-clay',
  teal: 'accent-teal',
  pine: 'accent-pine',
  stone: 'accent-stone',
};

function pct(correct, total) {
  return total ? Math.round((correct / total) * 100) : 0;
}

function Metric({ label, value, hint }) {
  return (
    <Card variant="flat" className="p-5">
      <div className="text-[14px] text-ink-faint">{label}</div>
      <div className="mt-1.5 font-display text-[32px] font-semibold leading-none text-moss-700 tabular-nums">
        {value}
      </div>
      {hint && <div className="mt-2 text-[14px] text-ink-faint">{hint}</div>}
    </Card>
  );
}

export default function Stats() {
  const [s, setS] = useState(null);

  useEffect(() => {
    setS(getStats());
  }, []);

  const refresh = () => setS(getStats());

  if (!s || s.totalAnswered === 0) {
    return (
      <EmptyState
        mark="·"
        title="还没有答题记录"
        description="完成第一场答题后，这里会统计你的正确率与强弱项；也可导入之前的备份继续。"
        action={
          <div className="flex flex-col items-center gap-3">
            <Button as={Link} to="/quiz" size="sm">
              开始答题
            </Button>
            <BackupButtons onImported={refresh} />
          </div>
        }
      />
    );
  }

  const accuracy = pct(s.totalCorrect, s.totalAnswered);

  return (
    <div>
      <PageHeader
        eyebrow={
          <>
            <span>答题统计</span>
            <span aria-hidden="true">·</span>
            <span>{s.history.length} 场练习</span>
          </>
        }
        title="你的掌握情况"
        description="按分类看清强弱项，把时间花在最薄弱的地方。"
        actions={
          <>
            <BackupButtons onImported={refresh} />
            <Button as={Link} to="/quiz" size="sm">
              继续答题
            </Button>
          </>
        }
      />

      <section className="mb-7 grid gap-4 sm:grid-cols-2">
        <Metric
          label="总正确率"
          value={`${accuracy}%`}
          hint={`答对 ${s.totalCorrect} / 共 ${s.totalAnswered} 题`}
        />
        <Metric label="答题次数" value={s.history.length} hint="每场练习都会记录用时" />
      </section>

      <h2 className="mb-3 font-display text-[18px] font-semibold text-ink">各分类正确率</h2>
      <div className="mb-7 space-y-2.5">
        {Object.entries(s.byCategory).map(([cat, v]) => {
          const rate = pct(v.correct, v.answered);
          return (
            <div key={cat}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-[15px]">
                <span className="font-medium text-ink">{categoryLabel(cat)}</span>
                <span className="tabular-nums text-ink-faint">
                  {rate}% · {v.correct}/{v.answered}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-pill bg-paper-sunken">
                <div
                  className={`h-full animate-grow-x rounded-pill ${ACCENTS[categoryTone(cat)]}`}
                  style={{ '--grow-to': `${rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 font-display text-[18px] font-semibold text-ink">历史记录</h2>
      <Card variant="flat" className="divide-y divide-paper-line-soft px-5">
        {s.history
          .slice()
          .reverse()
          .map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 py-3 text-[15px] transition-colors duration-200 ease-paper hover:text-ink"
            >
              <span className="text-ink-soft">{h.date}</span>
              <span className="flex-1 text-right tabular-nums text-ink-faint">
                正确率 <span className="font-medium text-moss-700">{h.accuracy}%</span>
              </span>
              <span className="w-20 text-right tabular-nums text-ink-faint">用时 {h.duration}s</span>
            </div>
          ))}
      </Card>
    </div>
  );
}
