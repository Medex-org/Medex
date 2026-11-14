import type { HierarchyPerson } from "@/components/shared/hierarchy-card";
import type { SiteGlobalOfficer } from "@/data/site-content";
import { GOVERNANCE } from "@/data/governance";
import { contentKey, rosterKey } from "@/data/leadership";

export type DepartmentLevelKey =
  | "chief"
  | "director"
  | "head"
  | "supervisor"
  | "mentor"
  | "peer_reviewer";

export interface DepartmentLevelDefinition {
  key: DepartmentLevelKey;
  title: string;
  label: string;
  band: number;
  index: number;
}

export const DEPARTMENT_LEVELS: DepartmentLevelDefinition[] = [
  { key: "chief", title: "Chief", label: "Chief", band: 0, index: 0 },
  { key: "director", title: "Director", label: "Director", band: 100, index: 1 },
  { key: "head", title: "Head", label: "Head", band: 200, index: 2 },
  { key: "supervisor", title: "Supervisors", label: "Supervisor", band: 300, index: 3 },
  { key: "mentor", title: "Mentors", label: "Mentor", band: 400, index: 4 },
  { key: "peer_reviewer", title: "Peer Reviewers", label: "Peer Reviewer", band: 500, index: 5 },
];

const DEPARTMENT_LEVEL_BY_KEY = new Map(DEPARTMENT_LEVELS.map((level) => [level.key, level]));

export interface DepartmentRosterPerson extends HierarchyPerson {
  levelKey: DepartmentLevelKey;
  sortOrder: number;
  personKey: string;
  supervisorKey?: string;
}

const governancePeople = new Map(
  GOVERNANCE.flatMap((level) => level.people).map((person) => [contentKey(person.name), person]),
);

function person(
  name: string,
  role: string,
  levelKey: DepartmentLevelKey,
  personIndex = 0,
  options: { supervisorKey?: string } = {},
): DepartmentRosterPerson {
  const level = DEPARTMENT_LEVEL_BY_KEY.get(levelKey);
  const match = governancePeople.get(contentKey(name));
  return {
    name,
    role,
    image: match?.image || null,
    intro: match?.intro,
    linkedinUrl: match?.linkedinUrl,
    vacant: match?.vacant || name.trim().toLowerCase() === "open position",
    levelKey,
    sortOrder: (level?.band || 0) + personIndex,
    personKey: rosterKey(name, role),
    supervisorKey: options.supervisorKey,
  };
}

function vacant(role: string, levelKey: DepartmentLevelKey, personIndex = 0): DepartmentRosterPerson {
  return person("Open Position", role, levelKey, personIndex);
}

export const DEPARTMENT_ROSTERS: Record<string, DepartmentRosterPerson[]> = {
  research: [
    person("Tarooba Khan", "Chief Research Officer (CRO)", "chief"),
    person("Amna Ahmed", "Director of Research", "director"),
    vacant("Head of Research", "head"),
    vacant("Research Supervisor", "supervisor"),
    person("Dr. Sasha Zaki", "Research Mentor · Senior Advisor · LTE Lead", "mentor", 0, {
      supervisorKey: rosterKey("Open Position", "Research Supervisor"),
    }),
    person("Bisma Bashir", "Research Mentor · LTE Lead", "mentor", 1, {
      supervisorKey: rosterKey("Open Position", "Research Supervisor"),
    }),
    person("Zohaib Hassan", "Research Mentor", "mentor", 2, {
      supervisorKey: rosterKey("Open Position", "Research Supervisor"),
    }),
    person("Abdul Moiz", "Programs Officer · SRMA Mentor", "mentor", 3, {
      supervisorKey: rosterKey("Open Position", "Research Supervisor"),
    }),
    vacant("Peer Reviewer", "peer_reviewer"),
  ],
  education: [
    person("Imad Khan", "Chief Officer MEDX Education (CO.ME)", "chief"),
    person("Rakshitha Lokesh", "Director Education", "director"),
    person("Fahima Hossain Muna", "Head Education", "head"),
    vacant("Education Supervisor", "supervisor"),
    vacant("Education Mentor", "mentor"),
    vacant("Education Peer Reviewer", "peer_reviewer"),
  ],
  "medical-exchange": [
    vacant("Chief Officer Medical Exchange (CO.MX)", "chief"),
    vacant("Director Medical Exchange", "director"),
    vacant("Head Medical Exchange", "head"),
    vacant("Exchange Supervisor", "supervisor"),
    vacant("Exchange Mentor", "mentor"),
    vacant("Exchange Peer Reviewer", "peer_reviewer"),
  ],
  technology: [
    person("Aruzhan Maratova", "Chief Tech Officer (CTO)", "chief"),
    person("Shanmuka Gottimukkala", "Director Web & Tech", "director"),
    person("Monisha Pathi", "Head Web & Tech", "head"),
    vacant("Technology Supervisor", "supervisor"),
    vacant("Technology Mentor", "mentor"),
    vacant("Technology Peer Reviewer", "peer_reviewer"),
  ],
  partnerships: [
    person("Shaikh Kamil", "Chief External Affairs and Partnerships Officer (CEPO)", "chief"),
    person("Syeda Momina Bokhari", "Director External Affairs and Partnerships", "director"),
    vacant("Head External Affairs and Partnerships", "head"),
    vacant("Partnerships Supervisor", "supervisor"),
    vacant("Partnerships Mentor", "mentor"),
    vacant("Partnerships Peer Reviewer", "peer_reviewer"),
  ],
  "medx-minds": [
    vacant("Chief Officer MEDX Minds (Co.MM)", "chief"),
    vacant("Director MEDX Minds", "director"),
    person("Arooba Saqib", "Head MEDX Minds", "head"),
    vacant("MEDX Minds Supervisor", "supervisor"),
    vacant("MEDX Minds Mentor", "mentor"),
    vacant("MEDX Minds Peer Reviewer", "peer_reviewer"),
  ],
};

