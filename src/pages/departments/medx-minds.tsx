import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { HeartHandshake, Users, BookHeart, Mic, ArrowRight } from "lucide-react";
import { SimpleApplicationModal } from "@/components/shared/simple-application-modal";

const OFFERINGS = [
  {
    icon: HeartHandshake,
    label: "Wellness Corner",
    desc: "Curated resources, coping strategies, and reflections that support burnout prevention and resilience for medical students.",
  },
  {
    icon: Users,
    label: "Peer Community Circles",
    desc: "Small, supportive peer groups where students can talk openly about the emotional demands of medical training.",
  },
];

const WEBINARS = [
  { speaker: "Mahan Aslam", note: "MEDX Minds Webinar · Schedule to be announced" },
  { speaker: "Arooba Saqib", note: "MEDX Minds Webinar · Schedule to be announced" },
];

export default function DepartmentMedxMinds() {
  return (
    <Layout>
      <PageMeta {...SEO.medxMinds} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Departments" }, { label: "MEDX Minds" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 flex items-center justify-center gap-2">
              <HeartHandshake size={14} aria-hidden="true" /> Department of MEDX Minds
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">MEDX Minds</h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Dedicated to student mental health, burnout prevention, resilience, and wellbeing -
              because the best researchers take care of both their intellect and their mind.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Core Offerings */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">What We Offer</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Core Offerings</h2>
            <div className="section-rule" />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {OFFERINGS.map(({ icon: Icon, label, desc }) => (
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

      {/* Storytelling & Advocacy Hub */}
      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Storytelling &amp; Advocacy</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Featured Story</h2>
            <div className="section-rule" />
          </FadeIn>

          <FadeIn className="p-6 sm:p-10 border-[1px] border-border bg-background mb-10">
            <BookHeart size={22} className="text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="text-2xl font-semibold mb-2">"Still Becoming: From the Mountains to Medicine"</h3>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-5">By Dr. Faria Ali</p>
            <p className="font-sans text-muted-foreground leading-relaxed">
              A personal reflection on identity, distance, and the long pull toward a career in medicine -
              shared through MEDX Minds to remind students that the path to becoming a physician is rarely
              a straight line.
            </p>
          </FadeIn>

          <FadeIn className="text-center">
            <h3 className="text-xl font-semibold mb-3">Share Your Story</h3>
            <p className="font-sans text-muted-foreground mb-6 max-w-lg mx-auto">
              Your story could be the reason someone else keeps going. MEDX Minds is always open to
              new voices.
            </p>
            <SimpleApplicationModal
              trigger={
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors">
                  Share Your Story <ArrowRight size={13} aria-hidden="true" />
                </button>
              }
              title="Share Your Story"
              description="Tell us a little about your story - the MEDX Minds team will follow up by email."
              subject="MEDX Minds - Share Your Story Submission"
              fields={[
                { name: "name", label: "Full Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "title", label: "Story Title", required: true },
                { name: "story", label: "Your Story", type: "textarea", required: true },
              ]}
            />
          </FadeIn>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Webinars & Peer Support */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Webinars &amp; Peer Support</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Sessions</h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="space-y-4 mb-12">
            {WEBINARS.map((w) => (
              <StaggerItem
                key={w.speaker}
                className="p-6 border-[1px] border-border bg-card flex items-center gap-4"
              >
                <Mic size={18} className="text-accent flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="font-semibold">{w.speaker}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-secondary">{w.note}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="text-center">
            <SimpleApplicationModal
              trigger={
                <button className="inline-flex items-center gap-2 px-6 py-3 border-[1px] border-border font-semibold tracking-widest uppercase text-xs hover:bg-muted transition-colors">
                  Become a Speaker <ArrowRight size={13} aria-hidden="true" />
                </button>
              }
              title="Become a Speaker"
              description="Tell us about your session idea and we'll follow up by email."
              subject="MEDX Minds - Become a Speaker"
              fields={[
                { name: "name", label: "Full Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "topic", label: "Proposed Topic", required: true },
                { name: "outline", label: "Session Outline", type: "textarea" },
              ]}
            />
          </FadeIn>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Join Team */}
      <section id="associate" className="py-24 px-4 sm:px-6 scroll-mt-32 bg-primary text-primary-foreground text-center">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/50 mb-4">Join the Team</p>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Work as Associate (MEDX Minds)</h2>
          <p className="font-sans text-primary-foreground/70 max-w-lg mx-auto mb-8 leading-relaxed">
            Join the MEDX Minds team to help lead wellness initiatives and support fellow students.
          </p>
          <SimpleApplicationModal
            trigger={
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors">
                Apply as Associate <ArrowRight size={13} aria-hidden="true" />
              </button>
            }
            title="Work as Associate (MEDX Minds)"
            description="A quick Q&A - MEDX Minds will follow up by email."
            subject="MEDX Minds - Associate Application"
            fields={[
              { name: "name", label: "Full Name", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "why", label: "Why MEDX Minds?", type: "textarea", required: true },
            ]}
          />
        </FadeIn>
      </section>
    </Layout>
  );
}
