import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { GraduationCap, HeartPulse, Stethoscope, BookMarked, Sparkles, ArrowRight } from "lucide-react";
import { AudioSeries } from "@/components/shared/audio-series";
import { SimpleApplicationModal } from "@/components/shared/simple-application-modal";

const PROGRAMS = [
  {
    icon: HeartPulse,
    label: "School & College Health Awareness",
    desc: "Accessible health-literacy sessions for school and college students, building early awareness of evidence-based health practices.",
  },
  {
    icon: Stethoscope,
    label: "Clinical Skills Training",
    desc: "Structured, hands-on-adjacent training in core clinical skills for early medical students.",
  },
  {
    icon: BookMarked,
    label: "Evidence-Based Study Materials",
    desc: "Curated, evidence-based study resources designed to support rigorous academic preparation.",
  },
];

const PATHWAYS = [
  { exam: "USMLE Step 1", region: "United States" },
  { exam: "USMLE Step 2 CK", region: "United States" },
  { exam: "PLAB", region: "United Kingdom" },
  { exam: "AMC", region: "Australia" },
  { exam: "Gulf Licensing Exams", region: "Gulf Region" },
];

export default function DepartmentEducation() {
  return (
    <Layout>
      <PageMeta {...SEO.education} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Departments" }, { label: "Education" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 flex flex-col sm:flex-row items-center justify-center gap-2">
              <GraduationCap size={14} className="flex-shrink-0" aria-hidden="true" /> Department of Education
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Education &amp; Higher Pathways
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Democratizing access to evidence-based medical education, from school-level
              health awareness to postgraduate licensing pathways.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">What We Offer</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Academic Programs</h2>
            <div className="section-rule" />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROGRAMS.map(({ icon: Icon, label, desc }) => (
              <StaggerItem key={label} className="p-8 border-[1px] border-border bg-card">
                <Icon size={24} className="text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="font-semibold text-lg mb-3">{label}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Higher Pathways Guidance */}
      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Sub-Module</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Higher Pathways Guidance</h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {PATHWAYS.map((p) => (
              <StaggerItem key={p.exam} className="p-6 border-[1px] border-border bg-background">
                <h3 className="font-semibold text-base mb-1">{p.exam}</h3>
                <p className="font-mono text-xs uppercase tracking-widest text-secondary">{p.region}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn>
            <AudioSeries
              episodes={[
                { speaker: "MEDX Alumni Panel", exam: "USMLE", role: "Step 1 & Step 2 CK Guidance" },
                { speaker: "MEDX Alumni Panel", exam: "PLAB", role: "UK Licensing Guidance" },
                { speaker: "MEDX Alumni Panel", exam: "AMC", role: "Australia Licensing Guidance" },
                { speaker: "MEDX Alumni Panel", exam: "Gulf Exams", role: "Gulf Licensing Guidance" },
              ]}
            />
          </FadeIn>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Educator Onboarding */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 text-center">
              <Sparkles size={22} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest text-secondary">
                AI-Assisted Learning &amp; Teaching
              </span>
              <Sparkles size={22} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Become an Educationist</h2>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-secondary leading-relaxed mb-8 max-w-xl mx-auto">
              Join MEDX as an educator and help build the next generation of evidence-based
              learning materials, supported by AI-assisted teaching tools.
            </p>
            <SimpleApplicationModal
              trigger={
                <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 whitespace-normal px-6 py-3 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors">
                  Apply to Become an Educationist <ArrowRight size={16} aria-hidden="true" />
                </button>
              }
              title="Become an Educationist"
              description="Tell us about your teaching background - MEDX Education will follow up by email."
              subject="MEDX Education - Educationist Application"
              fields={[
                { name: "name", label: "Full Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "subject", label: "Subject / Focus Area", required: true },
                { name: "experience", label: "Teaching / Mentorship Experience", type: "textarea", required: true },
              ]}
            />
          </FadeIn>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-primary text-primary-foreground py-24 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Democratizing access to evidence-based medical education."
          </h2>
        </FadeIn>
      </section>
    </Layout>
  );
}
