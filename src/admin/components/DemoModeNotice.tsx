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
          Content is stored in Supabase and published records are used by the
          public website. Add content from the matching section to fill an empty
          area.
        </p>
      </div>
    </div>
  );
}
