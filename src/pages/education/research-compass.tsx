import * as React from "react";
import { Link } from "wouter";
import { ArrowRight, Compass } from "lucide-react";
import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SEO } from "@/data/seo";
import {
  RESEARCH_CHECKLIST,
  RESEARCH_FAQS,
  RESEARCH_PATHS,
  RESEARCH_STEPS,
  RESEARCH_TOPICS,
} from "@/data/research-compass";

export default function ResearchCompass() {
  const [checked, setChecked] = React.useState<Record<number, boolean>>({});
  const completed = RESEARCH_CHECKLIST.filter((_, index) => checked[index]).length;
  const progress = Math.round((completed / RESEARCH_CHECKLIST.length) * 100);

  return (
    <Layout>
      <PageMeta {...SEO.researchCompass} />

      <section className="relative overflow-hidden border-b-[1px] border-border bg-primary text-primary-foreground">
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none bg-texture-molecular" aria-hidden="true" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-radial-[at_20%_0%] from-accent/5 to-transparent" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: "Education", href: "/education/" },
              { label: "Research Compass" },
            ]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <FadeIn>
              <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60 mb-5 flex items-center gap-2">
                <Compass size={14} aria-hidden="true" /> MEDX Research Compass
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold leading-[1.08] mb-6">
                From Curiosity
                <br />
                <em className="font-serif font-light not-italic text-accent">to Publication</em>
              </h1>
              <p className="font-sans text-lg md:text-xl text-primary-foreground/70 leading-relaxed max-w-2xl mb-8">
                A practical route for medical and health-science students who want to
                start research without pretending they already know everything.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <a
                  href="#roadmap"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors"
                >
                  Start the Roadmap <ArrowRight size={14} aria-hidden="true" />
                </a>
                <Link
                  href="/research/"
                  className="inline-flex items-center gap-2 px-7 py-4 border-[1px] border-primary-foreground/20 text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary-foreground/10 transition-colors"
                >
                  Explore Research <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary-foreground/60 mt-6">
                No prior experience required
              </p>
            </FadeIn>

            <FadeIn delay={0.15} direction="left">
              <div className="border-[1px] border-primary-foreground/15 bg-primary-foreground/[0.04] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60">
                    Your route
                  </p>
                  <Compass size={18} className="text-accent" aria-hidden="true" />
                </div>
                <ol className="space-y-3">
                  {RESEARCH_STEPS.map(({ id, title, icon: Icon }, index) => (
                    <li
                      key={id}
                      className="flex items-center gap-3 border-b-[1px] border-primary-foreground/10 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-mono text-[10px] text-accent w-6 flex-shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon size={15} className="text-primary-foreground/60 flex-shrink-0" aria-hidden="true" />
                      <span className="font-sans text-sm text-primary-foreground/80">{title}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="roadmap" className="py-24 px-4 sm:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              The Route
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">
              Six steps from curiosity to a credible project
            </h2>
            <div className="section-rule mb-5" />
            <p className="font-sans text-secondary leading-relaxed">
              You do not have to follow every step perfectly. You do need to know
              where you are, what comes next, and when to ask for help.
            </p>
          </FadeIn>

          <div className="relative">
            <div
              className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-[1px] bg-border"
              aria-hidden="true"
            />
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {RESEARCH_STEPS.map(({ id, title, summary, icon: Icon }, index) => (
                <StaggerItem
                  key={id}
                  className="relative z-10 h-full border-[1px] border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="font-mono text-xs text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon size={18} className="text-secondary" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{title}</h3>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    {summary}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      <section className="border-y-[1px] border-border bg-card py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-10 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Choose Your Starting Point
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">
              Where are you right now?
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <Tabs defaultValue={RESEARCH_PATHS[0].id}>
            <TabsList className="flex w-full flex-col sm:flex-row h-auto p-1">
              {RESEARCH_PATHS.map((path) => (
                <TabsTrigger
                  key={path.id}
                  value={path.id}
                  className="flex-1 px-4 py-3 text-xs uppercase tracking-widest"
                >
                  {path.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {RESEARCH_PATHS.map((path) => (
              <TabsContent key={path.id} value={path.id} className="mt-6">
                <div className="border-[1px] border-border bg-background p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                    {path.headline}
                  </h3>
                  <p className="font-sans text-secondary leading-relaxed max-w-3xl">
                    {path.description}
                  </p>
                  <div className="mt-8 space-y-5">
                    {path.actions.map((action, index) => (
                      <div
                        key={action.title}
                        className="flex gap-4 border-t-[1px] border-border pt-5 first:border-0 first:pt-0"
                      >
                        <span className="font-mono text-xs text-accent flex-shrink-0 pt-0.5">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <p className="font-semibold text-sm">{action.title}</p>
                            {action.href ? (
                              <Link
                                href={action.href}
                                className="inline-flex items-center gap-1 py-1 -my-1 text-[10px] font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity"
                              >
                                Explore <ArrowRight size={11} aria-hidden="true" />
                              </Link>
                            ) : null}
                          </div>
                          <p className="font-sans text-sm text-muted-foreground leading-relaxed mt-1">
                            {action.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Build Your Foundation
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">
              Pick the next skill to strengthen
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESEARCH_TOPICS.map(({ title, description, href, tag, icon: Icon }) => (
              <StaggerItem key={title} className="h-full">
                <Link
                  href={href}
                  className="group flex h-full flex-col border-[1px] border-border bg-background p-7 hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <Icon size={22} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-accent transition-colors">
                    {title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed flex-grow">
                    {description}
                  </p>
                  <span className="mt-auto pt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
                    Explore <ArrowRight size={13} aria-hidden="true" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="border-y-[1px] border-border bg-card py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              First 30 Days
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">
              A checklist you can actually finish
            </h2>
            <div className="section-rule mb-5" />
            <p className="font-sans text-secondary leading-relaxed">
              Tick these off as you go. The goal is momentum, not a perfect first
              draft.
            </p>

            <div className="mt-8 border-[1px] border-border bg-background p-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="font-mono text-xs uppercase tracking-widest text-secondary">
                  {completed} of {RESEARCH_CHECKLIST.length} complete
                </p>
                <p className="font-mono text-xs text-accent">{progress}%</p>
              </div>
              <Progress value={progress} className="h-1.5" aria-label="Research checklist progress" />
              <p className="font-sans text-xs text-muted-foreground leading-relaxed mt-4">
                {completed === RESEARCH_CHECKLIST.length
                  ? "Route mapped. Now take the first step."
                  : "Small, consistent progress beats one heroic weekend."}
              </p>
              <button
                type="button"
                onClick={() => setChecked({})}
                className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-secondary hover:text-accent transition-colors"
              >
                Reset checklist
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="border-[1px] border-border bg-background divide-y divide-border">
              {RESEARCH_CHECKLIST.map((item, index) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={Boolean(checked[index])}
                    onCheckedChange={(value) =>
                      setChecked((current) => ({ ...current, [index]: value === true }))
                    }
                    className="mt-0.5"
                  />
                  <span
                    className={
                      checked[index]
                        ? "font-sans text-sm text-muted-foreground line-through"
                        : "font-sans text-sm text-foreground"
                    }
                  >
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">
              Before you start
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <Accordion type="single" collapsible className="border-t-[1px] border-border">
            {RESEARCH_FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-24 px-4 sm:px-6 text-center">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60 mb-5">
            Ready for the next step?
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold max-w-3xl mx-auto mb-5">
            Bring your curiosity. We will help with the method.
          </h2>
          <p className="font-sans text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8">
            Join a structured research cohort, find a mentor, or start with one of
            the guides above.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/research/"
              className="inline-flex items-center gap-2 px-7 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors"
            >
              Explore Research Cohorts <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/join/"
              className="inline-flex items-center gap-2 px-7 py-4 border-[1px] border-primary-foreground/20 text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary-foreground/10 transition-colors"
            >
              Join MEDX <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </Layout>
  );
}
