const BASE =
  'inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-[13px] font-medium leading-5 whitespace-nowrap';

const TONES = {
  neutral: 'bg-paper-sunken text-ink-soft',
  primary: 'bg-moss-50 text-moss-700',
  clay: 'bg-tone-clay text-tone-clay',
  teal: 'bg-tone-teal text-tone-teal',
  pine: 'bg-tone-pine text-tone-pine',
  stone: 'bg-tone-stone text-tone-stone',
  success: 'bg-tone-success text-tone-success',
  warning: 'bg-tone-warning text-tone-warning',
  danger: 'bg-tone-danger text-tone-danger',
};

export default function Badge({ tone = 'neutral', className = '', children, ...rest }) {
  return (
    <span
      className={[BASE, TONES[tone] || TONES.neutral, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </span>
  );
}
