import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Calendar, Newspaper } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";

function formatUpdateDate(value: string): string {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Updates() {
  const { updates } = useSiteContent();

  return (
    <Layout>
      <PageMeta {...SEO.updates} />

      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Updates" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 flex items-center justify-center gap-2">
              <Newspaper size={14} aria-hidden="true" /> Newsroom
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              News &amp; Updates
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto">
              Announcements, recruitment drives, and program updates from the
              MEDX R&amp;Ed community.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {updates.length === 0 ? (
            <FadeIn className="p-12 border-[1px] border-dashed border-border bg-card text-center">
              <Newspaper
                size={28}
                strokeWidth={1.2}
                className="mx-auto mb-4 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold mb-2">No updates yet</h2>
              <p className="font-sans text-sm text-muted-foreground">
                New announcements will appear here as soon as they are published.
              </p>
            </FadeIn>
          ) : (
            <StaggerContainer className="space-y-6">
              {updates.map((update) => (
                <StaggerItem
                  key={update.id}
                  className="border-[1px] border-border bg-background hover:bg-card transition-colors group overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-52 flex-shrink-0 overflow-hidden bg-muted">
                      {update.image ? (
                        <img
                          src={update.image}
                          alt={update.title}
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
                        {update.category ? (
                          <span className="inline-block px-3 py-1 border-[1px] badge-open text-xs uppercase tracking-widest font-mono w-fit">
                            {update.category}
                          </span>
                        ) : null}
                        {update.date ? (
                          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary">
                            <Calendar size={13} aria-hidden="true" />
                            {formatUpdateDate(update.date)}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                          {update.title}
                        </h2>
                        <p className="font-sans text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                          {update.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </Layout>
  );
}
