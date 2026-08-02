import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight, FlaskConical, User } from "lucide-react";
import { ProfileModal } from "@/components/shared/profile-modal";
import { MentorshipPricing } from "@/components/shared/mentorship-pricing";
import { ResearchTracker } from "@/components/shared/research-tracker";
import { LteEnrollment } from "@/components/shared/lte-enrollment";
import { DonationDashboard } from "@/components/shared/donation-dashboard";
import { SimpleApplicationModal } from "@/components/shared/simple-application-modal";
import { RESEARCH_MENTORS } from "@/data/mentors";
import { DialogClose } from "@/components/ui/dialog";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { SectionNav } from "@/components/shared/section-nav";
import { LINKS } from "@/config/links";

const SECTIONS = [
  { id: "team", label: "Team" },
  { id: "mentorship", label: "Mentorship" },
  { id: "tracker", label: "Tracker" },
  { id: "cohort", label: "Enroll" },
  { id: "applications", label: "Apply" },
  { id: "donations", label: "Donate" },
];

const MENTEE_RESEARCH_TYPES = [
  "SRMA",
  "LTE",
  "Cross-Sectional Study",
  "CDC",
  "Narrative Review",
  "Scoping Review",
  "Case Series N-C",
  "Case Report N-C",
];

/** All cohort programs except LTE, which has its own dedicated enrollment flow below. */
const OTHER_COHORT_PROGRAMS = MENTEE_RESEARCH_TYPES.filter((t) => t !== "LTE");

export default function DepartmentResearch() {
  return (
    <Layout>
      <PageMeta {...SEO.research} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: "Departments" },
              { label: "Research" },
            ]}
          />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 flex items-center justify-center gap-2">
              <FlaskConical size={14} aria-hidden="true" /> Department of Research
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Research Mentorship &amp; Methodology
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              From first protocol to published manuscript - structured mentorship for
              aspiring physician-scientists.
            </p>
          </FadeIn>
        </div>
      </section>

      <SectionNav items={SECTIONS} />

      {/* Mentors & Research Team */}
      <section id="team" className="py-24 px-4 sm:px-6 scroll-mt-32">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Our Team</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              Mentors &amp; Research Team
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESEARCH_MENTORS.map((mentor) => (
              <StaggerItem key={mentor.name}>
                <ProfileModal
                  mentor={mentor}
                  footer={
                    <DialogClose asChild>
                      <a
                        href="#mentorship"
                        className="inline-flex items-center gap-2 py-2 -my-2 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity mt-4"
                      >
                        Get Mentorship <ArrowRight size={13} aria-hidden="true" />
                      </a>
                    </DialogClose>
                  }
                  trigger={
                    <button className="w-full p-6 border-[1px] border-border bg-card hover:border-accent/30 transition-all text-left group">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-[1px] border-border bg-muted mb-4 img-scholarly">
                        {mentor.image ? (
                          <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden="true">
                            <User size={28} strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{mentor.name}</h3>
                      <p className="font-mono text-xs uppercase tracking-widest text-accent mt-1 mb-3">
                        {mentor.role}
                      </p>
                      <p className="font-sans text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>
                    </button>
                  }
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Mentorship Pricing */}
      <section id="mentorship" className="py-24 px-4 sm:px-6 bg-card scroll-mt-32">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Get Mentorship</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Mentorship Tiers</h2>
            <div className="section-rule" />
          </FadeIn>
          <FadeIn>
            <MentorshipPricing />
          </FadeIn>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Ongoing Research Tracker */}
      <section id="tracker" className="py-24 px-4 sm:px-6 scroll-mt-32">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">In Progress</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Ongoing Research Tracker</h2>
            <div className="section-rule" />
          </FadeIn>
          <FadeIn>
            <ResearchTracker
              projects={[
                {
                  title: "SRMA Project-1",
                  lead: "Tarooba Khan",
                  startDate: "2026-07-08",
                  endDate: "2026-09-08",
                },
              ]}
            />
          </FadeIn>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Cohort Application Engine */}
      <section id="cohort" className="py-24 px-4 sm:px-6 bg-card scroll-mt-32">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Enroll</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Cohort Application Engine</h2>
            <div className="section-rule" />
          </FadeIn>

          <FadeIn className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">LTE Mentorship</p>
            <LteEnrollment />
          </FadeIn>

          <FadeIn className="mb-6">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-1">Other Cohorts</p>
            <p className="font-sans text-sm text-muted-foreground">
              Apply for any of MEDX's other research tracks via the Mentee Application Form.
            </p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OTHER_COHORT_PROGRAMS.map((program) => (
              <StaggerItem
                key={program}
                className="p-5 border-[1px] border-border bg-background flex items-center justify-between gap-3"
              >
                <span className="font-semibold text-sm">{program}</span>
                <a
                  href={LINKS.menteeForm}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Apply for ${program} via the Mentee Application Form`}
                  className="inline-flex items-center gap-1 py-2 -my-2 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  Apply <ArrowRight size={12} aria-hidden="true" />
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Applications: Become a Mentor / Be a Mentee */}
      <section id="applications" className="py-24 px-4 sm:px-6 scroll-mt-32">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Applications</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Join the Research Program</h2>
            <div className="section-rule" />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FadeIn className="p-8 border-[1px] border-border bg-card flex flex-col">
              <h3 className="text-xl font-semibold mb-3">Become a Mentor</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                Mentor applications are screened via a short interview before onboarding, to make sure
                every cohort gets consistent, high-quality guidance.
              </p>
              <SimpleApplicationModal
                trigger={
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors w-fit">
                    Apply to Mentor <ArrowRight size={13} aria-hidden="true" />
                  </button>
                }
                title="Become a Mentor"
                description="Tell us about your research background - MEDX will follow up to schedule a short screening interview."
                subject="MEDX Research - Become a Mentor Application"
                fields={[
                  { name: "name", label: "Full Name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "institute", label: "Institution / Program", required: true },
                  {
                    name: "background",
                    label: "Research Background & Areas of Interest",
                    type: "textarea",
                    required: true,
                  },
                ]}
                note="Applications are reviewed and followed by a short interview before onboarding."
              />
            </FadeIn>

            <FadeIn delay={0.1} className="p-8 border-[1px] border-border bg-card flex flex-col">
              <h3 className="text-xl font-semibold mb-3">Be a Mentee</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                Tell us which research track you're interested in - SRMA, LTE, Cross-Sectional Study, CDC,
                Narrative Review, Scoping Review, Case Series N-C, or Case Report N-C.
              </p>
              <SimpleApplicationModal
                trigger={
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors w-fit">
                    Quick Mentee Inquiry <ArrowRight size={13} aria-hidden="true" />
                  </button>
                }
                title="Be a Mentee"
                description="A quick inquiry - for the full cohort application, use the Mentee Application Form."
                subject="MEDX Research - Be a Mentee Inquiry"
                fields={[
                  { name: "name", label: "Full Name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  {
                    name: "track",
                    label: "Research Track",
                    type: "select",
                    required: true,
                    options: MENTEE_RESEARCH_TYPES,
                  },
                ]}
              />
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Donations & Support Dashboard */}
      <section id="donations" className="py-24 px-4 sm:px-6 bg-card scroll-mt-32">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Transparency</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              Donations &amp; Support Dashboard
            </h2>
            <div className="section-rule" />
          </FadeIn>
          <FadeIn>
            <DonationDashboard />
          </FadeIn>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Research Today, Impact Tomorrow."
          </h2>
        </FadeIn>
      </section>
    </Layout>
  );
}
