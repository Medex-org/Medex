import { Calendar, ArrowRight } from "lucide-react";
import type { EventItem, EventStatus } from "@/data/events";

const statusStyles: Record<EventStatus, string> = {
  Upcoming: "badge-upcoming",
  Ongoing: "badge-ongoing",
  Completed: "badge-closed",
  Open: "badge-open",
};

export function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="border-[1px] border-border bg-background hover:bg-card transition-colors group overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Fixed-width image slot - present or absent, layout stays consistent */}
        <div className="md:w-52 flex-shrink-0 overflow-hidden bg-muted">
          {event.image ? (
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-40 md:h-full object-cover img-scholarly"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-2 md:h-full md:w-52" aria-hidden="true" />
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col flex-grow gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span
              className={`inline-block px-3 py-1 border-[1px] text-xs uppercase tracking-widest font-mono w-fit ${
                statusStyles[event.status] ?? "badge-upcoming"
              }`}
            >
              {event.status}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-secondary">
              {event.type}
            </span>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
              {event.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-secondary font-mono mb-3">
              <Calendar size={13} aria-hidden="true" />
              {event.date}
            </div>
            <p className="font-sans text-muted-foreground leading-relaxed text-sm">
              {event.desc}
            </p>
          </div>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 py-2 -my-2 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity mt-auto group/link w-fit"
            >
              {event.linkLabel}{" "}
              <ArrowRight
                size={13}
                className="group-hover/link:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
