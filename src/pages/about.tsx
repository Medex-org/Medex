import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { BookOpen, Users, Lightbulb, Globe2 } from "lucide-react";
import { Link } from "wouter";
import { BRAND } from "@/config/links";

export default function About() {
  return (
    <Layout>
      <PageMeta {...SEO.about} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Our Story
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              About MEDX
            </h1>
            <div className="section-rule mb-8" />
            <p className="font-sans text-xl md:text-2xl text-secondary leading-relaxed max-w-3xl">
              MEDX R&amp;Ed exists to democratize access to medical research and
              education - connecting students across borders, institutions, and
              disciplines to collaborate, learn, and publish.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* History */}
          <FadeIn className="mb-20">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Background</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Our History</h2>
            <div className="section-rule mb-8" />
            <div className="prose prose-lg prose-slate font-sans max-w-none text-muted-foreground">
              <p>
                MEDX was founded by Sangeen Khan, a medical student whose experience
                navigating the barriers of clinical research as a student inspired him
                to build something different. It quickly became clear that the challenges
                he faced - lack of structured guidance, no access to methodology training,
                and an absence of global peer networks - were universal.
              </p>
              <p>
                What began as a small cohort of passionate students evolved into a
                global organization running systematic review workshops, long-term
                mentorship programs, and international conference preparation -
                guided by a singular principle: rigorous, evidence-based medicine
                should be accessible to all who wish to learn.
              </p>
              <p>
                Today, MEDX R&amp;Ed spans 10+ countries and 20+ cities, with City
                Representatives building local chapters from Pakistan and Sri Lanka to
                Colombia and Canada - united under one mission:{" "}
                <em>{BRAND.motto}.</em>
              </p>
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border my-20" />

          {/* What We Do */}
          <FadeIn className="mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Our Focus</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">What We Do</h2>
            <div className="section-rule" />
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <StaggerItem>
              <BookOpen size={24} className="text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Research Programs</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Our flagship SRMA workshops guide cohorts through the rigorous process
                of systematic review and meta-analysis, resulting in publication-ready
                manuscripts.
              </p>
            </StaggerItem>
            <StaggerItem>
              <Lightbulb size={24} className="text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Educational Outreach</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Through workshops, webinars, and the MEDX Minds platform, we provide
                curated medical education and mental wellness resources for the next
                generation of physician-scientists.
              </p>
            </StaggerItem>
            <StaggerItem>
              <Users size={24} className="text-accent mb-4" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-2">Global Network</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                City Representatives and Campus Ambassadors build local chapters that
                connect back to our international framework, fostering cross-border
                collaboration and community.
              </p>
            </StaggerItem>
          </StaggerContainer>

          <div className="h-[1px] w-full bg-border my-20" />

          {/* Member Benefits */}
          <FadeIn className="mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Membership</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">Member Benefits</h2>
            <div className="section-rule mb-8" />
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-20">
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
                  className="flex items-center gap-3 p-3 border-[1px] border-border bg-card text-sm"
                >
                  <span className="font-mono text-xs text-accent flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-muted-foreground text-xs leading-snug">{benefit}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <div className="h-[1px] w-full bg-border my-20" />

          {/* Partnerships pointer */}
          <FadeIn className="p-8 border-[1px] border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Partnerships &amp; Collaborations</h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed max-w-md">
                MEDX's strategic partners - Metasphere Global, GradMeta, SRF AKU, and NSRI BUMHS-LC -
                now have their own dedicated department page.
              </p>
            </div>
            <Link
              href="/partnerships"
              className="w-full sm:w-fit px-6 py-3 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors text-center flex-shrink-0"
            >
              View Partnerships
            </Link>
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
            &ldquo;{BRAND.motto}&rdquo;
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/40 mt-8">
            {BRAND.mottoTagline}
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}
