import { useMemo } from "react";
import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { LightboxImage } from "@/components/shared/lightbox-image";
import { ShareActions } from "@/components/shared/share-actions";
import { PageMeta } from "@/components/ui/page-meta";
import { Progress } from "@/components/ui/progress";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { LINKS } from "@/config/links";
import { useSiteContent } from "@/hooks/use-site-content";
import { mapUrlForLocation, stripCoordinates } from "@/lib/geo";

const statusStyles: Record<string, string> = {
  Upcoming: "badge-upcoming",
  Ongoing: "badge-ongoing",
  Completed: "badge-closed",
  Open: "badge-open",
};

const STATUS_ORDER: Record<string, number> = {
  Ongoing: 0,
  Upcoming: 1,
  Open: 1,
  Completed: 2,
};

const STATUS_BAR: Record<string, string> = {
  Ongoing: "bg-accent",
  Upcoming: "bg-primary/40",
  Completed: "bg-muted-foreground/30",
};

const TRACKED_STATUSES = ["Ongoing", "Upcoming", "Completed"] as const;

export default function Events() {
  const { events } = useSiteContent();
  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => {
        const statusDiff =
          (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3);
        if (statusDiff !== 0) return statusDiff;
        return (a.startDate || "").localeCompare(b.startDate || "");
      }),
    [events],
  );
  const counts = useMemo(
    () => ({
      Ongoing: events.filter((event) => event.status === "Ongoing").length,
      Upcoming: events.filter((event) => event.status === "Upcoming").length,
      Completed: events.filter((event) => event.status === "Completed").length,
    }),
    [events],
  );
  const trackedTotal = counts.Ongoing + counts.Upcoming + counts.Completed;

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

      {trackedTotal > 0 ? (
        <section className="border-b-[1px] border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-3 divide-x-[1px] divide-border border-[1px] border-border bg-background">
              {TRACKED_STATUSES.map((status) => (
                <div key={status} className="px-4 py-5 text-center">
                  <p className="font-mono text-2xl font-semibold text-primary">
                    {counts[status]}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">
                    {status}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-1.5 w-full overflow-hidden bg-muted">
              {TRACKED_STATUSES.map((status) => (
                <div
                  key={status}
                  className={STATUS_BAR[status]}
                  style={{ width: `${(counts[status] / trackedTotal) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="space-y-6">
            {sortedEvents.map((event) => (
              <StaggerItem
                key={event.id}
                id={`event-${event.id}`}
                className="scroll-mt-32 border-[1px] border-border bg-background hover:bg-card transition-colors group overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Fixed-width image slot - present or absent, layout stays consistent */}
                  <div className="md:w-52 flex-shrink-0 overflow-hidden bg-muted">
                    {event.image ? (
                      <LightboxImage
                        src={event.image}
                        alt={event.name}
                        caption={event.name}
                        className="h-56 sm:h-64 md:h-full"
                        imageClassName="object-contain"
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
                      {stripCoordinates(event.location) || mapUrlForLocation(event.location) ? (
                        <div className="flex flex-wrap items-center gap-2 text-sm text-secondary font-mono mb-3">
                          <MapPin size={13} aria-hidden="true" />
                          {stripCoordinates(event.location) ? (
                            <span>{stripCoordinates(event.location)}</span>
                          ) : null}
                          {mapUrlForLocation(event.location) ? (
                            <a
                              href={mapUrlForLocation(event.location) ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent hover:opacity-70 transition-opacity"
                            >
                              View map
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                      <p className="font-sans text-muted-foreground leading-relaxed text-sm">
                        {event.desc}
                      </p>
                      {event.status === "Ongoing" &&
                      typeof event.progress === "number" ? (
                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-secondary">
                            <span>Ongoing progress</span>
                            <span>{event.progress}%</span>
                          </div>
                          <Progress
                            value={event.progress}
                            className="h-1.5"
                            aria-label={`${event.name} progress`}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-auto flex flex-col items-start gap-2">
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 py-2 -my-2 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity group/link w-fit"
                        >
                          {event.linkLabel}{" "}
                          <ArrowRight
                            size={13}
                            className="group-hover/link:translate-x-1 transition-transform"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                      <ShareActions
                        title={event.name}
                        anchor={`event-${event.id}`}
                        caption={[event.name, event.date].filter(Boolean).join(" — ")}
                        image={event.image}
                      />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
