import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import FrameworkTree from '../components/FrameworkTree';
import HexRadar from '../components/HexRadar';

const ACTIONS = [
  {
    to: '/interview',
    title: '大厂面试题',
    desc: '阿里 / 腾讯 / 字节真题与参考答案',
    icon: 'M7 3.5h6a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 15V5A1.5 1.5 0 0 1 7 3.5Z M8 8h4 M8 11h4',
    primary: false,
    delay: 'stagger-1',
  },
  {
    to: '/quiz',
    title: '开始答题',
    desc: '随机抽题，交卷即出正确率',
    icon: 'M4.5 10.5 8 14l7.5-8',
    primary: false,
    delay: 'stagger-2',
  },
  {
    to: '/wrong',
    title: '错题本',
    desc: '自动收录答错的题，反复巩固',
    icon: 'M6.5 3.5h5l3 3v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z M9 3.6V7h3.4',
    primary: false,
    delay: 'stagger-3',
  },
  {
    to: '/stats',
    title: '统计',
    desc: '正确率趋势与分类强弱项',
    icon: 'M4.5 16V11 M9 16V5 M13.5 16v-4 M18 16V8',
    primary: false,
    delay: 'stagger-4',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative mb-8 animate-fade-up overflow-hidden rounded-card border border-paper-line bg-paper-raised/70 px-6 py-9 shadow-soft sm:px-9 sm:py-11">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-moss-600/[0.06] blur-2xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-pill bg-moss-50 px-3.5 py-1.5 text-[15px] font-medium text-moss-700">
              <span className="h-1.5 w-1.5 rounded-pill bg-moss-500" />
              知识框架 · 大厂真题 · 答题自测
            </span>
            <h1 className="mt-4 font-display text-[42px] font-semibold leading-[1.22] tracking-tight text-ink sm:text-[52px]">
              把零散的前端知识
              <br className="hidden sm:block" />
              串成能讲清楚的体系
            </h1>
            <p className="mt-4 text-[18px] leading-relaxed text-ink-soft">
              沿 JavaScript、CSS、网络与 HTTP 三条主线梳理考点，配合大厂真题与在线答题，定位薄弱项逐个击破。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button as={Link} to="/quiz" variant="tint" size="lg">
                开始答题
                <span aria-hidden="true">→</span>
              </Button>
              <Button as={Link} to="/interview" variant="tint" size="lg">
                看看大厂真题
              </Button>
            </div>
          </div>
          <HexRadar />
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className={[
              'group animate-fade-up flex flex-col justify-between rounded-card border p-5 transition-all duration-200 ease-paper',
              a.delay,
              a.primary
                ? 'border-transparent bg-moss-600 text-white shadow-soft hover:-translate-y-[2px] hover:bg-moss-700 hover:shadow-lift'
                : 'border-paper-line bg-paper-raised text-ink shadow-soft hover:-translate-y-[2px] hover:border-moss-200 hover:shadow-lift',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex items-start justify-between">
              <span
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-ctrl transition-colors duration-200 ease-paper',
                  a.primary
                    ? 'bg-white/15 text-white'
                    : 'bg-paper-sunken text-moss-600 group-hover:bg-moss-50',
                ].join(' ')}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={a.icon} />
                </svg>
              </span>
              <span
                aria-hidden="true"
                className={[
                  'translate-y-0.5 text-[16px] transition-transform duration-200 ease-paper group-hover:translate-x-1',
                  a.primary ? 'text-white/80' : 'text-ink-faint group-hover:text-moss-600',
                ].join(' ')}
              >
                →
              </span>
            </div>
            <div className="mt-4">
              <div className="font-display text-[20px] font-semibold">{a.title}</div>
              <p
                className={[
                  'mt-1.5 text-[15px] leading-relaxed',
                  a.primary ? 'text-white/80' : 'text-ink-faint',
                ].join(' ')}
              >
                {a.desc}
              </p>
            </div>
          </Link>
        ))}
      </section>

      <FrameworkTree />
    </div>
  );
}
