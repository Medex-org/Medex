import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Progress } from "@/components/ui/progress";
import { Cpu, BookOpen, Award, Bot, PlayCircle, Lock } from "lucide-react";

const COURSES = [
  { title: "SRMA Foundations", progress: 65, certificate: false },
  { title: "Manuscript Writing Essentials", progress: 100, certificate: true },
  { title: "SPSS for Medical Research", progress: 20, certificate: false },
];

export default function DepartmentTechnology() {
  return (
    <Layout>
      <PageMeta {...SEO.technology} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Departments" }, { label: "Technology & Innovation" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6 flex items-center justify-center gap-2">
              <Cpu size={14} aria-hidden="true" /> Department of Technology &amp; Innovation
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Tech &amp; LMS Hub
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              The technology backbone of MEDX - a centralized learning platform built for
              tracking progress and accelerating study, wherever you are.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* LMS Preview */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Preview</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">Course Tracking</h2>
              <div className="section-rule" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-1 border-[1px] border-dashed border-border">
              Preview layout - full LMS in development
            </span>
          </FadeIn>

          <StaggerContainer className="space-y-4">
            {COURSES.map((c) => (
              <StaggerItem key={c.title} className="p-6 border-[1px] border-border bg-card">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between mb-3 gap-x-4">
                  <div className="flex items-center gap-3">
                    <BookOpen size={16} className="text-accent flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="font-semibold text-sm">{c.title}</h3>
                  </div>
                  {c.certificate ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-accent">
                      <Award size={13} aria-hidden="true" /> Certificate Issued
                    </span>
                  ) : (
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                      {c.progress}% Complete
                    </span>
                  )}
                </div>
                <Progress value={c.progress} className="h-1.5" aria-label={`${c.title} course progress`} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="h-[1px] w-full bg-border" />

      {/* Feature Grid */}
      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Platform</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">What the LMS Will Include</h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem className="p-8 border-[1px] border-border bg-background">
              <BookOpen size={24} className="text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-3">Course Tracking</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Progress tracking across every MEDX workshop and cohort, in one place.
              </p>
            </StaggerItem>
            <StaggerItem className="p-8 border-[1px] border-border bg-background">
              <Award size={24} className="text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-3">Certificate Generation</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Automatic, verifiable certificates issued the moment a course is completed.
              </p>
            </StaggerItem>
            <StaggerItem className="p-8 border-[1px] border-border bg-background">
              <Bot size={24} className="text-accent mb-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-lg mb-3">AI-Assisted Study Companion</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                An AI companion to help members review methodology concepts and prepare for
                assessments at their own pace.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* AI Companion Preview Card */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="p-10 border-[1px] border-dashed border-border bg-card flex flex-col items-center text-center">
            <Lock size={22} className="text-muted-foreground mb-5" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="text-xl font-semibold mb-3">AI Study Companion</h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              This feature is in active development and will unlock for members once the LMS
              backend is connected.
            </p>
            <button
              disabled
              className="inline-flex items-center gap-2 px-6 py-3 border-[1px] border-border text-muted-foreground font-semibold tracking-widest uppercase text-xs cursor-not-allowed"
            >
              <PlayCircle size={14} aria-hidden="true" /> Coming Soon
            </button>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
