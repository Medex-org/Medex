import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight, BookOpen, Users, Lightbulb, Globe2, Handshake } from "lucide-react";
import partnershipImg from "@assets/IMG-20260720-WA0022.jpg";

export default function About() {
  return (
    <Layout>
      <PageMeta
        title="About MEDX"
        description="Learn about the history, mission, and partnerships of MEDX R&Ed — a global student-led platform democratizing access to medical research and education."
      />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Our Story
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              About MEDX
            </h1>
            <div className="section-rule mb-8" />
            <p className="font-serif text-xl md:text-2xl text-secondary leading-relaxed max-w-3xl">
              MEDX R&amp;Ed exists to democratize access to medical research and
              education — connecting students across borders, institutions, and
              disciplines to collaborate, learn, and publish.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* History */}
          <FadeIn className="mb-20">
            <h2 className="font-mono text-sm uppercase tracking-widest text-secondary mb-6">
              Our History
            </h2>
            <div className="prose prose-lg prose-slate font-serif max-w-none text-muted-foreground">
              <p>
                MEDX was founded by Sangeen Khan, a medical student whose experience
                navigating the barriers of clinical research as a student inspired him
                to build something different. It quickly became clear that the challenges
                he faced — lack of structured guidance, no access to methodology training,
                and an absence of global peer networks — were universal.
              </p>
              <p>
                What began as a small cohort of passionate students evolved into a
                global organization running systematic review workshops, long-term
                mentorship programs, and international conference preparation —
                guided by a singular principle: rigorous, evidence-based medicine
                should be accessible to all who wish to learn.
              </p>
              <p>
                Today, MEDX R&amp;Ed spans 8+ countries, with City Representatives
                building local chapters from Pakistan and Sri Lanka to Colombia and
                the United States — united under one mission:{" "}
                <em>Together, We Turn Curiosity into Discovery.</em>
              </p>
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border my-20" />

          {/* What We Do */}
          <FadeIn className="mb-8">
            <h2 className="font-mono text-sm uppercase tracking-widest text-secondary mb-8">
              What We Do
            </h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <StaggerItem>
              <BookOpen size={24} className="text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Research Programs</h3>
              <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                Our flagship SRMA workshops guide cohorts through the rigorous process
                of systematic review and meta-analysis, resulting in publication-ready
                manuscripts.
              </p>
            </StaggerItem>
            <StaggerItem>
              <Lightbulb size={24} className="text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Educational Outreach</h3>
              <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                Through workshops, webinars, and the MEDX Minds platform, we provide
                curated medical education and mental wellness resources for the next
                generation of physician-scientists.
              </p>
            </StaggerItem>
            <StaggerItem>
              <Users size={24} className="text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Global Network</h3>
              <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                City Representatives and Campus Ambassadors build local chapters that
                connect back to our international framework, fostering cross-border
                collaboration and community.
              </p>
            </StaggerItem>
          </StaggerContainer>

          <div className="h-[1px] w-full bg-border my-20" />

          {/* Member Benefits */}
          <FadeIn className="mb-8">
            <h2 className="font-mono text-sm uppercase tracking-widest text-secondary mb-4">
              Member Benefits
            </h2>
            <div className="section-rule mb-8" />
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-20">
              {[
                "Official MEDX E-Card with your photo",
                "Global Recognition on MEDX website",
                "Up to 50% Discounts on All Programs",
                "Letters of Recommendation & Certificates",
                "Scholarship & Sponsorship Eligibility",
                "Campus WhatsApp Community Access",
                "Citation for your Published Work",
                "Exclusive Lifetime GradMeta Access Code",
                "Eligible for Donations & Funding",
                "Get Your Story Featured on MEDX",
                "Global Connectivity & Identification",
                "Access to Critical Research Data",
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 border-[1px] border-border bg-card text-sm"
                >
                  <span className="font-mono text-xs text-accent flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border my-20" />

          {/* Partnerships */}
          <FadeIn>
            <h2 className="font-mono text-sm uppercase tracking-widest text-secondary mb-8">
              Partnerships &amp; Collaborations
            </h2>
          </FadeIn>

          {/* NSRI */}
          <FadeIn className="mb-8">
            <div className="p-8 border-[1px] border-border bg-card flex items-start gap-6">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Globe2 size={18} strokeWidth={1.5} className="text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">
                  NSRI — National Student Research Institution
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">
                  BUMHS-LC Chapter · Research Collaboration
                </p>
                <p className="font-serif text-muted-foreground text-sm leading-relaxed">
                  MEDX partners with NSRI BUMHS-LC to co-host immersive Research Week
                  events, pooling expertise to deliver world-class training in systematic
                  reviews, data analysis, and manuscript writing.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* GradMeta — with image */}
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 border-[1px] border-border bg-card">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Handshake size={20} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                  <p className="font-semibold text-lg">GradMeta</p>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">
                  AI-Powered Research Solutions · Strategic Partnership
                </p>
                <p className="font-serif text-muted-foreground text-sm leading-relaxed mb-4">
                  MEDX R&amp;Ed and GradMeta share a commitment to empowering students
                  through medical education, research mentorship, innovation, and global
                  academic opportunities. Together, we provide impactful educational
                  initiatives and research capacity-building programs.
                </p>
                <p className="font-serif text-muted-foreground text-sm leading-relaxed mb-4">
                  <strong>Exclusive Member Benefit:</strong> MEDX members receive free
                  access to GradMeta's professional systematic review tool (valued at $50)
                  — validated against R metafor across core statistical methods.
                </p>
                <a
                  href="https://forms.gle/yJzGnk4DwmWysygv9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity group"
                >
                  Join to Access GradMeta{" "}
                  <ArrowRight
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </a>
              </div>
              <div className="relative">
                <div className="absolute -top-3 -right-3 w-full h-full border-[1px] border-border pointer-events-none" aria-hidden="true" />
                <img
                  src={partnershipImg}
                  alt="MEDX R&Ed × GradMeta Partnership — A New Era of Research Collaboration"
                  className="w-full h-auto object-cover img-scholarly border-[1px] border-border relative z-10"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-primary text-primary-foreground py-32 px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="w-12 h-12 rounded-full border-[1px] border-primary-foreground/20 flex items-center justify-center mx-auto mb-8" aria-hidden="true">
            <Globe2 size={24} strokeWidth={1} />
          </div>
          <h2 className="font-serif italic text-3xl md:text-5xl font-light tracking-wide max-w-4xl mx-auto">
            "Together, We Turn Curiosity into Discovery"
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/40 mt-8">
            MEDX R&amp;Ed — Research · Education · Development
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}
