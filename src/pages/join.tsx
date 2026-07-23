import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight } from "lucide-react";
import memberBenefitsImg from "@assets/WhatsApp Image 2026-07-23 at 5.16.43 PM.jpeg";
import campusAmbImg from "@assets/WhatsApp Image 2026-07-18 at 2.18.36 AM.jpeg";

const tracks = [
  {
    title: "City Representative",
    desc: "Lead MEDX initiatives in your local area, coordinate with the global team, recruit campus ambassadors, and build a local research community.",
    requirements: [
      "Medical or health-science student",
      "Strong communication skills",
      "Passion for research & community building",
    ],
    form: "https://forms.gle/yJzGnk4DwmWysygv9",
  },
  {
    title: "Campus Ambassador",
    desc: "Represent MEDX within your specific institution, connecting students to our international resources, events, and opportunities.",
    requirements: [
      "Enrolled in any health-related program",
      "Interest in medical research & education",
      "Ability to inspire peers",
    ],
    form: "https://forms.gle/yJzGnk4DwmWysygv9",
  },
  {
    title: "Workshop Participant",
    desc: "Join as a student to learn research methodology, access MEDX Minds, collaborate on real publications, and build your academic profile.",
    requirements: [
      "Open to all medical & health-science students",
      "Commitment to attend scheduled sessions",
      "Curiosity-driven learning mindset",
    ],
    form: "https://forms.gle/yJzGnk4DwmWysygv9",
  },
  {
    title: "MEDX Minds Associate",
    desc: "Join the MEDX Minds team to contribute to mental wellness initiatives, share your story, and support fellow students in their academic journey.",
    requirements: [
      "Interest in mental health & medical wellness",
      "Willingness to share personal experiences",
      "Collaborative mindset",
    ],
    form: "https://forms.gle/yJzGnk4DwmWysygv9",
  },
];

const benefits = [
  "Official MEDX E-Card with your photo",
  "Global Recognition on MEDX website",
  "Citation for your Published Work",
  "Get Your Story Featured on MEDX",
  "Up to 50% Discount on All Programs",
  "Global Connectivity & Identification",
  "Letters of Recommendation & Certificates",
  "Campus WhatsApp Community Access",
  "Eligible for Sponsorship",
  "Eligible for Scholarships",
  "Eligible for Donations & Funding",
  "Exclusive Lifetime GradMeta Access Code",
];

export default function Join() {
  return (
    <Layout>
      <PageMeta
        title="Join MEDX"
        description="Become part of MEDX R&Ed - apply as a City Representative, Campus Ambassador, Workshop Participant, or MEDX Minds Associate. Open to all medical and health-science students."
      />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/40 mb-6">
              Be Part of MEDX
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-6">
              Become Part of Something Extraordinary
            </h1>
            <p className="font-serif text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
              MEDX R&amp;Ed is building the next generation of physician-scientists.
              Whether you're a medical student, health-science researcher, or
              passionate advocate for evidence-based medicine - there is a place
              for you here.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Application Tracks */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Select Your Path
            </p>
            <h2 className="text-3xl font-semibold text-primary mb-4">
              Application Tracks
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map((track, i) => (
              <StaggerItem
                key={i}
                className="p-8 border-[1px] border-border bg-card hover:border-accent/30 transition-all group flex flex-col"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
                  Track {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                  {track.title}
                </h3>
                <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {track.desc}
                </p>
                <div className="mb-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">
                    Who can apply
                  </p>
                  <ul className="space-y-1">
                    {track.requirements.map((r, j) => (
                      <li key={j} className="text-sm text-muted-foreground font-serif flex gap-2">
                        <span className="text-accent flex-shrink-0" aria-hidden="true">-</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={track.form}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors group/btn w-fit"
                >
                  Apply Now{" "}
                  <ArrowRight
                    size={13}
                    className="group-hover/btn:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 bg-card border-y-[1px] border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
                Why Join?
              </p>
              <h2 className="text-3xl font-semibold text-primary mb-6">
                Member Benefits
              </h2>
              <p className="font-serif text-secondary mb-8 leading-relaxed">
                MEDX membership unlocks a world of opportunities. Become a member
                today and gain access to 12 exclusive benefits - from research tools
                to global recognition.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border-[1px] border-border bg-background text-sm"
                  >
                    <span className="font-mono text-xs text-accent flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-muted-foreground text-xs leading-snug">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href="https://forms.gle/yJzGnk4DwmWysygv9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-sm hover:bg-accent/90 transition-colors group"
              >
                Join MEDX Today{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </a>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-4">
                Applications reviewed on a rolling basis.
              </p>
            </FadeIn>

            <FadeIn delay={0.15} direction="left">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-full h-full border-[1px] border-border pointer-events-none" aria-hidden="true" />
                <img
                  src={memberBenefitsImg}
                  alt="Become a MEDX Member - Benefits & Global Community"
                  className="w-full h-auto object-cover img-scholarly border-[1px] border-border relative z-10"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Campus Ambassador Feature */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-[1px] border-border pointer-events-none" aria-hidden="true" />
                <img
                  src={campusAmbImg}
                  alt="Join MEDX as Campus Ambassador - Be the Voice. Be the Change."
                  className="w-full h-auto object-cover img-scholarly border-[1px] border-border relative z-10"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
                Campus Track
              </p>
              <h2 className="text-3xl font-semibold text-primary mb-6">
                Become a Campus Ambassador
              </h2>
              <p className="font-serif text-secondary leading-relaxed mb-6">
                Your campus. Your impact. Your legacy. As a MEDX Campus Ambassador,
                you represent the voice of a global research community in your own
                institution.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Expand our global network to your institution",
                  "Lead impactful research & education initiatives",
                  "Develop leadership and communication skills",
                  "Make a real difference in your academic community",
                  "Global exposure and MEDX recognition",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm font-serif text-muted-foreground"
                  >
                    <ArrowRight
                      size={14}
                      className="text-accent flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://forms.gle/yJzGnk4DwmWysygv9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors group"
              >
                Apply as Ambassador{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Motto */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Your Journey. Our Support. A Better Future."
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mt-6">
            MEDX R&amp;Ed - Together We Research. We Educate. We Create Impact.
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}
