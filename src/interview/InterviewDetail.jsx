import { useParams, Link } from 'react-router-dom';
import { getQuestionById } from './bank';
import MarkdownView from '../components/MarkdownView';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import {
  companyLabel,
  categoryLabel,
  categoryTone,
  DIFFICULTY_TONES,
} from '../constants/labels';

export default function InterviewDetail() {
  const { id } = useParams();
  const q = getQuestionById(id);

  // 2.4 题目不存在的空 / 错误状态
  if (!q) {
    return (
      <EmptyState
        mark="?"
        title="未找到该面试题"
        description={`题目 ID：${id}`}
        action={
          <Button as={Link} to="/interview" variant="secondary" size="sm">
            ← 返回面试题列表
          </Button>
        }
      />
    );
  }

  return (
    <article className="animate-fade-up">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-[14px] text-ink-faint">
        <Link
          to="/interview"
          className="rounded-pill px-2 py-0.5 transition-colors duration-200 ease-paper hover:bg-paper-sunken hover:text-ink"
        >
          ← 面试题列表
        </Link>
        <span aria-hidden="true">/</span>
        <Badge tone="primary">{companyLabel(q.company)}</Badge>
      </nav>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone={categoryTone(q.category)}>{categoryLabel(q.category)}</Badge>
        <Badge tone={DIFFICULTY_TONES[q.difficulty] || 'stone'}>{q.difficulty}</Badge>
        {q.round && <Badge tone="neutral">{q.round}</Badge>}
        {q.topic && (
          <Link to={`/k/${q.category}/${q.topic}`}>
            <Badge tone="clay" className="transition-opacity duration-200 ease-paper hover:opacity-75">
              去复习：{categoryLabel(q.category)}
            </Badge>
          </Link>
        )}
      </div>

      <h1 className="mb-5 font-display text-[24px] font-semibold leading-relaxed text-ink">
        {q.question}
      </h1>

      <Card accent={categoryTone(q.category)} className="px-6 py-6 sm:px-8 sm:py-7">
        <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-ink-faint">
          <span aria-hidden="true" className="h-3 w-[2px] rounded-pill bg-moss-500" />
          参考答案
        </h2>
        <MarkdownView content={q.answer} />
      </Card>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button as={Link} to="/interview" variant="ghost" size="sm">
          ← 返回列表
        </Button>
        <Button as={Link} to={`/quiz?category=${q.category}`} variant="secondary" size="sm">
          练一练这个分类
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </article>
  );
}
