import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn } from "@/components/ui/animations";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { EventCard } from "@/components/shared/event-card";
import { EVENTS, EVENT_FILTERS, type EventFilter } from "@/data/events";
import { cn } from "@/lib/utils";
import { LINKS } from "@/config/links";

function formatResultCount(count: number, filter: EventFilter, label: string): string {
  if (filter === "All") return `Showing all ${count} event${count === 1 ? "" : "s"}`;
  const noun = count === 1 ? filter.toLowerCase() : label.toLowerCase();
  return `Showing ${count} ${noun}`;
}

export default function Events() {
  const [selected, setSelected] = useState<EventFilter>("All");
  const reduceMotion = useReducedMotion();
  const listTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" as const };

  const filtered = useMemo(
    () => (selected === "All" ? EVENTS : EVENTS.filter((event) => event.type === selected)),
    [selected],
  );

  const activeLabel = EVENT_FILTERS.find((f) => f.value === selected)?.label ?? "All";

  return (
    <Layout>
      <PageMeta {...SEO.events} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Events" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Calendar
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Events &amp; Opportunities
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto">
              Conferences, workshops, and recruitment opportunities for the
              MEDX community.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Filter bar */}
          <FadeIn className="mb-10">
            <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter events by category">
              {EVENT_FILTERS.map((filter) => {
                const active = filter.value === selected;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelected(filter.value)}
                    className={cn(
                      "px-4 py-2.5 border-[1px] font-mono text-xs uppercase tracking-widest transition-colors",
                      active
                        ? "border-accent text-accent bg-accent/5"
                        : "border-border text-secondary hover:border-accent/40 hover:text-accent",
                    )}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-center font-mono text-xs uppercase tracking-widest text-secondary">
              {formatResultCount(filtered.length, selected, activeLabel)}
            </p>
          </FadeIn>

          {filtered.length === 0 ? (
            <FadeIn>
              <Empty className="border-[1px] py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarDays aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No events found</EmptyTitle>
                  <EmptyDescription>
                    No upcoming events in this category. Check back soon for new
                    opportunities.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </FadeIn>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((event) => (
                <motion.div
                  key={event.name}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={listTransition}
                  className="mb-6"
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-semibold mb-6">
            Don't Miss an Opportunity
          </h2>
          <p className="font-sans text-accent-foreground/80 max-w-xl mx-auto mb-8">
            Follow MEDX on social media and join our community to stay updated
            on all events, workshops, and recruitment drives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={LINKS.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border-[1px] border-accent-foreground/30 text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-accent-foreground/10 transition-colors"
            >
              Follow on Instagram
            </a>
            <a
              href={LINKS.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border-[1px] border-accent-foreground/30 text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-accent-foreground/10 transition-colors"
            >
              Follow on LinkedIn
            </a>
          </div>
        </FadeIn>
      </section>
    </Layout>
  );
}
