import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">
          {eyebrow}
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
          {title}
        </h1>
        <div className="section-rule mb-3" />
        <p className="font-sans text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
  );
}
