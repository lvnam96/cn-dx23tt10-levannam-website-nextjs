import Link from 'next/link';

export type CrossLink = {
  href: string;
  title: string;
  description: string;
  icon?: string; // emoji or short glyph
  linkText?: string;
};

export function CrossLinkCards({ links }: { links: CrossLink[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {links.map((l) => (
        <Link
          key={l.href + l.title}
          href={l.href}
          className="group flex h-full flex-col rounded-lg border border-border bg-paper-card p-5 transition-shadow hover:shadow-lg"
        >
          {l.icon && <span className="text-2xl">{l.icon}</span>}
          <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{l.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{l.description}</p>
          <span className="mt-auto pt-3 text-sm font-medium text-red group-hover:underline">
            {l.linkText || 'Khám phá'} →
          </span>
        </Link>
      ))}
    </div>
  );
}
