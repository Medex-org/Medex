import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Globe2, Plane, ArrowRight } from "lucide-react";
import { SimpleApplicationModal } from "@/components/shared/simple-application-modal";

const OPPORTUNITIES = [
  {
    name: "SUSI",
    desc: "Study of the U.S. Institutes - a U.S. government-sponsored academic exchange program for international student leaders.",
  },
  {
    name: "UGRAD",
    desc: "Global Undergraduate Exchange Program - a U.S. government scholarship for a semester of non-degree study abroad.",
  },
  {
    name: "Global Electives & Observerships",
    desc: "International clinical elective and observership opportunities coordinated through MEDX's partner network.",
  },
];

export default function DepartmentMedicalExchange() {
  return (
    <Layout>
      <PageMeta {...SEO.medicalExchange} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Departments" }, { label: "Medical Exchange" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 flex items-center justify-center gap-2">
              <Globe2 size={14} aria-hidden="true" /> Department of Medical Exchange
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">Medical Exchange</h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Connecting students to international placements, electives, and exchange
              opportunities across borders.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Opportunities</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              Placements &amp; Announcements
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OPPORTUNITIES.map((o) => (
              <StaggerItem key={o.name} className="p-8 border-[1px] border-border bg-card">
                <Plane size={22} className="text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="font-semibold text-lg mb-3">{o.name}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="mt-10 p-6 border-[1px] border-dashed border-border text-center">
            <p className="font-sans text-sm text-muted-foreground">
              Specific application windows and deadlines are announced through MEDX channels as they open.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Work as Associate */}
      <section className="py-24 px-4 sm:px-6 bg-primary text-primary-foreground text-center">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/50 mb-4">Join the Team</p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Work as Associate for Medical Exchange</h2>
          <p className="font-sans text-primary-foreground/70 max-w-lg mx-auto mb-8 leading-relaxed">
            Help MEDX coordinate international placements and exchange opportunities for students
            worldwide.
          </p>
          <SimpleApplicationModal
            trigger={
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors">
                Apply as Associate <ArrowRight size={13} aria-hidden="true" />
              </button>
            }
            title="Work as Associate for Medical Exchange"
            description="A quick Q&A - the Medical Exchange team will follow up by email."
            subject="MEDX Medical Exchange - Associate Application"
            fields={[
              { name: "name", label: "Full Name", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "why", label: "Why Medical Exchange?", type: "textarea", required: true },
            ]}
          />
        </FadeIn>
      </section>
    </Layout>
  );
}
