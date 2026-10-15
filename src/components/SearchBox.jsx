import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { topics } from '../knowledge';
import { categoryTone } from '../constants/labels';

const TONE_TEXT = {
  clay: 'text-tone-clay',
  teal: 'text-tone-teal',
  pine: 'text-tone-pine',
  stone: 'text-tone-stone',
};

export default function SearchBox() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef(null);

  const fuse = useMemo(
    () =>
      new Fuse(topics, {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'categoryTitle', weight: 0.3 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    []
  );

  const trimmed = q.trim();
  const results = trimmed ? fuse.search(trimmed).map((r) => r.item) : [];
  const showPanel = open && trimmed.length > 0;

  useEffect(() => {
    function onDocMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function go(topic) {
    navigate(`/k/${topic.categoryId}/${topic.id}`);
    setQ('');
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative w-56 sm:w-72">
      <div className="group relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors duration-200 ease-paper group-focus-within:text-moss-600"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="搜索知识点…"
          aria-label="搜索知识点"
          className="w-full rounded-pill border border-paper-line bg-paper-raised/80 py-1.5 pl-9 pr-3 text-[14px] text-ink placeholder:text-ink-faint transition-all duration-200 ease-paper hover:border-moss-200 focus:border-moss-300 focus:bg-paper-raised focus:outline-none focus:ring-4 focus:ring-moss-600/10"
        />
      </div>

      {showPanel && (
        <div className="absolute right-0 z-50 mt-2 w-[19rem] animate-fade-up overflow-hidden rounded-card border border-paper-line bg-paper-raised shadow-lift">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-[14px] text-ink-faint">未找到相关知识点</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((t) => (
                <li key={`${t.categoryId}/${t.id}`}>
                  <button
                    type="button"
                    onClick={() => go(t)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors duration-150 ease-paper hover:bg-paper-sunken"
                  >
                    <span className="truncate text-[15px] text-ink">{t.title}</span>
                    <span
                      className={`shrink-0 text-[13px] ${TONE_TEXT[categoryTone(t.categoryId)] || TONE_TEXT.stone}`}
                    >
                      {t.categoryTitle}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
