import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { drawQuestions } from './bank';
import { isCorrect } from './scoring';
import { recordSession, addWrong } from './storage';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { categoryLabel, categoryTone } from '../constants/labels';

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function Quiz() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const category = params.get('category') || '';
  const countParam = parseInt(params.get('count'), 10);
  const count = countParam > 0 ? countParam : 10;

  const [questions] = useState(() => drawQuestions(category, count));
  const [answers, setAnswers] = useState({}); // q.id -> number[]
  const [seconds, setSeconds] = useState(0);
  const startRef = useRef(Date.now());

  // 整场计时
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function toggle(q, idx) {
    setAnswers((prev) => {
      if (q.type === 'single') return { ...prev, [q.id]: [idx] };
      const cur = prev[q.id] ? [...prev[q.id]] : [];
      const has = cur.includes(idx);
      return {
        ...prev,
        [q.id]: has ? cur.filter((i) => i !== idx) : [...cur, idx],
      };
    });
  }

  function submit() {
    const results = questions.map((q) => {
      const ua = answers[q.id] || [];
      return { question: q, userAnswer: ua, correct: isCorrect(q, ua) };
    });
    results
      .filter((r) => !r.correct)
      .forEach((r) =>
        addWrong({
          category: r.question.category,
          id: r.question.id,
          type: r.question.type,
          stem: r.question.stem,
          options: r.question.options,
          explanation: r.question.explanation,
          correctAnswer: r.question.answer,
          userAnswer: r.userAnswer,
          topic: r.question.topic,
          timestamp: Date.now(),
        })
      );
    recordSession(results, seconds);
    navigate('/quiz/result', { state: { results, duration: seconds } });
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        mark="·"
        title="该分类下暂无题目"
        description="换一个分类，或直接来一场随机抽题。"
        action={
          <Button as={Link} to="/quiz" variant="secondary" size="sm">
            返回随机答题
          </Button>
        }
      />
    );
  }

  const answered = Object.keys(answers).length;

  return (
    <div>
      <PageHeader
        eyebrow={
          <>
            <span>答题中</span>
            <span aria-hidden="true">·</span>
            {category ? (
              <Badge tone={categoryTone(category)}>{categoryLabel(category)}</Badge>
            ) : (
              <Badge tone="stone">全部分类</Badge>
            )}
            <span aria-hidden="true">·</span>
            <span>共 {questions.length} 题</span>
          </>
        }
        title="现在开始"
        description={
          questions.some((q) => q.type === 'multi')
            ? '含多选题，请勾选所有正确选项后交卷。'
            : '选择你认为正确的选项，交卷后立即查看解析。'
        }
        actions={
          <span className="inline-flex items-center gap-2 rounded-pill bg-paper-sunken px-3.5 py-1.5 font-mono text-[16px] tabular-nums text-moss-700">
            <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-pill bg-moss-500" />
            {fmt(seconds)}
          </span>
        }
      />

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <Card key={q.category + '/' + q.id} className="animate-fade-up p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 shrink-0 font-display text-[20px] leading-none tabular-nums text-ink-faint">
                {String(qi + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-medium leading-relaxed text-ink">{q.stem}</p>
                <div className="mt-2.5">
                  <Badge tone={q.type === 'single' ? 'pine' : 'clay'}>
                    {q.type === 'single' ? '单选' : '多选'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              {q.options.map((opt, oi) => {
                const checked = (answers[q.id] || []).includes(oi);
                return (
                  <label
                    key={oi}
                    className={[
                      'group flex cursor-pointer items-center gap-3 rounded-ctrl border px-3 py-2.5 transition-all duration-200 ease-paper focus-within:ring-2 focus-within:ring-moss-600/25',
                      checked
                        ? 'border-moss-400 bg-moss-50'
                        : 'border-paper-line bg-paper-raised hover:border-moss-200 hover:bg-paper-sunken',
                    ].join(' ')}
                  >
                    <input
                      type={q.type === 'single' ? 'radio' : 'checkbox'}
                      name={q.id}
                      checked={checked}
                      onChange={() => toggle(q, oi)}
                      className="sr-only"
                    />
                    <span
                      className={[
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] font-mono text-[13px] font-semibold transition-all duration-200 ease-paper',
                        checked
                          ? 'bg-moss-600 text-white'
                          : 'bg-paper-sunken text-ink-faint group-hover:text-ink',
                      ].join(' ')}
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span
                      className={[
                        'text-[16px] leading-relaxed transition-colors duration-200 ease-paper',
                        checked ? 'text-ink' : 'text-ink-soft',
                      ].join(' ')}
                    >
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-paper-line pt-5">
        <span className="text-[14px] text-ink-faint">
          已作答 <span className="font-medium text-moss-700 tabular-nums">{answered}</span> /{' '}
          {questions.length}
        </span>
        <Button onClick={submit} size="lg">
          交卷
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </div>
  );
}
