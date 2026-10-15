export default function PageHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <header className={`mb-7 animate-fade-up ${className}`}>
      {eyebrow && (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[14px] text-ink-faint">
          {eyebrow}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-display-md font-semibold text-ink">{title}</h1>
          {description && (
            <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-ink-soft">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      <span aria-hidden="true" className="mt-4 block h-[2px] w-12 rounded-pill bg-moss-600" />
    </header>
  );
}
