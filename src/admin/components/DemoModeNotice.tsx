import { FlaskConical } from "lucide-react";

export function DemoModeNotice() {
  return (
    <div
      role="note"
      aria-label="Content storage notice"
      className="flex items-start gap-3 border-[1px] border-accent/30 bg-accent/5 px-4 py-3"
    >
      <FlaskConical
        size={18}
        strokeWidth={1.5}
        className="text-accent flex-shrink-0 mt-0.5"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
          Supabase content
        </p>
        <p className="font-sans text-xs sm:text-sm text-foreground/80 leading-relaxed">
          Content is stored in Supabase. Run the site-content migration SQL if a
          section is empty; published records are then used by the public website.
        </p>
      </div>
    </div>
  );
}
