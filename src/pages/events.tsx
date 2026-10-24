import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Calendar, ArrowRight } from "lucide-react";
import { LINKS } from "@/config/links";
import { useSiteContent } from "@/hooks/use-site-content";

const statusStyles: Record<string, string> = {
  Upcoming: "badge-upcoming",
  Ongoing: "badge-ongoing",
  Completed: "badge-closed",
  Open: "badge-open",
};

export default function Events() {
  const { events } = useSiteContent();

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
          <StaggerContainer className="space-y-6">
            {events.map((event, i) => (
              <StaggerItem
                key={i}
                className="border-[1px] border-border bg-background hover:bg-card transition-colors group overflow-hidden"
              >
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
