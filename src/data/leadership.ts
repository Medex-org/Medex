import type { HierarchyPerson } from "@/components/shared/hierarchy-card";
import type { SiteGlobalOfficer } from "@/data/site-content";
import { GOVERNANCE, type HierarchyLevel } from "@/data/governance";

export const ROSTER_SYNC_MARKER = "__roster_synced__";
export const LEADERSHIP_BANDS = [0, 100, 200, 300] as const;
const LEVEL_LABELS = ["Executive Board", "Directors", "Heads", "Mentorship"] as const;

export interface LeadershipLevel extends HierarchyLevel {
  band: number;
  index: number;
  label: string;
}

export const LEADERSHIP_LEVELS: LeadershipLevel[] = GOVERNANCE.map((level, index) => ({
  ...level,
  band: LEADERSHIP_BANDS[index] ?? index * 100,
  index,
  label: LEVEL_LABELS[index] ?? level.title,
}));

export function levelIndexForSortOrder(order: number | null | undefined): number {
  const value = Number(order) || 0;
  return Math.max(0, Math.min(LEADERSHIP_LEVELS.length - 1, Math.floor(value / 100)));
}

export function bandForLevel(index: number): number {
  return LEADERSHIP_BANDS[index] ?? index * 100;
}

export function contentKey(value: string | null | undefined): string {
  return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function officerKey(name: string | null | undefined, role: string | null | undefined): string {
  return `${contentKey(name)}|${contentKey(role)}`;
}

export function rosterKey(name: string | null | undefined, role: string | null | undefined): string {
  const vacant = (name || "").trim().toLowerCase() === "open position";
  return vacant ? officerKey(name, role) : contentKey(name);
}

export interface StaticOfficerRow {
  name: string;
  role: string;
  intro: string;
  sortOrder: number;
  vacant: boolean;
}

export const STATIC_ROSTER: StaticOfficerRow[] = GOVERNANCE.flatMap((level, levelIndex) =>
  level.people.map((person, personIndex) => ({
    name: person.name,
    role: person.role,
    intro: person.intro || "",
    sortOrder: bandForLevel(levelIndex) + personIndex,
    vacant: Boolean(person.vacant),
  })),
);

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

export function buildLeadershipLevels(
  officers: SiteGlobalOfficer[],
  synced: boolean,
): LeadershipLevel[] {
  return LEADERSHIP_LEVELS.map((level) => {
    const levelOfficers = officers
      .filter((officer) => levelIndexForSortOrder(officer.sortOrder) === level.index)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    if (synced) {
      return {
        ...level,
        people: levelOfficers.map((officer) => toHierarchyPerson(officer)),
      };
    }

    const byKey = new Map(levelOfficers.map((officer) => [rosterKey(officer.name, officer.role), officer]));
    const merged = level.people.map((person) => {
      const key = rosterKey(person.name, person.role);
      const match = byKey.get(key);
      if (!match) return person;
      byKey.delete(key);
      return toHierarchyPerson(match, person);
    });
    const extras = Array.from(byKey.values()).map((officer) => toHierarchyPerson(officer));

    return { ...level, people: [...merged, ...extras] };
  });
}
