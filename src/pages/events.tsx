import { Layout } from "@/components/layout";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { Calendar, ArrowRight } from "lucide-react";
import { LINKS } from "@/config/links";
import researchWeekDay1 from "@assets/nsri-and-medx-announces-complete-research-week.webp";
import lteFlyer from "@assets/collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp";
import campusAmbFlyer from "@assets/medx-join-us-as-campus-ambassadors.webp";

const events = [
  {
    name: "ASH Annual Meeting",
    type: "Conference",
    status: "Upcoming",
    date: "TBA - Dec 2026",
    desc: "MEDX R&Ed is preparing participants for the American Society of Hematology Annual Meeting - one of the premier global conferences in blood disorders research. Apply for mentorship and abstract preparation support.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "Apply for Mentorship",
  },
  {
    name: "SVIN Annual Meeting",
    type: "Conference",
    status: "Upcoming",
    date: "TBA",
    desc: "Society of Vascular and Interventional Neurology Annual Meeting. MEDX is coordinating participation and abstract submissions for students.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "Express Interest",
  },
  {
    name: "MEDX × NSRI Complete Research Week",
    type: "Workshop",
    status: "Ongoing",
    date: "July 20–26, 2026 · 10PM PKT",
    desc: "6-day intensive online research program in collaboration with NSRI BUMHS-LC. Covering Cross-Sectional Studies, SPSS Data Analysis, Manuscript Writing, and more. Mentors: Dr. Rida Noor & Abdul Moiz.",
    image: researchWeekDay1,
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfCvfQnpyB96EkLhmeIVv8JZl3VOeSBSQITBiBNa3R5FydsBQ/viewform",
    linkLabel: "View Program",
  },
  {
    name: "LTE Free Workshop - Letter to the Editor",
    type: "Workshop",
    status: "Completed",
    date: "July 18, 2026 · 10PM PKT",
    desc: "Free session on Letter to the Editor writing - what it is, structure, journal selection, and submission process. Speaker: Imad Khan (North West School of Medicine, Peshawar, 5+ Publications).",
    image: lteFlyer,
    link: null,
    linkLabel: null,
  },
  {
    name: "SRMA Free Lecture Series",
    type: "Workshop",
    status: "Ongoing",
    date: "Recurring · 8PM PKT",
    desc: "Free introductory lectures on systematic review and meta-analysis methodology. Open to all. Sessions held regularly - check MEDX channels for the next scheduled session.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "Register",
  },
  {
    name: "MEDX Website Official Launch",
    type: "Community",
    status: "Upcoming",
    date: "Monday (Announced)",
    desc: "Official MEDX website launch - a live session with the global team and a guest speaker. Registration open.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "RSVP",
  },
  {
    name: "Campus Ambassador Recruitment Drive",
    type: "Recruitment",
    status: "Open",
    date: "Ongoing",
    desc: "MEDX is recruiting Campus Ambassadors across institutions worldwide. Be the voice of MEDX in your institution - expand the global network, lead initiatives, and develop leadership skills.",
    image: campusAmbFlyer,
    link: LINKS.campusAmbassadorForm,
    linkLabel: "Apply Now",
  },
];

const statusStyles: Record<string, string> = {
  Upcoming: "badge-upcoming",
  Ongoing: "badge-ongoing",
  Completed: "badge-closed",
  Open: "badge-open",
};

export default function Events() {
  return (
    <Layout>
      <PageMeta {...SEO.events} />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Events" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Calendar
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Events &amp; Opportunities
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto">
              Conferences, workshops, and recruitment opportunities for the
              MEDX community.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="space-y-6">
            {events.map((event, i) => (
              <StaggerItem
                key={i}
                className="border-[1px] border-border bg-background hover:bg-card transition-colors group overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Fixed-width image slot - present or absent, layout stays consistent */}
                  <div className="md:w-52 flex-shrink-0 overflow-hidden bg-muted">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-40 md:h-full object-cover img-scholarly"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-2 md:h-full md:w-52" aria-hidden="true" />
                    )}
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span
                        className={`inline-block px-3 py-1 border-[1px] text-xs uppercase tracking-widest font-mono w-fit ${
                          statusStyles[event.status] ?? "badge-upcoming"
                        }`}
                      >
                        {event.status}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-secondary">
                        {event.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-accent transition-colors">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-secondary font-mono mb-3">
                        <Calendar size={13} aria-hidden="true" />
                        {event.date}
                      </div>
                      <p className="font-sans text-muted-foreground leading-relaxed text-sm">
                        {event.desc}
                      </p>
                    </div>

                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 py-2 -my-2 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity mt-auto group/link w-fit"
                      >
                        {event.linkLabel}{" "}
                        <ArrowRight
                          size={13}
                          className="group-hover/link:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-4xl font-semibold mb-6">
            Don't Miss an Opportunity
          </h2>
          <p className="font-sans text-accent-foreground/80 max-w-xl mx-auto mb-8">
            Follow MEDX on social media and join our community to stay updated
            on all events, workshops, and recruitment drives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={LINKS.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border-[1px] border-accent-foreground/30 text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-accent-foreground/10 transition-colors"
            >
              Follow on Instagram
            </a>
            <a
              href={LINKS.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 border-[1px] border-accent-foreground/30 text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-accent-foreground/10 transition-colors"
            >
              Follow on LinkedIn
            </a>
          </div>
        </FadeIn>
      </section>
    </Layout>
  );
}
