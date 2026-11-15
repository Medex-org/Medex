import { DEPARTMENTS } from "@/data/departments";
import { DEPARTMENT_ROSTERS } from "@/data/department-roster";
import { GOVERNANCE } from "@/data/governance";
import type { SiteGlobalOfficer } from "@/data/site-content";

export interface OpenPosition {
  id: string;
  title: string;
  department: string;
  departmentSlug: string | null;
  scope: "global" | "department";
}

function departmentName(slug: string | null): string {
  if (!slug) return "Global";
  return DEPARTMENTS.find((department) => department.slug === slug)?.shortName || slug;
}

function positionId(scope: "global" | "department", departmentSlug: string | null, title: string): string {
  return `${scope}:${departmentSlug || "global"}:${title.trim().toLowerCase()}`;
}

export function buildOpenPositions(officers: SiteGlobalOfficer[] = []): OpenPosition[] {
  const positions = new Map<string, OpenPosition>();

  const add = (position: OpenPosition) => {
    if (!position.title.trim()) return;
    if (!positions.has(position.id)) positions.set(position.id, position);
  };

  GOVERNANCE.flatMap((level) => level.people)
    .filter((person) => person.vacant)
    .forEach((person) => {
      add({
        id: positionId("global", null, person.role),
        title: person.role,
        department: "Global",
        departmentSlug: null,
        scope: "global",
      });
    });

  Object.entries(DEPARTMENT_ROSTERS).forEach(([slug, people]) => {
    people
      .filter((person) => person.vacant)
      .forEach((person) => {
        add({
          id: positionId("department", slug, person.role),
          title: person.role,
          department: departmentName(slug),
          departmentSlug: slug,
          scope: "department",
        });
      });
  });

  officers
    .filter((officer) => officer.vacant && officer.isActive)
    .forEach((officer) => {
      add({
        id: positionId(officer.scope, officer.departmentSlug, officer.role),
        title: officer.role,
        department: departmentName(officer.departmentSlug),
        departmentSlug: officer.departmentSlug,
        scope: officer.scope,
      });
    });

  return Array.from(positions.values()).sort((a, b) => {
    if (a.scope !== b.scope) return a.scope === "global" ? -1 : 1;
    const department = a.department.localeCompare(b.department);
    if (department !== 0) return department;
    return a.title.localeCompare(b.title);
  });
}
