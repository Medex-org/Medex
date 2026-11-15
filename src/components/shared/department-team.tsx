import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import { HierarchyCard } from "@/components/shared/hierarchy-card";
import { buildDepartmentLevels } from "@/data/department-roster";
import { DEPARTMENTS } from "@/data/departments";
import { useSiteContent } from "@/hooks/use-site-content";

export function DepartmentTeam({
  departmentSlug,
  eyebrow = "Our Team",
  title = "Department Leadership & Team",
  muted = false,
}: {
  departmentSlug: string;
  eyebrow?: string;
  title?: string;
  muted?: boolean;
}) {
  const { globalOfficers, departmentsSynced } = useSiteContent();
  const levels = buildDepartmentLevels(departmentSlug, globalOfficers, departmentsSynced)
    .filter((level) => level.people.length > 0);
  const departmentName =
    DEPARTMENTS.find((department) => department.slug === departmentSlug)?.shortName || departmentSlug;

  if (!levels.length) return null;

  return (
    <section
      id="team"
      className={`py-24 px-4 sm:px-6 scroll-mt-32 ${muted ? "bg-card" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <FadeIn className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">{eyebrow}</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">{title}</h2>
          <div className="section-rule" />
        </FadeIn>

        <div className="space-y-14">
          {levels.map((level) => (
            <div key={level.key}>
              <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
                <h3 className="font-serif text-xl text-primary">{level.title}</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {level.people.length} {level.people.length === 1 ? "person" : "people"}
                </p>
              </div>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {level.people.map((person) => (
                  <StaggerItem key={`${person.name}|${person.role}`}>
                    <HierarchyCard person={person} featured={level.key === "chief"} applicationDepartment={departmentName} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
