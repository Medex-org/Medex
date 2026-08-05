import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { LINKS } from "@/config/links";

interface PricingTier {
  name: string;
  summary: string;
  includes: string[];
}

/**
 * Tier inclusions are accurate to the program structure; MEDX has not
 * published fixed dollar figures for these tiers, so pricing is intentionally
 * not fabricated here - applicants receive it during application review.
 */
const TIERS: PricingTier[] = [
  {
    name: "Only LTE Mentorship",
    summary: "1:1 guidance for students already enrolled in a research project.",
    includes: [
      "One-on-one sessions with an assigned mentor",
      "Structured feedback on manuscript drafts",
      "Methodology & statistics troubleshooting",
      "Submission & publication guidance",
    ],
  },
  {
    name: "LTE Lectures + Mentorship",
    summary: "The full track - structured lecture series alongside 1:1 mentorship.",
    includes: [
      "Everything in Only LTE Mentorship",
      "Full SRMA / LTE lecture series access",
      "Cohort peer-learning sessions",
      "Priority scheduling with mentors",
    ],
  },
];

export function MentorshipPricing() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TIERS.map((tier) => (
          <div key={tier.name} className="p-6 border-[1px] border-border bg-card flex flex-col">
            <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
            <p className="font-sans text-sm text-muted-foreground mb-4">{tier.summary}</p>
            <ul className="space-y-2 mb-6 flex-grow">
              {tier.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-sans text-muted-foreground">
                  <Check size={14} className="text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Pricing shared during application review
            </p>
            <a
              href={LINKS.menteeForm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors"
            >
              Apply for This Tier <ArrowRight size={13} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border-[1px] border-accent/25 bg-accent/5 flex items-start gap-3">
        <ShieldCheck size={18} className="text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Mentorship fees directly fund LMS infrastructure, research tools, and student publication grants.
        </p>
      </div>
    </div>
  );
}
