import { useLocation, Link } from 'react-router-dom';
import { toLetters } from './scoring';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function Metric({ label, value, hint }) {
  return (
    <Card variant="flat" className="p-5">
      <div className="text-[14px] text-ink-faint">{label}</div>
      <div className="mt-1.5 font-display text-[30px] font-semibold leading-none text-moss-700 tabular-nums">
        {value}
      </div>
      {hint && <div className="mt-2 text-[14px] text-ink-faint">{hint}</div>}
    </Card>
  );
}

export default function QuizResult() {
  const { state } = useLocation();

  if (!state || !state.results) {
    return (
      <EmptyState
        mark="·"
        title="暂无答题结果"
        description="完成一场答题后，这里会显示正确率与逐题解析。"
        action={
          <Button as={Link} to="/quiz" size="sm">
            去开始答题
          </Button>
        }
      />
    );
  }

  const { results, duration } = state;
  const correctCount = results.filter((r) => r.correct).length;
  const accuracy = results.length ? Math.round((correctCount / results.length) * 100) : 0;

  return (
    <div>
      <PageHeader
        eyebrow={
          <>
            <span>答题结果</span>
            <span aria-hidden="true">·</span>
            <span>共 {results.length} 题</span>
          </>
        }
        title={accuracy >= 80 ? '掌握得不错' : accuracy >= 60 ? '还有提升空间' : '该好好补一补了'}
        description="错题已自动进入错题本，可以随时回看。"
        actions={
          <div className="flex gap-2">
            <Button as={Link} to="/quiz" variant="secondary" size="sm">
              再来一局
            </Button>
            <Button as={Link} to="/stats" variant="ghost" size="sm">
              查看统计
            </Button>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric label="正确率" value={`${accuracy}%`} />
        <Metric label="答对 / 总题" value={`${correctCount} / ${results.length}`} />
        <Metric label="用时" value={fmt(duration)} />
      </section>

      <div className="mb-7 overflow-hidden rounded-pill bg-paper-sunken">
        <div
          className="h-1.5 animate-grow-x rounded-pill bg-moss-600"
          style={{ '--grow-to': `${accuracy}%` }}
        />
      </div>

      <h2 className="mb-3 font-display text-[18px] font-semibold text-ink">逐题解析</h2>
      <div className="space-y-3">
        {results.map((r, i) => (
          <Card
            key={r.question.category + '/' + r.question.id}
            accent={r.correct ? 'success' : 'danger'}
            variant="flat"
            className="p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={r.correct ? 'success' : 'danger'}>
                {r.correct ? '✓ 正确' : '✗ 错误'}
              </Badge>
              <span className="text-[13px] tabular-nums text-ink-faint">
                第 {i + 1} 题
              </span>
            </div>

            <p className="mt-2.5 text-[16px] font-medium leading-relaxed text-ink">
              {r.question.stem}
            </p>

            <div className="mt-3 space-y-1 text-[15px] text-ink-soft">
              <p>
                你的答案：
                <span className="font-mono text-ink">{toLetters(r.userAnswer) || '（未答）'}</span>
              </p>
              {!r.correct && (
                <p className="text-tone-success">
                  正确答案：
                  <span className="font-mono">{toLetters(r.question.answer)}</span>
                </p>
              )}
            </div>

            {r.question.explanation && (
              <div className="mt-3 rounded-ctrl bg-paper-sunken px-3.5 py-2.5 text-[15px] leading-relaxed text-ink-soft">
                <span className="font-medium text-ink">解析：</span>
                {r.question.explanation}
              </div>
            )}

            {r.question.topic && (
              <div className="mt-3">
                <Button
                  as={Link}
                  to={`/k/${r.question.category}/${r.question.topic}`}
                  variant="link"
                  size="sm"
                  className="px-0"
                >
                  去复习
                  <span aria-hidden="true">→</span>
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
