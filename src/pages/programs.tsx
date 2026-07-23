import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight, Activity, Beaker, Globe2, Brain, Plane } from "lucide-react";
import { Link } from "wouter";
import lteFlyer from "@assets/IMG-20260714-WA0022.jpg";
import researchWeekSchedule from "@assets/WhatsApp Image 2026-07-21 at 6.12.37 PM.jpeg";

export default function Programs() {
  return (
    <Layout>
      <PageMeta
        title="Scholarly Programs"
        description="Explore MEDX R&Ed's programs - SRMA Workshop Series, LTE Mentorship, Research Week, Higher Pathways Guidance, MEDX Minds, and our global City Representatives network."
      />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              What We Offer
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Scholarly Programs
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-serif text-xl text-secondary max-w-2xl mx-auto">
              Structured methodology, mentorship, and collaboration for
              aspiring physician-scientists.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-28">

          {/* ── SRMA Workshop Series ───────────────────────────────── */}
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="w-16 h-16 rounded-full border-[1px] border-border flex items-center justify-center bg-card text-primary mb-4" aria-hidden="true">
                  <Activity size={24} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">SRMA Workshop Series</h2>
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-4">
                  Flagship Program
                </span>
                <p className="font-mono text-xs text-secondary">
                  Started July 8, 2026
                </p>
              </div>
              <div className="md:col-span-9 prose prose-lg prose-slate font-serif text-muted-foreground">
                <p className="lead text-xl text-foreground mb-6 not-prose font-serif">
                  MEDX R&amp;Ed's flagship educational program - a structured workshop
                  series on systematic review and meta-analysis methodology,
                  delivered by experienced mentors.
                </p>
                <div className="p-6 border-[1px] border-border bg-card not-prose mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-secondary mb-2">
                      Session Log
                    </h4>
                    <p className="font-semibold text-sm">
                      2nd FREE Lecture - Introduction to SRMA Basics
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      July 8, 2026 · 8PM PKT · Google Meet
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-secondary mb-2">
                      What You Learn
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>- Why SRMA mentorship is essential</li>
                      <li>- Systematic review methodology</li>
                      <li>- Meta-analysis fundamentals</li>
                      <li>- Publication pathways</li>
                    </ul>
                  </div>
                </div>
                <p>
                  The SRMA series takes students from absolute beginners to
                  published authors. Free introductory lectures are followed by
                  mentored cohorts where small groups work directly with an
                  experienced researcher to conduct a review and prepare it for
                  publication.
                </p>
                <a
                  href="https://forms.gle/yJzGnk4DwmWysygv9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-sans font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity no-underline mt-4"
                >
                  Register for next cohort <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border" />

          {/* ── LTE Mentorship ─────────────────────────────────────── */}
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="w-16 h-16 rounded-full border-[1px] border-border flex items-center justify-center bg-card text-primary mb-4" aria-hidden="true">
                  <Beaker size={24} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">LTE Mentorship</h2>
                <span className="font-mono text-xs uppercase tracking-widest text-secondary block mb-4">
                  Ongoing · Applications Open
                </span>
              </div>
              <div className="md:col-span-9">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="prose prose-lg prose-slate font-serif text-muted-foreground">
                    <p className="lead text-xl text-foreground mb-6 not-prose font-serif">
                      A structured, ongoing mentorship program connecting aspiring
                      researchers with experienced mentors for sustained academic
                      guidance.
                    </p>
                    <p>
                      Long-Term Engagement (LTE) goes beyond single projects. Mentees
                      receive personalized guidance on research methodology, career
                      planning, abstract writing, and navigating the global medical
                      landscape.
                    </p>
                    <p>
                      Featured Workshop: <strong>Free Letter to the Editor Learning Opportunity</strong> -{" "}
                      Speaker: Imad Khan (5+ international publications), held July 18, 2026.
                    </p>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLScN1j39ftyK6Y0Z8PEpO4rbZyER_lE5hC0rzSkCxMT3ChcIjg/viewform"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-sans font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity no-underline mt-4"
                    >
                      Apply for LTE 2026 <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 w-full h-full border-[1px] border-border pointer-events-none" aria-hidden="true" />
                    <img
                      src={lteFlyer}
                      alt="MEDX LTE Free Workshop - Letter to the Editor, Speaker: Imad Khan"
                      className="w-full h-auto object-cover img-scholarly border-[1px] border-border relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border" />

          {/* ── Research Week ──────────────────────────────────────── */}
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="w-16 h-16 rounded-full border-[1px] border-border flex items-center justify-center bg-card text-primary mb-4" aria-hidden="true">
                  <Globe2 size={24} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Research Week</h2>
                <span className="font-mono text-xs uppercase tracking-widest text-secondary block mb-4">
                  Collaboration · NSRI BUMHS-LC
                </span>
              </div>
              <div className="md:col-span-9">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="prose prose-lg prose-slate font-serif text-muted-foreground">
                    <p className="lead text-xl text-foreground mb-6 not-prose font-serif">
                      MEDX R&amp;Ed &times; NSRI BUMHS-LC - Complete Research Week
                    </p>
                    <p>
                      A 6-day intensive online research program covering everything from
                      topic selection to data analysis and manuscript submission. Moderated
                      by Dr. Rida Noor and Abdul Moiz.
                    </p>
                    <div className="not-prose mt-4 space-y-2">
                      {[
                        "Topic Selection & Questionnaire Making",
                        "Synopsis Writing, MeSH Keywords & ORCID",
                        "EndNote Reference Management & Research Rabbit",
                        "Manuscript Writing",
                        "SPSS Basics & Data Tables",
                        "SPSS Data Analysis & Figures/Graphs",
                      ].map((d, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-sm text-muted-foreground font-serif"
                        >
                          <span className="font-mono text-xs text-accent flex-shrink-0 mt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {d}
                        </div>
                      ))}
                    </div>
                    <p className="not-prose text-xs font-mono text-secondary mt-6">
                      Time: 10:00 PM PKT · Venue: Online / Google Meet
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 w-full h-full border-[1px] border-border pointer-events-none" aria-hidden="true" />
                    <img
                      src={researchWeekSchedule}
                      alt="MEDX × NSRI BUMHS-LC Complete Research Week - Full 6-day schedule"
                      className="w-full h-auto object-cover img-scholarly border-[1px] border-border relative z-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border" />

          {/* ── Higher Pathways Guidance ───────────────────────────── */}
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="w-16 h-16 rounded-full border-[1px] border-border flex items-center justify-center bg-card text-primary mb-4" aria-hidden="true">
                  <Plane size={24} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Higher Pathways Guidance</h2>
                <span className="font-mono text-xs uppercase tracking-widest text-secondary block">
                  Coming Soon
                </span>
              </div>
              <div className="md:col-span-9 prose prose-lg prose-slate font-serif text-muted-foreground">
                <p className="lead text-xl text-foreground mb-6 not-prose font-serif">
                  Guidance and resources for students pursuing advanced degrees,
                  international academic opportunities, and career transitions.
                </p>
                <p>
                  MEDX is developing a comprehensive guidance program to help students
                  navigate applications to higher education programs worldwide. The initiative
                  will include mentorship from alumni, resources for SOP writing, scholarship
                  navigation, and international collaboration.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border" />

          {/* ── MEDX Minds ─────────────────────────────────────────── */}
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3">
                <div className="w-16 h-16 rounded-full border-[1px] border-border flex items-center justify-center bg-card text-primary mb-4" aria-hidden="true">
                  <Brain size={24} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">MEDX Minds</h2>
                <span className="font-mono text-xs uppercase tracking-widest text-secondary block">
                  Member Platform
                </span>
              </div>
              <div className="md:col-span-9 prose prose-lg prose-slate font-serif text-muted-foreground">
                <p className="lead text-xl text-foreground mb-6 not-prose font-serif">
                  Curated medical education content and mental wellness resources
                  for the next generation of physician-scientists.
                </p>
                <p>
                  MEDX Minds addresses two dimensions of student development:
                  scholarly excellence through recorded workshops and learning modules,
                  and mental wellness through peer stories, coping strategies, and
                  community support - because the best researchers take care of both
                  their intellect and their wellbeing.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border" />

          {/* ── City Reps Brief ────────────────────────────────────── */}
          <FadeIn>
            <div className="p-8 border-[1px] border-border bg-card flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  MEDX City Representatives
                </h2>
                <p className="font-serif text-muted-foreground">
                  Our global network of student leaders - building local research
                  communities in cities across 8+ countries.
                </p>
              </div>
              <Link
                href="/city-reps"
                className="whitespace-nowrap px-6 py-3 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-2 group"
              >
                View Representatives{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
