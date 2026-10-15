const BASE =
  'inline-flex select-none items-center justify-center gap-1.5 rounded-ctrl font-medium transition-all duration-200 ease-paper disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS = {
  primary:
    'bg-moss-600 text-white shadow-soft hover:bg-moss-700 hover:shadow-lift active:translate-y-[1px]',
  secondary:
    'border border-paper-line bg-paper-raised text-ink-soft shadow-none hover:border-moss-300 hover:text-moss-700 hover:shadow-soft',
  tint:
    'border border-moss-300/60 bg-moss-50 text-moss-700 shadow-none hover:border-moss-400 hover:bg-moss-100 hover:text-moss-800 hover:shadow-soft',
  ghost: 'text-ink-soft hover:bg-paper-sunken hover:text-ink',
  danger:
    'border border-tone-danger/25 bg-paper-raised text-tone-danger hover:bg-tone-danger hover:text-white hover:border-tone-danger',
  link: 'text-moss-600 underline-offset-4 hover:text-moss-700 hover:underline',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-[15px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-[16px]',
};

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={[BASE, VARIANTS[variant] || VARIANTS.primary, SIZES[size] || SIZES.md, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
