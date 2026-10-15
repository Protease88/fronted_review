import { Link } from 'react-router-dom';
import { framework } from '../knowledge';
import { categoryTone } from '../constants/labels';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';

const TONE_TEXT = {
  clay: 'text-tone-clay',
  teal: 'text-tone-teal',
  pine: 'text-tone-pine',
  stone: 'text-tone-stone',
};

// 交错动画类需为完整字面量，确保被 Tailwind 扫描保留
const STAGGER = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];

export default function FrameworkTree() {
  const categories = framework.categories;
  const topicCount = categories.reduce((n, c) => n + c.topics.length, 0);

  if (categories.length === 0) {
    return (
      <EmptyState
        mark="空"
        title="暂无知识内容"
        description="在 content/knowledge 下新增 Markdown 与索引后即可自动展示。"
      />
    );
  }

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[28px] font-semibold text-ink">知识框架</h2>
          <p className="mt-1.5 text-[15px] text-ink-faint">
            {categories.length} 个分类 · {topicCount} 个知识点
          </p>
        </div>
        <span aria-hidden="true" className="h-[2px] w-16 rounded-pill bg-paper-line" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((cat, i) => {
          const tone = categoryTone(cat.id);
          return (
            <Card
              key={cat.id}
              variant="interactive"
              accent={tone}
              className={`animate-fade-up ${STAGGER[i % STAGGER.length]} p-5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-baseline gap-2.5">
                  <span
                    className={`font-display text-[30px] leading-none opacity-45 ${TONE_TEXT[tone]}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`truncate font-display text-[23px] font-semibold ${TONE_TEXT[tone]}`}>
                    {cat.title}
                  </h3>
                </div>
                <Badge tone={tone}>{cat.topics.length} 个知识点</Badge>
              </div>

              <ul className="mt-3.5 space-y-0.5">
                {cat.topics.map((t) => (
                  <li key={t.id}>
                    <Link
                      to={`/k/${cat.id}/${t.id}`}
                      className="group -mx-2 flex items-center gap-2.5 rounded-ctrl px-2 py-1.5 transition-all duration-200 ease-paper hover:bg-paper-sunken"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-pill bg-paper-line transition-colors duration-200 ease-paper group-hover:bg-moss-500"
                      />
                      <span className="flex-1 truncate text-[17px] text-ink-soft transition-colors duration-200 ease-paper group-hover:text-ink">
                        {t.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-[14px] text-ink-faint opacity-0 transition-opacity duration-200 ease-paper group-hover:opacity-100"
                      >
                        查看 →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-paper-line-soft pt-3.5">
                <Button as={Link} to={`/quiz?category=${cat.id}`} variant="tint" size="sm">
                  按分类答题
                  <span aria-hidden="true">→</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
