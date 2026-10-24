import type { ReactNode } from "react";

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border-[1px] border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <div className="text-muted-foreground" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-semibold text-base text-foreground">{title}</h3>
      <p className="font-sans text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