export function departmentLevelForSortOrder(order: number | null | undefined): DepartmentLevelDefinition {
  const value = Number(order) || 0;
  const index = Math.max(0, Math.min(DEPARTMENT_LEVELS.length - 1, Math.floor(value / 100)));
  return DEPARTMENT_LEVELS[index];
}

export function departmentLevelForKey(key: string | null | undefined): DepartmentLevelDefinition | undefined {
  return key ? DEPARTMENT_LEVEL_BY_KEY.get(key as DepartmentLevelKey) : undefined;
}

export function departmentLevelIndexForItem(item: {
  levelKey?: string | null;
  sortOrder: number;
}): number {
  return departmentLevelForKey(item.levelKey)?.index ?? departmentLevelForSortOrder(item.sortOrder).index;
}

export function departmentRosterKey(
  departmentSlug: string | null | undefined,
  name: string | null | undefined,
  role: string | null | undefined,
): string {
  return `${departmentSlug || ""}|${rosterKey(name, role)}`;
}

function toHierarchyPerson(
  officer: SiteGlobalOfficer,
  fallback?: HierarchyPerson,
): HierarchyPerson {
  const vacant = Boolean(officer.vacant) || officer.name.trim().toLowerCase() === "open position";
  return {
    name: officer.name,
    role: officer.role,
    intro: vacant ? undefined : officer.intro || fallback?.intro,
    image: vacant ? null : officer.image || fallback?.image || null,
    linkedinUrl: officer.linkedinUrl || fallback?.linkedinUrl,
    vacant: vacant || undefined,
  };
}

export interface DepartmentTeamLevel {
  key: DepartmentLevelKey;
  title: string;
  label: string;
  index: number;
  people: HierarchyPerson[];
}

export function buildDepartmentLevels(
  departmentSlug: string,
  officers: SiteGlobalOfficer[],
  synced: boolean,
): DepartmentTeamLevel[] {
  const fallback = DEPARTMENT_ROSTERS[departmentSlug] || [];
  const departmentRows = officers
    .filter(
      (officer) =>
        officer.scope === "department" &&
        officer.departmentSlug === departmentSlug &&
        officer.isActive,
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return DEPARTMENT_LEVELS.map((level) => {
    const levelRows = departmentRows.filter(
      (officer) => (officer.levelKey || departmentLevelForSortOrder(officer.sortOrder).key) === level.key,
    );
    const fallbackPeople = fallback.filter((person) => person.levelKey === level.key);

    if (synced) {
      return {
        ...level,
        people: levelRows.map((officer) => toHierarchyPerson(officer)),
      };
    }

    const byKey = new Map(
      levelRows.map((officer) => [rosterKey(officer.name, officer.role), officer]),
    );
    const merged = fallbackPeople.map((fallbackPerson) => {
      const key = rosterKey(fallbackPerson.name, fallbackPerson.role);
      const match = byKey.get(key);
      if (!match) return fallbackPerson;
      byKey.delete(key);
      return toHierarchyPerson(match, fallbackPerson);
    });
    const extras = Array.from(byKey.values()).map((officer) => toHierarchyPerson(officer));

    return { ...level, people: [...merged, ...extras] };
  });
}
