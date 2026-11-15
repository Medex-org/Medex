import { useMemo } from "react";
import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { SEO } from "@/data/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { ApplicationDialog } from "@/components/shared/application-dialog";
import { HierarchyCard } from "@/components/shared/hierarchy-card";
import { buildLeadershipLevels } from "@/data/leadership";
import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav";
import { SectionNav } from "@/components/shared/section-nav";
import { useSiteContent } from "@/hooks/use-site-content";
import { buildOpenPositions, type OpenPosition } from "@/lib/open-positions";

/** Picks a large-screen column count that keeps rows even, capped at 4 for readability, 3 for featured (larger) cards. */
function lgColsForCount(count: number, featured: boolean): string {
  if (featured) return "lg:grid-cols-3";
  if (count === 6) return "lg:grid-cols-3"; // 2 even rows of 3, rather than 4+2
  return "lg:grid-cols-4";
}

const LEVEL_IDS = ["level-1", "level-2", "level-3", "level-4"];
const SECTIONS = [
  { id: "level-1", label: "Executive Board" },
  { id: "level-2", label: "Directors" },
  { id: "level-3", label: "Heads" },
  { id: "level-4", label: "Mentorship" },
  { id: "level-5", label: "Support & Regional" },
];

export default function Team() {
  const { globalOfficers, leadershipSynced } = useSiteContent();
  const governance = buildLeadershipLevels(globalOfficers, leadershipSynced);
  const openPositions = useMemo(() => buildOpenPositions(globalOfficers), [globalOfficers]);
  const groupedPositions = useMemo(() => {
    const groups = new Map<string, OpenPosition[]>();
    openPositions.forEach((position) => {
      const existing = groups.get(position.department) || [];
      existing.push(position);
      groups.set(position.department, existing);
    });
    return Array.from(groups.entries());
  }, [openPositions]);

  return (
    <Layout>
      <PageMeta {...SEO.team} />

      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-16 px-4 sm:px-6 border-b-[1px] border-border bg-card text-center">
        <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none bg-texture-molecular" aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Leadership" }]} />
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-6">
              Organizational Governance
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 text-primary">
              Leadership &amp; Governance
            </h1>
            <div className="section-rule mx-auto mb-6" />
            <p className="font-sans text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              The team structure behind MEDX R&amp;Ed, from the Executive Board down to
              every regional chapter.
            </p>
          </FadeIn>
        </div>
      </section>

      <SectionNav items={SECTIONS} />

      {governance.map((level, i) => (
        <section
          key={level.title}
          id={LEVEL_IDS[i]}
          className={`py-24 px-4 sm:px-6 scroll-mt-32 ${i % 2 === 1 ? "bg-card" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <FadeIn className="mb-12">
              <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
                Level {["I", "II", "III", "IV"][i]}
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">{level.title}</h2>
              <div className="section-rule" />
            </FadeIn>

            <StaggerContainer
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${lgColsForCount(level.people.length, i === 0)}`}
            >
              {level.people.map((person) => (
                <StaggerItem key={`${person.name}|${person.role}`}>
                  <HierarchyCard person={person} featured={i === 0} applicationDepartment={level.title} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ))}

      {/* Level V - Departmental Support Teams & Regional Leaders */}
      <section id="level-5" className="py-24 px-4 sm:px-6 scroll-mt-32 bg-card">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">Level V</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
              Departmental Support Teams &amp; Regional Leaders
            </h2>
            <div className="section-rule" />
          </FadeIn>

          <FadeIn className="mb-12 border-[1px] border-dashed border-accent/30 bg-accent/5 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
                  Open Positions
                </p>
                <h3 className="text-xl font-semibold mb-2">Join the MEDX team</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Every current vacancy is listed here, from global roles to department teams.
                  Applications are reviewed on a rolling basis.
                </p>
              </div>
              <ApplicationDialog
                trigger={
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-widest hover:bg-accent/90 transition-colors flex-shrink-0"
                  >
                    Apply Now <ArrowRight size={12} aria-hidden="true" />
                  </button>
                }
                positions={openPositions}
                title="Apply to MEDX"
                description="Choose any open role across MEDX. Applications are reviewed on a rolling basis."
              />
            </div>

            <div className="mt-8 border-t-[1px] border-border divide-y-[1px] divide-border">
              {groupedPositions.map(([department, positions]) => (
                <div
                  key={department}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 py-4"
                >
                  <p className="font-semibold text-sm sm:w-40 flex-shrink-0">{department}</p>
                  <div className="flex flex-wrap gap-2">
                    {positions.map((position) => (
                      <ApplicationDialog
                        key={position.id}
                        trigger={
                          <button
                            type="button"
                            className="inline-block px-3 py-1 border-[1px] border-border bg-background font-mono text-[10px] uppercase tracking-widest text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                          >
                            {position.title}
                          </button>
                        }
                        defaultPosition={position.title}
                        defaultDepartment={position.department}
                        title={`Apply for ${position.title}`}
                        description="Submit your application directly to the MEDX admin dashboard."
                      />
                    ))}
                  </div>
                </div>
              ))}
              {!openPositions.length && (
                <p className="py-4 font-sans text-sm text-muted-foreground">
                  No specific vacancies are open right now. Volunteer applications are always welcome.
                </p>
              )}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FadeIn className="p-8 border-[1px] border-border bg-background flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold mb-2">Volunteers</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
                Volunteer selection is interest-based - apply and MEDX will reach out about open
                opportunities.
              </p>
              <ApplicationDialog
                trigger={
                  <button
                    type="button"
                    className="mt-auto inline-flex items-center gap-1.5 px-5 py-3 border-[1px] border-primary text-primary text-xs font-semibold uppercase tracking-widest hover:bg-primary/5 transition-colors"
                  >
                    Apply to Volunteer <ArrowRight size={12} aria-hidden="true" />
                  </button>
                }
                defaultPosition="Volunteer"
                defaultDepartment="MEDX"
                title="Apply to volunteer"
                description="Tell MEDX about your interests and availability. The team will reach out about open opportunities."
              />
            </FadeIn>
            <FadeIn delay={0.1} className="p-8 border-[1px] border-border bg-background flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold mb-2">Regional Leadership</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
                City Representatives and Campus Ambassadors, grouped by country, state/province,
                city, and campus.
              </p>
              <Link
                href="/city-reps/"
                className="mt-auto inline-flex items-center gap-1.5 px-5 py-3 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-widest hover:bg-accent/90 transition-colors"
              >
                View Regional Dashboard <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="bg-accent text-accent-foreground py-20 px-4 sm:px-6 text-center">
        <FadeIn>
          <h2 className="font-serif italic text-2xl md:text-4xl font-light max-w-3xl mx-auto">
            "Alone we can do so little; together we can do so much."
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-foreground/50 mt-6">
            One Team · One Vision · One Impact
          </p>
        </FadeIn>
      </section>
    </Layout>
  );
}
