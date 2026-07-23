import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import {
  Globe2, FlaskConical, GraduationCap, ArrowRight,
  Activity, Brain, Plane, Users2
} from "lucide-react";
import { Link } from "wouter";
import partnershipImg from "@assets/IMG-20260720-WA0022.jpg";
import researchWeekImg from "@assets/IMG-20260721-WA0015.jpg";

export default function Home() {
  return (
    <Layout>
      <PageMeta
        title="MEDX R&Ed — Medical Exchange, Research & Education"
        description="A global community of medical and health-science students united by rigorous methodology, cross-border mentorship, and the pursuit of evidence-based medicine."
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Fine grid — uses CSS vars so it adapts to dark mode */}
        <div
          className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />
        {/* Warm vignette */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-radial-[at_50%_0%] from-accent/5 to-transparent" aria-hidden="true" />

        <FadeIn className="relative z-10 max-w-4xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary mb-6">
            Medical Exchange · Research · Education
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] text-primary mb-8">
            Where Curiosity<br />
            <em className="font-serif font-light not-italic text-accent">Becomes Discovery</em>
          </h1>
          <p className="font-serif text-xl md:text-2xl text-secondary max-w-2xl mx-auto leading-relaxed mb-12">
            A global community of medical and health-science students united by
            rigorous methodology, cross-border mentorship, and the pursuit of
            evidence-based medicine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://forms.gle/yJzGnk4DwmWysygv9"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 group"
            >
              Join MEDX{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </a>
            <Link
              href="/programs"
              className="w-full sm:w-auto px-8 py-4 border-[1px] border-primary text-primary font-semibold tracking-widest uppercase text-sm hover:bg-primary/5 transition-colors text-center"
            >
              Explore Programs
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ── Mission Strip ─────────────────────────────────────────────── */}
      <section className="border-y-[1px] border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <StaggerItem className="p-10 md:p-12 flex flex-col items-center text-center group">
              <Globe2
                size={32}
                className="text-accent mb-6 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold mb-3">Exchange</h2>
              <p className="text-muted-foreground font-serif">
                Connecting students across borders, institutions, and disciplines
                to collaborate and grow.
              </p>
            </StaggerItem>
            <StaggerItem className="p-10 md:p-12 flex flex-col items-center text-center group">
              <FlaskConical
                size={32}
                className="text-accent mb-6 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold mb-3">Research</h2>
              <p className="text-muted-foreground font-serif">
                Mentoring the next generation of physician-scientists through
                rigorous, structured methodology.
              </p>
            </StaggerItem>
            <StaggerItem className="p-10 md:p-12 flex flex-col items-center text-center group">
              <GraduationCap
                size={32}
                className="text-accent mb-6 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold mb-3">Education</h2>
              <p className="text-muted-foreground font-serif">
                Democratizing access to evidence-based medical knowledge for
                all who wish to learn.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "700+", label: "Students Reached" },
              { num: "15+", label: "City Representatives" },
              { num: "8+", label: "Countries" },
              { num: "5", label: "Active Programs" },
            ].map((s, i) => (
              <StaggerItem key={i} className="text-center">
                <div className="font-mono text-4xl md:text-5xl text-accent mb-2 font-semibold tracking-tight">
                  {s.num}
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
                  {s.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Programs Overview ────────────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Our Initiatives
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-primary">
              Five Pillars of MEDX
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                Icon: Activity,
                title: "MEDX Research",
                sub: "SRMA Workshop Series",
                desc: "Structured methodology for systematic review and meta-analysis — from beginner to published author.",
                href: "/programs",
                cta: "Explore Research",
              },
              {
                Icon: GraduationCap,
                title: "MEDX Education",
                sub: "LTE Mentorship",
                desc: "Long-term academic guidance connecting aspiring researchers with experienced mentors.",
                href: "/programs",
                cta: "Explore Education",
              },
              {
                Icon: Brain,
                title: "MEDX Minds",
                sub: "Member Platform",
                desc: "Curated medical education content — workshops, expert lectures, and structured learning modules.",
                href: "/medx-minds",
                cta: "Access Platform",
              },
              {
                Icon: Plane,
                title: "Higher Pathways Guidance",
                sub: "Coming Soon",
                desc: "Guidance and resources for students pursuing advanced degrees and international academic opportunities.",
                href: "/programs",
                cta: "Learn More",
              },
              {
                Icon: Globe2,
                title: "Medical Exchange",
                sub: "Global Network",
                desc: "Cross-border student exchange, conference participation, and international collaboration programs.",
                href: "/programs",
                cta: "Learn More",
              },
              {
                Icon: Users2,
                title: "City Representatives",
                sub: "Local Leadership",
                desc: "A global network of student leaders building local research communities in their cities.",
                href: "/city-reps",
                cta: "Meet the Reps",
              },
            ].map(({ Icon, title, sub, desc, href, cta }, i) => (
              <StaggerItem
                key={i}
                className="p-8 border-[1px] border-border hover:border-accent/30 transition-all duration-300 bg-card flex flex-col h-full group hover:shadow-sm"
              >
                <Icon
                  size={24}
                  className="text-secondary mb-6 group-hover:text-accent transition-colors"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-1">
                  {sub}
                </p>
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm font-serif text-muted-foreground flex-grow mb-6 leading-relaxed">
                  {desc}
                </p>
                <Link
                  href={href}
                  className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  {cta} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Research Week Feature ─────────────────────────────────────── */}
      <section className="border-y-[1px] border-border bg-card py-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              Featured Event
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-primary leading-tight">
              MEDX &times; NSRI<br />Complete Research Week
            </h2>
            <p className="font-serif text-lg text-secondary leading-relaxed mb-4">
              A 6-day intensive online research program in collaboration with
              NSRI BUMHS-LC. Participants gain hands-on experience in
              cross-sectional studies, SPSS data analysis, manuscript writing,
              and publication.
            </p>
            <p className="font-serif text-sm text-muted-foreground mb-8">
              Mentored by Dr. Rida Noor and Abdul Moiz —{" "}
              <em>Research Today, Impact Tomorrow.</em>
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors group"
            >
              View All Events{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </FadeIn>

          <FadeIn delay={0.15} direction="left">
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full border-[1px] border-border pointer-events-none" aria-hidden="true" />
              <img
                src={researchWeekImg}
                alt="MEDX × NSRI Cross Sectional Studies — Research Week session in progress"
                className="w-full h-auto object-cover img-scholarly border-[1px] border-border relative z-10"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Partnership Announcement ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right" className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-[1px] border-border pointer-events-none" aria-hidden="true" />
              <img
                src={partnershipImg}
                alt="MEDX R&Ed × GradMeta Strategic Partnership Announcement"
                className="w-full h-auto object-cover img-scholarly border-[1px] border-border relative z-10"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="order-1 lg:order-2">
            <p className="font-mono text-xs uppercase tracking-widest text-accent mb-4">
              Partnership Announcement
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-primary">
              MEDX &times; GradMeta
            </h2>
            <p className="font-serif text-lg text-secondary leading-relaxed mb-4">
              MEDX R&amp;Ed is proud to announce a strategic partnership with
              GradMeta — empowering students through AI-powered research tools,
              education, mentorship, and global academic opportunities.
            </p>
            <p className="font-serif text-sm text-muted-foreground mb-8">
              Members receive exclusive free access to GradMeta's professional
              systematic review tool (worth $50) — validated against R metafor
              across core statistical methods.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-semibold uppercase tracking-widest text-xs text-accent hover:opacity-70 transition-opacity group"
            >
              Learn About Our Partnerships{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Motto Banner ──────────────────────────────────────────────── */}
      <section className="bg-accent text-accent-foreground py-28 px-4 sm:px-6 text-center">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mb-6">
            Our Motto
          </p>
          <h2 className="font-serif italic text-3xl md:text-5xl font-light tracking-wide max-w-4xl mx-auto leading-relaxed">
            "Together, We Turn Curiosity into Discovery"
          </h2>
        </FadeIn>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="flex justify-between items-end mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
                What's On
              </p>
              <h2 className="text-3xl font-semibold text-primary">Agenda</h2>
              <div className="section-rule mt-4" />
            </div>
            <Link
              href="/events"
              className="hidden md:flex text-xs font-semibold uppercase tracking-widest text-accent items-center gap-2 hover:opacity-70 transition-opacity"
            >
              View All <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </FadeIn>

          <StaggerContainer className="flex flex-col">
            {[
              {
                name: "ASH Annual Meeting",
                type: "Conference",
                status: "Upcoming",
                desc: "Mentorship and abstract preparation support for the American Society of Hematology.",
              },
              {
                name: "SVIN Annual Meeting",
                type: "Conference",
                status: "Upcoming",
                desc: "Coordinating participation for the Society of Vascular and Interventional Neurology.",
              },
              {
                name: "MEDX × NSRI Research Week",
                type: "Workshop",
                status: "Ongoing",
                desc: "Collaborative 6-day research program — Cross-Sectional Studies, SPSS, Manuscript Writing.",
              },
              {
                name: "LTE Free Workshop — Letter to Editor",
                type: "Workshop",
                status: "Completed",
                desc: "Free session on Letter to the Editor writing, journal selection, and submission — Speaker: Imad Khan.",
              },
            ].map((event, i) => (
              <StaggerItem
                key={i}
                className="border-t-[1px] border-border py-8 group"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-2">
                    <span className="font-mono text-sm text-secondary uppercase tracking-widest">
                      {event.type}
                    </span>
                  </div>
                  <div className="md:col-span-5">
                    <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                      {event.name}
                    </h3>
                  </div>
                  <div className="md:col-span-3">
                    <p className="font-serif text-muted-foreground text-sm">
                      {event.desc}
                    </p>
                  </div>
                  <div className="md:col-span-2 md:text-right">
                    <span
                      className={`inline-block px-3 py-1 border-[1px] text-xs uppercase tracking-widest font-mono ${
                        event.status === "Ongoing"
                          ? "badge-ongoing"
                          : event.status === "Completed"
                          ? "badge-closed"
                          : "badge-upcoming"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
            <div className="border-t-[1px] border-border" />
          </StaggerContainer>

          <div className="md:hidden mt-8">
            <Link
              href="/events"
              className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-2"
            >
              View All Events <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-28 px-4 sm:px-6 text-center">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/40 mb-6">
            Ready to Begin?
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 max-w-3xl mx-auto leading-tight">
            Become Part of Something Extraordinary
          </h2>
          <p className="font-serif text-lg text-primary-foreground/70 max-w-xl mx-auto mb-10">
            Whether you're a medical student, researcher, or passionate advocate
            for evidence-based medicine — there is a place for you here.
          </p>
          <a
            href="https://forms.gle/yJzGnk4DwmWysygv9"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-sm hover:bg-accent/90 transition-colors group"
          >
            Join MEDX{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </a>
        </FadeIn>
      </section>
    </Layout>
  );
}
