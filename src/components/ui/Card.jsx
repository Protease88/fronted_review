const BASE =
  'relative overflow-hidden rounded-card border border-paper-line bg-paper-raised transition-all duration-200 ease-paper';

const VARIANTS = {
  surface: 'shadow-soft',
  elevated: 'shadow-lift',
  flat: 'shadow-none border-paper-line-soft',
  interactive:
    'shadow-soft cursor-pointer hover:-translate-y-[2px] hover:border-moss-200 hover:shadow-lift',
};

const ACCENTS = {
  clay: 'accent-clay',
  teal: 'accent-teal',
  pine: 'accent-pine',
  stone: 'accent-stone',
  success: 'accent-success',
  warning: 'accent-warning',
  danger: 'accent-danger',
};

export default function Card({
  as: Tag = 'div',
  variant = 'surface',
  accent,
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={[BASE, VARIANTS[variant] || VARIANTS.surface, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {accent && (
        <span
          aria-hidden="true"
          className={`absolute left-0 top-0 h-full w-[3px] rounded-l-card ${ACCENTS[accent] || ACCENTS.stone}`}
        />
      )}
      {children}
    </Tag>
  );
}
