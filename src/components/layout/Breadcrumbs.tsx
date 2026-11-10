import { Link } from "@/i18n/navigation";

export function Breadcrumbs({ items, label }: { items: { name: string; href?: string }[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-mist">
        {items.map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-ink/30">/</span>}
            {item.href ? (
              <Link href={item.href} className="link-line hover:text-ink">{item.name}</Link>
            ) : (
              <span aria-current="page" className="text-ink">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
