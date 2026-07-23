import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { MapPin, Users, ArrowRight } from "lucide-react";

const reps = [
  {
    name: "Abdul Waseh Khan",
    location: "Abbottabad, Pakistan",
    institute: "MBBS 3rd Year, AIMC Abbottabad",
    quote: "Connecting institutes through healthcare activities and meaningful communication.",
    country: "PK",
  },
  {
    name: "Rishmi Ayodhya Sri Wijebandara",
    location: "Colombo, Sri Lanka",
    institute: "Final Year BSc Genetics, Edgehill University UK",
    quote: "Building research networks that inspire the next generation of healthcare professionals.",
    country: "LK",
  },
  {
    name: "Mahrukh Randhawa",
    location: "Faisalabad, Pakistan",
    institute: "MBBS, Aziz Fatima Medical College",
    quote: "Bridging students with opportunities for research and professional growth.",
    country: "PK",
  },
  {
    name: "Stefanny Yelitzha Lopez Prada",
    location: "Bucaramanga, Colombia",
    institute: "Medical Student, UNAB",
    quote: "Helping students gain exposure to evidence-based medicine and scientific publishing.",
    country: "CO",
  },
  {
    name: "Ghulam Dastagir",
    location: "D.I. Khan, Pakistan",
    institute: "MBBS 2nd Year, BMC Quetta",
    quote: "Introducing MEDX to students and recruiting local teams for educational betterment.",
    country: "PK",
  },
  {
    name: "Laksh Anand Lasi",
    location: "Karachi, Pakistan",
    institute: "MBBS 1st Year, Bolan Medical College",
    quote: "Bridging student communities across premier medical institutes in Karachi.",
    country: "PK",
  },
  {
    name: "Muhammad Abubakar",
    location: "Sialkot, Pakistan",
    institute: "MBBS 4th Year, KMSMC Sialkot",
    quote: "Building a research-oriented medical student community through evidence-based learning.",
    country: "PK",
  },
  {
    name: "Ibrahim",
    location: "Canada",
    institute: "Medical Researcher",
    quote: "Advancing medical education across continents through research and collaboration.",
    country: "CA",
  },
  {
    name: "Sangeen Khan",
    location: "Global (Pakistan-based)",
    institute: "Founder & CEO · MEDX R&Ed",
    quote: "Wherever there is a student with curiosity, MEDX should be there.",
    country: "PK",
  },
];

const ambassadors = [
  { name: "Farheen Kausar Khattak", location: "KMC Peshawar, Pakistan" },
  { name: "Afza Ilyas Kamboh", location: "BMC Quetta, Pakistan" },
  { name: "Aiss Talib", location: "CMH Multan, Pakistan" },
  { name: "Tooba Maqsood", location: "Rawalpindi Medical University, Pakistan" },
  { name: "Rida Shaikh", location: "Aga Khan University, Pakistan" },
  { name: "Fareeha Awan", location: "Fatima Jinnah Medical University, Pakistan" },
  { name: "Zeenat Bibi", location: "University of Health Sciences, Pakistan" },
];

/** ISO 3166-1 alpha-2 country code labels - no emoji, purely typographic */
const countryLabel: Record<string, string> = {
  PK: "PAK",
  LK: "LKA",
  CO: "COL",
  CA: "CAN",
  US: "USA",
};

export default function CityReps() {
  return (
    <Layout>
      <PageMeta
        title="City Representatives"
        description="Meet the global network of MEDX City Representatives and Campus Ambassadors - student leaders building local research communities across 8+ countries."
      />

      {/* Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Global Network
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              City Representatives
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-serif text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              A global network of student leaders who promote MEDX initiatives,
              recruit campus ambassadors, and build local research communities
              across 8+ countries.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground border-b-[1px] border-border">
        <StaggerContainer className="max-w-7xl mx-auto grid grid-cols-3 divide-x divide-primary-foreground/10">
          {[
            { num: "8+", label: "Countries" },
            { num: "15+", label: "City Representatives" },
            { num: "700+", label: "Students Reached" },
          ].map((s, i) => (
            <StaggerItem key={i} className="py-8 text-center">
              <div className="font-mono text-3xl text-accent mb-1 font-semibold tracking-tight">
                {s.num}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50">
                {s.label}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Representatives Grid */}
      <section className="py-24 px-4 sm:px-6 border-b-[1px] border-border">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              City Representatives
            </p>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Our Global Team
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reps.map((rep, i) => (
              <StaggerItem
                key={i}
                className="p-8 border-[1px] border-border bg-card hover:border-accent/25 transition-all group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} className="flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    <span className="font-mono text-xs uppercase tracking-widest text-secondary">
                      {rep.location}
                    </span>
                  </div>
                  {/* Country code label - styled monospacedly, no emoji */}
                  {rep.country && countryLabel[rep.country] && (
                    <span
                      className="font-mono text-[10px] font-semibold tracking-widest text-secondary/60 bg-muted px-1.5 py-0.5 border-[1px] border-border"
                      aria-label={rep.country}
                    >
                      {countryLabel[rep.country]}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">
                  {rep.name}
                </h3>
                <p className="text-sm text-secondary mb-6">{rep.institute}</p>
                <div className="mt-auto pt-5 border-t-[1px] border-border">
                  <p className="font-serif italic text-muted-foreground text-sm leading-relaxed">
                    <span className="not-italic" aria-hidden="true">"</span>
                    {rep.quote}
                    <span className="not-italic" aria-hidden="true">"</span>
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Campus Ambassadors */}
      <section className="py-24 px-4 sm:px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
              Institutional Presence
            </p>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Campus Ambassadors
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {ambassadors.map((amb, i) => (
              <StaggerItem
                key={i}
                className="p-6 border-[1px] border-border bg-background hover:bg-card transition-colors"
              >
                <Users
                  size={18}
                  className="text-accent mb-3"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-sm mb-1">{amb.name}</h3>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest leading-tight">
                  {amb.location}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA */}
          <FadeIn className="text-center">
            <div className="max-w-xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">
                Ready to lead in your city?
              </h3>
              <p className="font-serif text-muted-foreground mb-8">
                Whether you want to become a City Representative or a Campus
                Ambassador, MEDX is looking for passionate student leaders
                around the world.
              </p>
              <a
                href="https://forms.gle/yJzGnk4DwmWysygv9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-sm hover:bg-primary/90 transition-colors group"
              >
                Apply to be a Representative
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Wherever there is a student with curiosity, MEDX should be there."
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mt-6">
            MEDX R&amp;Ed · One Team · One Vision · One Impact
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}
