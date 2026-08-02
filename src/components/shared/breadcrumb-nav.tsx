import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

/** Simple text breadcrumb - wayfinding for pages nested under a section (e.g. a department). */
export function BreadcrumbNav({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={11} aria-hidden="true" />}
            {item.href ? (
              <Link href={item.href} className="py-2 -my-2 hover:text-accent transition-colors">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-accent">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
