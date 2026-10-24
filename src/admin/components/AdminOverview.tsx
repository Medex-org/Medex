import {
  BookOpen,
  CalendarDays,
  Images,
  Newspaper,
  Pencil,
  Plus,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { AdminSection } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import { formatDemoDate, formatDemoDateShort, isUpcoming } from "../admin-utils";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { AdminEmptyState } from "./AdminEmptyState";

interface RecentEntry {
  id: string;
  section: AdminSection;
  type: string;
  title: string;
  meta: string;
  status: "draft" | "published";
  lastUpdated: string;
}

export function AdminOverview({
  onSectionChange,
  onRequestCreate,
  onRequestEdit,
}: {
  onSectionChange: (section: AdminSection) => void;
  onRequestCreate: (section: AdminSection) => void;
  onRequestEdit: (section: AdminSection, id: string) => void;
}) {
  const { courses, news, events, media } = useAdminStore();

  const publishedCourses = courses.filter((c) => c.status === "published").length;
  const publishedNews = news.filter((n) => n.status === "published").length;
  const publishedEvents = events.filter((e) => e.status === "published").length;

  const summary = [
    {
      section: "courses" as const,
      label: "Courses",
      count: courses.length,
      detail: `${publishedCourses} published`,
      icon: BookOpen,
    },
    {
      section: "news" as const,
      label: "News & Updates",
      count: news.length,
      detail: `${publishedNews} published`,
      icon: Newspaper,
    },
    {
      section: "events" as const,
      label: "Events",
      count: events.length,
      detail: `${publishedEvents} published`,
      icon: CalendarDays,
    },
    {
      section: "media" as const,
      label: "Media assets",
      count: media.length,
      detail: "Bundled sample files",
      icon: Images,
    },
  ];

  const recent: RecentEntry[] = [
    ...courses.map((course) => ({
      id: course.id,
      section: "courses" as const,
      type: "Course",
      title: course.title,
      meta: course.category,
      status: course.status,
      lastUpdated: course.lastUpdated,
    })),
    ...news.map((item) => ({
      id: item.id,
      section: "news" as const,
      type: "Update",
      title: item.title,
      meta: item.category,
      status: item.status,
      lastUpdated: item.lastUpdated,
    })),
    ...events.map((event) => ({
      id: event.id,
      section: "events" as const,
      type: "Event",
      title: event.title,
      meta: event.category,
      status: event.status,
      lastUpdated: event.lastUpdated,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    )
    .slice(0, 5);

  const upcoming = events
    .filter((event) => isUpcoming(event.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <>
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">
          Supabase workspace
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
          Content overview
        </h1>
        <div className="section-rule mb-3" />
        <p className="font-sans text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Manage content stored in Supabase. Published records are used by the
          public website; empty migrated sections continue to use the existing
          public fallback until their seed data is loaded.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {summary.map(({ section, label, count, detail, icon: Icon }) => (
          <button
            key={section}
            type="button"
            onClick={() => onSectionChange(section)}
            className="text-left border-[1px] border-border bg-card p-5 hover:border-accent/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <Icon
                size={20}
                strokeWidth={1.5}
                className="text-accent"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                View
              </span>
            </div>
            <p className="font-mono text-3xl font-semibold text-primary leading-none mb-2">
              {count}
            </p>
            <p className="text-sm font-semibold">{label}</p>
            <p className="font-sans text-xs text-muted-foreground mt-1">
              {detail}
            </p>
          </button>
        ))}
      </div>

      <section aria-labelledby="quick-actions-heading" className="mb-8">
        <h2
          id="quick-actions-heading"
          className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-3"
        >
          Quick actions
        </h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <Button
            onClick={() => onRequestCreate("courses")}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={15} aria-hidden="true" /> Add a course
          </Button>
          <Button
            variant="outline"
            onClick={() => onRequestCreate("news")}
          >
            <Plus size={15} aria-hidden="true" /> Create an update
          </Button>
          <Button
            variant="outline"
            onClick={() => onRequestCreate("events")}
          >
            <Plus size={15} aria-hidden="true" /> Create an event
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section
          aria-labelledby="recent-content-heading"
          className="border-[1px] border-border bg-card"
        >
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b-[1px] border-border">
            <h2
              id="recent-content-heading"
              className="font-semibold text-sm text-primary"
            >
              Recent content
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Last updated
            </span>
          </div>
          {recent.length === 0 ? (
            <div className="p-4">
              <AdminEmptyState
                icon={<BookOpen size={24} strokeWidth={1.2} />}
                title="Nothing here yet"
                description="Create sample content to see it appear in this list."
              />
            </div>
          ) : (
            <ul className="divide-y-[1px] divide-border">
              {recent.map((entry) => (
                <li
                  key={`${entry.section}-${entry.id}`}
                  className="flex items-start justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
                        {entry.type}
                      </span>
                      <ContentStatusBadge status={entry.status} />
                    </div>
                    <p className="text-sm font-medium line-clamp-1">
                      {entry.title}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                      {entry.meta} · {formatDemoDate(entry.lastUpdated)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRequestEdit(entry.section, entry.id)}
                    aria-label={`Edit ${entry.title}`}
                    className="flex-shrink-0"
                  >
                    <Pencil size={13} aria-hidden="true" /> Edit
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="upcoming-events-heading"
          className="border-[1px] border-border bg-card"
        >
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b-[1px] border-border">
            <h2
              id="upcoming-events-heading"
              className="font-semibold text-sm text-primary"
            >
              Upcoming events
            </h2>
            <Link
              href="/events"
              className="font-mono text-[10px] uppercase tracking-widest text-secondary hover:text-accent transition-colors"
            >
              Public events
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-4">
              <AdminEmptyState
                icon={<CalendarDays size={24} strokeWidth={1.2} />}
                title="No upcoming sample events"
                description="Add an event with a future date to preview this section."
              />
            </div>
          ) : (
            <ul className="divide-y-[1px] divide-border">
              {upcoming.map((event) => (
                <li
                  key={event.id}
                  className="flex items-start justify-between gap-3 px-5 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                        {formatDemoDateShort(event.date)}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {event.time} {event.timezone}
                      </span>
                      <ContentStatusBadge status={event.status} />
                    </div>
                    <p className="text-sm font-medium line-clamp-1">
                      {event.title}
                    </p>
                    <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                      {event.locationType}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRequestEdit("events", event.id)}
                    aria-label={`Edit ${event.title}`}
                    className="flex-shrink-0"
                  >
                    <Pencil size={13} aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
