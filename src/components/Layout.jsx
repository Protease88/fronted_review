import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchBox from './SearchBox';
import DifyChat from './DifyChat';

const NAV = [
  { to: '/', label: '知识框架', end: true },
  { to: '/interview', label: '面试题' },
  { to: '/quiz', label: '答题' },
  { to: '/wrong', label: '错题本' },
  { to: '/stats', label: '统计' },
];

function navClass({ isActive }) {
  return [
    'relative shrink-0 rounded-pill px-4 py-2 text-[17px] font-medium transition-all duration-200 ease-paper',
    isActive
      ? "font-semibold text-moss-700 after:absolute after:inset-x-3.5 after:-bottom-1 after:h-[3px] after:rounded-pill after:bg-moss-600 after:content-['']"
      : 'text-ink-soft hover:bg-paper-sunken hover:text-ink',
  ].join(' ');
}

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen text-ink">
      <header
        className={[
          'fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-paper',
          scrolled
            ? 'border-b border-paper-line bg-paper/85 shadow-soft backdrop-blur-md'
            : 'border-b border-transparent bg-paper/60 backdrop-blur-sm',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 transition-opacity duration-200 ease-paper hover:opacity-85"
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center transition-transform duration-300 ease-paper group-hover:-rotate-6">
              <svg
                viewBox="0 0 44 44"
                aria-hidden="true"
                className="h-11 w-11 drop-shadow-[0_4px_10px_rgba(20,101,79,0.32)]"
              >
                <defs>
                  <linearGradient id="brandHex" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1F7A61" />
                    <stop offset="100%" stopColor="#0A3629" />
                  </linearGradient>
                </defs>
                {/* 六边形底：呼应首页能力雷达图 */}
                <path d="M22 2.6 L38.9 12.3 L38.9 31.7 L22 41.4 L5.1 31.7 L5.1 12.3 Z" fill="url(#brandHex)" />
                <path
                  d="M22 2.6 L38.9 12.3 L38.9 31.7 L22 41.4 L5.1 31.7 L5.1 12.3 Z"
                  fill="none"
                  stroke="#C8703A"
                  strokeWidth="1.3"
                  opacity="0.6"
                />
                <path
                  d="M22 7.6 L34.5 14.9 L34.5 29.1 L22 36.4 L9.5 29.1 L9.5 14.9 Z"
                  fill="none"
                  stroke="#E0A173"
                  strokeWidth="1"
                  opacity="0.45"
                />
                {/* 前端符号 </> */}
                <path
                  d="M17.6 16.6 L13 22 L17.6 27.4"
                  fill="none"
                  stroke="#F6E7DC"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M26.4 16.6 L31 22 L26.4 27.4"
                  fill="none"
                  stroke="#F6E7DC"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24.9 14.9 L19.1 29.1"
                  fill="none"
                  stroke="#E0A173"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="leading-none">
              <span className="block bg-gradient-to-r from-moss-700 via-moss-600 to-ochre-500 bg-clip-text font-display text-[23px] font-bold tracking-tight text-transparent">
                前端面试复习
              </span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-faint">
                Frontend Interview
              </span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <SearchBox />
          </div>
        </div>

        {/* 移动端导航：横向滚动条 */}
        <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-2.5 [&::-webkit-scrollbar]:hidden md:hidden [scrollbar-width:none]">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-[140px] sm:px-6 md:pt-[96px]">
        {children}
      </main>

      <footer className="border-t border-paper-line/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-[15px] text-ink-faint sm:px-6">
          <span className="font-display">前端面试复习 · 把零散知识串成体系</span>
          <span>知识框架 · 大厂真题 · 答题自测</span>
        </div>
      </footer>

      {/* Dify AI 助手：注入右下角悬浮气泡，全站可用 */}
      <DifyChat />
    </div>
  );
}
