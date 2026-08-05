import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Handshake, ArrowRight } from "lucide-react";
import { PartnerCard } from "@/components/shared/partner-card";
import { PARTNERS } from "@/data/partners";
import { SimpleApplicationModal } from "@/components/shared/simple-application-modal";

export default function DepartmentPartnerships() {
  return (
    <Layout>
      <PageMeta {...SEO.partnerships} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Departments" }, { label: "Partnerships" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Handshake size={14} className="flex-shrink-0" aria-hidden="true" /> Department of Partnerships &amp; External Affairs
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Strategic Collaborations
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Building the relationships that connect MEDX students to institutions,
              tools, and opportunities worldwide.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Featured Collaborations */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Featured Collaborations
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Our Partners</h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNERS.map((partner) => (
              <StaggerItem key={partner.name}>
                <PartnerCard partner={partner} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Partner With Us Portal */}
      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Get Involved</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Partner With Us</h2>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-secondary leading-relaxed mb-10 max-w-xl mx-auto">
              Institutions, hospitals, student forums, and NGOs are welcome to propose a
              collaboration with MEDX R&amp;Ed.
            </p>
            <SimpleApplicationModal
              trigger={
                <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 whitespace-normal px-6 py-3 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors">
                  Submit a Partnership Proposal <ArrowRight size={16} aria-hidden="true" />
                </button>
              }
              title="Partner With Us"
              description="Tell us about your organization and proposed collaboration - the Partnerships team will follow up by email."
              subject="MEDX Partnership Proposal"
              fields={[
                { name: "organization", label: "Organization Name", required: true },
                {
                  name: "type",
                  label: "Organization Type",
                  type: "select",
                  required: true,
                  options: ["Academic Institution", "Hospital / Clinical Body", "Student Forum", "NGO", "Other"],
                },
                { name: "contact", label: "Contact Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "proposal", label: "Proposed Collaboration", type: "textarea", required: true },
              ]}
              submitLabel="Compose Proposal Email"
            />
          </FadeIn>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-primary text-primary-foreground py-24 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Partnerships aren't signed, they're earned."
          </h2>
        </FadeIn>
      </section>
    </Layout>
  );
}
