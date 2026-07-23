import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight, Brain, Heart, BookOpen, Users } from "lucide-react";
import { Link } from "wouter";

const modules = [
  {
    icon: Brain,
    label: "Scholar's Toolkit",
    desc: "Research methodology, SPSS basics, manuscript writing fundamentals, and systematic review essentials — structured learning for every level.",
  },
  {
    icon: Heart,
    label: "Wellness Corner",
    desc: "Curated stories, resilience strategies, and community support for medical students navigating the emotional demands of the profession.",
  },
  {
    icon: BookOpen,
    label: "Recorded Workshops",
    desc: "On-demand access to all past MEDX workshops — watch, rewatch, and learn at your own pace.",
  },
  {
    icon: Users,
    label: "Peer Community",
    desc: "Dedicated WhatsApp groups, study circles, and collaborative project teams for active MEDX members.",
  },
];

export default function MedxMinds() {
  return (
    <Layout>
      <PageMeta
        title="MEDX Minds"
        description="MEDX Minds is a curated member platform for medical education, academic growth, and mental wellness — designed by students, for students."
      />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Member Platform
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              MEDX Minds
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-serif text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              A curated platform for medical education, academic growth, and
              mental wellness — designed by students, for students.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <FadeIn className="prose prose-lg prose-slate font-serif text-muted-foreground max-w-none mb-20">
            <p className="lead not-prose text-xl text-foreground mb-6 font-serif">
              MEDX Minds operates on a simple principle: the best medical professionals
              invest equally in their intellectual rigour and their personal wellbeing.
            </p>
            <p>
              The platform is divided into two dimensions — a scholarly toolkit for
              research and education, and a wellness corner for mental health and peer
              support. Members gain access to on-demand workshops, a structured learning
              library, and a supportive peer community.
            </p>
            <p>
              Stories shared here are not just testimonials. They are beacons — because
              in MEDX Minds, <em>"Share Your Stories, Become a Reason for Others."</em>
            </p>
          </FadeIn>

          <div className="h-[1px] w-full bg-border mb-20" />

          {/* Modules */}
          <FadeIn className="mb-12">
            <h2 className="font-mono text-sm uppercase tracking-widest text-secondary mb-6">
              Platform Sections
            </h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {modules.map(({ icon: Icon, label, desc }, i) => (
              <StaggerItem
                key={i}
                className="p-8 border-[1px] border-border bg-background hover:bg-card hover:border-accent/20 transition-all group"
              >
                <Icon
                  size={24}
                  className="text-accent mb-5 group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-lg mb-3">{label}</h3>
                <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="h-[1px] w-full bg-border mb-20" />

          {/* Access CTA — polished with a subtle background pattern */}
          <FadeIn>
            <div className="p-10 border-[1px] border-border bg-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="border-l-2 border-accent pl-6">
                <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                  Members Only
                </p>
                <h3 className="text-2xl font-semibold text-primary mb-3">
                  Access MEDX Minds
                </h3>
                <p className="font-serif text-muted-foreground max-w-md leading-relaxed">
                  MEDX Minds is exclusively available to registered MEDX members.
                  Join today to gain access to all workshops, resources, and the
                  peer community.
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <a
                  href="https://forms.gle/yJzGnk4DwmWysygv9"
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-3 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors flex items-center gap-2 group"
                >
                  Join MEDX{" "}
                  <ArrowRight
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </a>
                <Link
                  href="/join"
                  className="px-7 py-3 border-[1px] border-border text-foreground font-semibold tracking-widest uppercase text-xs hover:bg-muted transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-primary text-primary-foreground py-24 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Share Your Stories. Become a Reason for Others."
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/40 mt-6">
            MEDX Minds · Mind = Picture &amp; Outcome
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}
