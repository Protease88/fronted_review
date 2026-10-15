export default function EmptyState({ mark = '·', title, description, action, className = '' }) {
  return (
    <div
      className={`flex animate-fade-in flex-col items-center justify-center rounded-card border border-dashed border-paper-line bg-paper-raised/70 px-6 py-14 text-center ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-pill bg-paper-sunken font-display text-xl text-ink-faint">
        {mark}
      </div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-faint">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
