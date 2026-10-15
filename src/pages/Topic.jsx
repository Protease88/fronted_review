import { useParams, Link } from 'react-router-dom';
import { getTopic } from '../knowledge';
import MarkdownView from '../components/MarkdownView';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { categoryTone, categoryLabel } from '../constants/labels';

export default function Topic() {
  const { category, topic } = useParams();
  const item = getTopic(category, topic);

  if (!item) {
    return (
      <EmptyState
        mark="?"
        title="未找到该知识点"
        description={`分类：${categoryLabel(category)} / 主题：${topic}`}
        action={
          <Button as={Link} to="/" variant="secondary" size="sm">
            ← 返回知识框架
          </Button>
        }
      />
    );
  }

  const content = item.raw || '# 内容缺失\n\n该知识点的 Markdown 文件未找到。';

  return (
    <article className="animate-fade-up">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-[14px] text-ink-faint">
        <Link
          to="/"
          className="rounded-pill px-2 py-0.5 transition-colors duration-200 ease-paper hover:bg-paper-sunken hover:text-ink"
        >
          知识框架
        </Link>
        <span aria-hidden="true">/</span>
        <Badge tone={categoryTone(category)}>{item.categoryTitle}</Badge>
      </nav>

      <Card accent={categoryTone(category)} className="px-6 py-7 sm:px-9 sm:py-9">
        <MarkdownView content={content} />
      </Card>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button as={Link} to="/" variant="ghost" size="sm">
          ← 返回知识框架
        </Button>
        <Button as={Link} to={`/quiz?category=${category}`} variant="secondary" size="sm">
          练一练这个分类
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </article>
  );
}
