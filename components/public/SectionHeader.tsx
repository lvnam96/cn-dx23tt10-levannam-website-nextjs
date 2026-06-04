import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SectionHeader({
  index,
  eyebrow,
  title,
  href,
  hrefLabel = 'Xem tất cả',
  align = 'left',
  onDark = false,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  align?: 'left' | 'center';
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-wrap items-end gap-x-4 gap-y-2',
        align === 'center' ? 'flex-col items-center text-center' : 'justify-between'
      )}
    >
      <div>
        {(index || eyebrow) && (
          <p
            className={cn(
              'mb-2 text-xs font-semibold uppercase tracking-[0.2em]',
              onDark ? 'text-gold-400' : 'text-red'
            )}
          >
            {/* {index ? `${index} — ` : ''} */}
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            'font-heading text-2xl font-bold leading-tight md:text-3xl',
            onDark ? 'text-navy-50' : 'text-foreground'
          )}
        >
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-medium text-gold-600 hover:underline">
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}
