/**
 * Verified MEDX impact numbers. Single source of truth shared by the
 * homepage hero stats row and the "MEDX at a Glance" band so the same
 * figures are never duplicated.
 */
export const IMPACT_STATS = [
  { value: 10, suffix: "+", label: "Countries", short: "Countries" },
  { value: 20, suffix: "+", label: "Cities", short: "Cities" },
  { value: 700, suffix: "+", label: "Students Reached", short: "Students" },
  { value: 5, suffix: "", label: "Active Programs", short: "Programs" },
] as const;
