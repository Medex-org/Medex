import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export interface ResearchProject {
  title: string;
  lead: string;
  /** ISO date string, e.g. "2026-07-08" */
  startDate: string;
  /** ISO date string, e.g. "2026-09-08" */
  endDate: string;
}

function computeProgress(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

export function ResearchTracker({ projects }: { projects: ResearchProject[] }) {
  return (
    <div className="space-y-6">
      {projects.map((p) => {
        const pct = computeProgress(p.startDate, p.endDate);
        return (
          <div key={p.title} className="p-6 border-[1px] border-border bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-semibold text-base">{p.title}</h3>
                <p className="text-sm text-secondary font-mono">by {p.lead}</p>
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-accent flex-shrink-0">
                {pct}% Complete
              </span>
            </div>
            <Progress value={pct} className="h-1.5" aria-label={`${p.title} progress`} />
            <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
              <span>Started {format(new Date(p.startDate), "MMM d")}</span>
              <span>Expected {format(new Date(p.endDate), "MMM d")}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
