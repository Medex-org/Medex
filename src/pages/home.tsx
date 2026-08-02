import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight, Mic } from "lucide-react";
import { Link } from "wouter";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { PartnerCard } from "@/components/shared/partner-card";
import { SimpleApplicationModal } from "@/components/shared/simple-application-modal";
import { PARTNERS } from "@/data/partners";
import { DEPARTMENTS } from "@/data/departments";
import { LINKS, BRAND } from "@/config/links";

import srmaImg from "@assets/medx-systematic-review-and-meta-analysis-project.webp";
import lteRecapImg from "@assets/collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp";
import basicsImg from "@assets/medx-invites-you-to-join-free-workshop-basics-of-research-and-why-srma-mentorship-is-essential.webp";
import researchWeekImg from "@assets/nsri-and-medx-announces-complete-research-week.webp";

import gmoImg from "@assets/medx-calls-main-officers.webp";
import cityRepImg from "@assets/medx-announces-slots-for-city-representative.webp";
import campusAmbImg from "@assets/medx-join-us-as-campus-ambassadors.webp";
import mindsSpeakerImg from "@assets/medx-minds-join-us-as-speakers-or-story-tellers.webp";

const ACHIEVEMENTS = [
  {
    title: "6-Lecture SRMA Workshop Series",
    badge: "Flagship",
    image: srmaImg,
    desc: "A structured six-lecture series on systematic review and meta-analysis methodology, from basics to publication.",
  },
  {
    title: "LTE Recap & Interactive Q&A",
    badge: "Completed",
    image: lteRecapImg,
    desc: "A recap session on Letter to the Editor writing with live, interactive Q&A - held in collaboration with NSRI.",
  },
  {
    title: "Basics of Research & Publication",
    badge: "Ongoing",
    image: basicsImg,
    desc: "A free introductory workshop covering research fundamentals and why structured mentorship matters.",
  },
  {
    title: "Collaborative Research Week × NSRI BUMHS-LC",
    badge: "Featured",
    image: researchWeekImg,
    desc: "A multi-day intensive research program co-hosted with NSRI BUMHS-LC, covering the full research pipeline.",
  },
];

const EVENT_BANNERS = [
  { image: gmoImg, label: "Global Main Officer Recruitment", href: "/team" },
  { image: cityRepImg, label: "City Representative Slots Open", href: "/city-reps" },
  { image: campusAmbImg, label: "Campus Ambassador Recruitment", href: "/city-reps" },
  { image: mindsSpeakerImg, label: "MEDX Minds - Speakers & Storytellers", href: "/medx-minds" },
];

const NEWS_HIGHLIGHTS = [
  {
    title: "SRMA Project-1 underway, led by Tarooba Khan",
    desc: "MEDX's flagship active systematic review is progressing toward its September completion target.",
  },
  {
    title: "Research Week wraps with NSRI BUMHS-LC",
    desc: "Students completed the full pipeline - from topic selection to manuscript writing and SPSS analysis.",
  },
  {
    title: "GradMeta partnership brings members free SR tooling",
    desc: "MEDX members now get access to GradMeta's professional systematic review tool at no cost.",
  },
];

const WEBINARS = [
  {
    title: "SRMA Free Lecture Series",
    cadence: "Recurring",
    desc: "Free introductory lectures on systematic review and meta-analysis methodology, open to all.",
  },
  {
    title: "LTE Lecture Series",
    cadence: "Ongoing Cohorts",
    desc: "Structured lectures on Letter to the Editor writing and long-term mentorship engagement.",
  },
];

const JOIN_ROLES = [
  { title: "City Representative", href: LINKS.cityRepForm, desc: "Lead MEDX initiatives in your city." },
  { title: "Campus Ambassador", href: LINKS.campusAmbassadorForm, desc: "Represent MEDX at your institution." },
  { title: "Workshop Participant", href: LINKS.membershipForm, desc: "Learn research methodology and join MEDX cohorts." },
  { title: "MEDX Minds Associate", href: "/medx-minds#associate", desc: "Support student mental health initiatives.", internal: true },
];

