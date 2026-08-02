import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight } from "lucide-react";
import { RegionalDashboard } from "@/components/shared/regional-dashboard";
import { REGIONAL_LEADERSHIP } from "@/data/regional-leadership";
import { LINKS } from "@/config/links";

const countryCount = new Set(REGIONAL_LEADERSHIP.map((r) => r.country)).size;
const repCount = REGIONAL_LEADERSHIP.filter((r) => r.role === "City Representative").length;
const ambassadorCount = REGIONAL_LEADERSHIP.filter((r) => r.role === "Campus Ambassador").length;

export default function CityReps() {
  return (
    <Layout>
      <PageMeta {...SEO.cityReps} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "City Reps" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Global Network
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              City Reps &amp; Campus Ambassadors
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Regional leaders who promote MEDX initiatives and build local research
              communities, organized by country, region, city, and campus.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground border-b-[1px] border-border">
        <StaggerContainer className="max-w-7xl mx-auto grid grid-cols-3 divide-x divide-primary-foreground/10">
          {[
            { num: `${countryCount}`, label: "Countries Represented Below" },
            { num: `${repCount}`, label: "City Representatives" },
            { num: `${ambassadorCount}`, label: "Campus Ambassadors" },
          ].map((s, i) => (
            <StaggerItem key={i} className="py-8 text-center">
              <div className="font-mono text-3xl text-accent mb-1 font-semibold tracking-tight">
                {s.num}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
                {s.label}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Apply CTAs */}
      <section className="py-16 px-4 sm:px-6 border-b-[1px] border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FadeIn className="p-8 border-[1px] border-border bg-card flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Apply for City Representative</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
              Lead MEDX initiatives in your city, coordinate with the global team, and build a
              local research community.
            </p>
            <a
              href={LINKS.cityRepForm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors w-fit"
            >
              Apply Now <ArrowRight size={13} aria-hidden="true" />
            </a>
          </FadeIn>
          <FadeIn delay={0.1} className="p-8 border-[1px] border-border bg-card flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Apply for Campus Ambassador</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
              Represent MEDX within your institution, connecting students to our
              international resources and events.
            </p>
            <a
              href={LINKS.campusAmbassadorForm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors w-fit"
            >
              Apply Now <ArrowRight size={13} aria-hidden="true" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Regional Dashboard */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Interactive Dashboard
            </p>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Browse by Country, Region, City &amp; Campus
            </h2>
            <div className="section-rule" />
          </FadeIn>
          <FadeIn>
            <RegionalDashboard entries={REGIONAL_LEADERSHIP} />
          </FadeIn>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Wherever there is a student with curiosity, MEDX should be there."
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mt-6">
            MEDX R&amp;Ed · One Team · One Vision · One Impact
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}
