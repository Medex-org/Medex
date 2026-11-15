import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn } from "@/components/ui/animations";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Section {
  heading: string;
  paragraphs: string[];
}

interface Faq {
  question: string;
  answer: string;
}

interface RelatedLink {
  label: string;
  href: string;
  description: string;
}

interface SeoArticleProps {
  seo: { title: string; description: string; brandSuffix?: boolean };
  title: string;
  intro: string;
  sections: Section[];
  faqs: Faq[];
  related: RelatedLink[];
}

export function SeoArticle({ seo, title, intro, sections, faqs, related }: SeoArticleProps) {
  return (
    <Layout>
      <PageMeta {...seo} />

      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: "Education", href: "/education/" },
              { label: title },
            ]}
          />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              MEDX R&amp;Ed Education
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-primary">{title}</h1>
            <div className="section-rule mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl leading-relaxed">{intro}</p>
          </FadeIn>
        </div>
      </section>

      <article className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-14">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-5">
                {section.heading}
              </h2>
              <div className="space-y-4 font-sans text-base md:text-lg text-secondary leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="border-t-[1px] border-border pt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-lg text-primary mb-2">{faq.question}</h3>
                  <p className="font-sans text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t-[1px] border-border pt-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-6 border-[1px] border-border bg-card hover:border-accent/40 transition-colors"
                >
                  <span className="font-semibold text-primary flex items-center gap-2 mb-2">
                    {link.label} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                  <span className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {link.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="p-8 md:p-10 bg-card border-[1px] border-border text-center">
            <h2 className="text-2xl font-semibold text-primary mb-3">Ready to get involved?</h2>
            <p className="font-sans text-secondary mb-6">
              Join MEDX R&amp;Ed and learn research, exchange, and global health with a
              student-led community.
            </p>
            <Link
              href="/join/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-sm hover:bg-accent/90 transition-colors"
            >
              Join MEDX <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </article>
    </Layout>
  );
}