export default function Home() {
  return (
    <Layout>
      <PageMeta {...SEO.home} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none bg-texture-molecular" aria-hidden="true" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-radial-[at_50%_0%] from-accent/5 to-transparent" aria-hidden="true" />

        <FadeIn className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary mb-6">
            Medical Exchange · Research · Education
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] text-primary mb-8">
            Where Curiosity<br />
            <em className="font-serif font-light not-italic text-accent">Becomes Discovery</em>
          </h1>
          <p className="font-sans text-xl md:text-2xl text-secondary max-w-2xl mx-auto leading-relaxed mb-4">
            A global community of medical and health-science students united by
            rigorous methodology, cross-border mentorship, and the pursuit of
            evidence-based medicine.
          </p>
          <p className="font-sans italic text-lg text-accent mb-10">&ldquo;{BRAND.motto}&rdquo;</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={LINKS.membershipForm}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 group"
            >
              Join MEDX{" "}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
            <Link
              href="/research"
              className="w-full sm:w-auto px-8 py-4 border-[1px] border-primary text-primary font-semibold tracking-widest uppercase text-sm hover:bg-primary/5 transition-colors text-center"
            >
              Explore Departments
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── MEDX at a Glance ─────────────────────────────────────────── */}
      <section className="border-y-[1px] border-border bg-card py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Board of Achievements</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">MEDX at a Glance</h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {ACHIEVEMENTS.map((a) => (
              <StaggerItem key={a.title} className="border-[1px] border-border bg-background overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover img-scholarly" loading="lazy" decoding="async" />
                </div>
                <div className="p-5">
                  <span
                    className={`inline-block px-2.5 py-0.5 border-[1px] text-[10px] uppercase tracking-widest font-mono mb-3 ${
                      a.badge === "Completed" ? "badge-closed" : a.badge === "Ongoing" ? "badge-ongoing" : "badge-open"
                    }`}
                  >
                    {a.badge}
                  </span>
                  <h3 className="font-semibold text-sm mb-2 group-hover:text-accent transition-colors leading-snug">
                    {a.title}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t-[1px] border-border">
            {[
              { num: "10+", label: "Countries" },
              { num: "20+", label: "Cities" },
              { num: "700+", label: "Students Reached" },
              { num: "5", label: "Active Programs" },
            ].map((s, i) => (
              <StaggerItem key={i} className="text-center">
                <div className="font-mono text-3xl md:text-4xl text-accent mb-2 font-semibold tracking-tight">
                  {s.num}
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Partnerships Banner ──────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Strategic Collaborations</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">Our Partners</h2>
            <div className="section-rule mx-auto" />
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

      {/* ── 6-Domain Navigation Hub ──────────────────────────────────── */}
      <section className="border-y-[1px] border-border bg-card py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Our Structure</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">Six Departments</h2>
            <div className="section-rule mx-auto" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map((dept) => (
              <StaggerItem key={dept.href}>
                <Link
                  href={dept.href}
                  className="p-8 border-[1px] border-border hover:border-accent/30 transition-all duration-300 bg-background flex flex-col h-full group hover:shadow-sm"
                >
                  <dept.icon size={24} className="text-secondary mb-6 group-hover:text-accent transition-colors" strokeWidth={1.5} aria-hidden="true" />
                  <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-1">{dept.tagline}</p>
                  <h3 className="text-lg font-semibold mb-3">{dept.shortName}</h3>
                  <p className="text-sm font-sans text-muted-foreground flex-grow mb-6 leading-relaxed">
                    {dept.description}
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Banners for Upcoming Events (Carousel) ───────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">What's On</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary">Upcoming Events</h2>
              <div className="section-rule mt-4" />
            </div>
            <Link href="/events" className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-2 hover:opacity-70 transition-opacity">
              View All <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </FadeIn>

          <FadeIn>
            <Carousel opts={{ loop: true }} className="px-4 md:px-10">
              <CarouselContent>
                {EVENT_BANNERS.map((b) => (
                  <CarouselItem key={b.label} className="basis-[85%] sm:basis-1/2">
                    <Link href={b.href} className="block border-[1px] border-border overflow-hidden group">
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        <img src={b.image} alt={b.label} className="w-full h-full object-cover img-scholarly" loading="lazy" decoding="async" />
                      </div>
                      <div className="p-4 bg-card">
                        <p className="text-sm font-semibold group-hover:text-accent transition-colors">{b.label}</p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-7xl mx-auto h-[1px] w-full bg-border" />

      {/* ── Weekly News & Research Highlights ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">This Week</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              Weekly News &amp; Research Highlights
            </h2>
            <div className="section-rule" />
          </FadeIn>
          <StaggerContainer className="space-y-4">
            {NEWS_HIGHLIGHTS.map((n) => (
              <StaggerItem key={n.title} className="p-6 border-[1px] border-border bg-background">
                <h3 className="font-semibold text-base mb-1.5">{n.title}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{n.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Motto Banner ──────────────────────────────────────────────── */}
      <section className="bg-accent text-accent-foreground py-28 px-4 sm:px-6 text-center">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mb-6">Our Motto</p>
          <h2 className="font-serif italic text-3xl md:text-5xl font-light tracking-wide max-w-4xl mx-auto leading-relaxed">
            &ldquo;{BRAND.motto}&rdquo;
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mt-8">
            {BRAND.mottoTagline}
          </p>
        </FadeIn>
      </section>

      {/* ── Webinars ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Webinars</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Scheduled Sessions</h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {WEBINARS.map((w) => (
              <StaggerItem key={w.title} className="p-6 border-[1px] border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <Mic size={15} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-widest text-secondary">{w.cadence}</span>
                </div>
                <h3 className="font-semibold text-base mb-2">{w.title}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
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
              description="A quick Q&A - tell us about your session idea and MEDX will follow up by email."
              subject="MEDX - Become a Speaker"
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

      <div className="max-w-7xl mx-auto h-[1px] w-full bg-border" />

      {/* ── Consolidated Join Us Hub ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Get Involved</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">Join MEDX</h2>
            <div className="section-rule mx-auto" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {JOIN_ROLES.map((role) => (
              <StaggerItem key={role.title} className="p-6 border-[1px] border-border bg-background flex flex-col">
                <h3 className="font-semibold text-sm mb-2">{role.title}</h3>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-4 flex-grow">
                  {role.desc}
                </p>
                {role.internal ? (
                  <Link
                    href={role.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity"
                  >
                    Apply <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                ) : (
                  <a
                    href={role.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity"
                  >
                    Apply <ArrowRight size={12} aria-hidden="true" />
                  </a>
                )}
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={LINKS.membershipForm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-sm hover:bg-accent/90 transition-colors group"
            >
              Membership Application Form{" "}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
            <Link
              href="/join"
              className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              All Application Tracks <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
