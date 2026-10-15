import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWrong, clearWrong } from './storage';
import BackupButtons from './BackupButtons';
import { toLetters } from './scoring';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { categoryLabel, categoryTone } from '../constants/labels';

export default function Wrong() {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(getWrong());
  }, []);

  function clearAll() {
    if (!window.confirm('确定清空错题本？建议先导出备份。')) return;
    clearWrong();
    setList([]);
  }

  const refresh = () => setList(getWrong());

  if (list.length === 0) {
    return (
      <EmptyState
        mark="✓"
        title="暂无错题"
        description="答错的题目会自动收进这里，方便你集中回看；也可导入之前的备份恢复。"
        action={
          <div className="flex flex-col items-center gap-3">
            <Button as={Link} to="/quiz" size="sm">
              去答题
            </Button>
            <BackupButtons onImported={refresh} />
          </div>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={
          <>
            <span>错题本</span>
            <span aria-hidden="true">·</span>
            <span>{list.length} 道待巩固</span>
          </>
        }
        title="把错题变成得分点"
        description="每道题都标注了你的选择与正确答案，配合解析逐条消化。"
        actions={
          <>
            <BackupButtons onImported={refresh} />
            <Button onClick={clearAll} variant="danger" size="sm">
              清空错题本
            </Button>
          </>
        }
      />

      <div className="space-y-3">
        {list.map((w) => (
          <Card
            key={w.category + '/' + w.id}
            accent="danger"
            variant="flat"
            className="animate-fade-up p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="min-w-0 flex-1 text-[16px] font-medium leading-relaxed text-ink">
                {w.stem}
              </p>
              <Badge tone={categoryTone(w.category)}>{categoryLabel(w.category)}</Badge>
            </div>

            {Array.isArray(w.options) && w.options.length > 0 && (
              <ul className="mt-3 space-y-1">
                {w.options.map((opt, oi) => {
                  const isUser = Array.isArray(w.userAnswer) && w.userAnswer.includes(oi);
                  const isCorrect = Array.isArray(w.correctAnswer) && w.correctAnswer.includes(oi);
                  let cls = 'text-ink-soft';
                  if (isCorrect) cls = 'text-tone-success font-medium';
                  else if (isUser) cls = 'text-tone-danger font-medium';
                  return (
                    <li
                      key={oi}
                      className={`flex items-start gap-2 rounded-ctrl px-2 py-1 text-[15px] ${cls} ${
                        isCorrect ? 'bg-tone-success' : isUser ? 'bg-tone-danger' : ''
                      }`}
                    >
                      <span className="font-mono text-[13px] opacity-70">
                        {toLetters([oi])}.
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isCorrect && <span aria-hidden="true">✓</span>}
                      {isUser && !isCorrect && <span aria-hidden="true">✗</span>}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-ctrl bg-tone-danger px-3.5 py-2">
                <div className="text-[13px] text-tone-danger">你的答案</div>
                <div className="font-mono text-[15px] text-ink">
                  {toLetters(w.userAnswer) || '（未答）'}
                </div>
              </div>
              <div className="rounded-ctrl bg-tone-success px-3.5 py-2">
                <div className="text-[13px] text-tone-success">正确答案</div>
                <div className="font-mono text-[15px] text-ink">{toLetters(w.correctAnswer)}</div>
              </div>
            </div>

            {w.explanation && (
              <div className="mt-3 rounded-ctrl bg-paper-sunken px-3.5 py-2.5 text-[15px] leading-relaxed text-ink-soft">
                <span className="font-medium text-ink">解析：</span>
                {w.explanation}
              </div>
            )}

            {w.topic && (
              <div className="mt-3">
                <Button
                  as={Link}
                  to={`/k/${w.category}/${w.topic}`}
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
