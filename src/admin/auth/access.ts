import type { AdminSection } from "@/admin/admin-types";

export type AdminRole = "admin" | "super_admin" | "department_admin" | "editor";

export function isSuperAdmin(role: string | null | undefined): boolean {
  return role === "admin" || role === "super_admin";
}

export function isDepartmentAdmin(role: string | null | undefined): boolean {
  return role === "department_admin";
}

export function hasAdminAccess(role: string | null | undefined): boolean {
  return isSuperAdmin(role) || isDepartmentAdmin(role) || role === "editor";
}

const DEPARTMENT_ADMIN_SECTIONS: AdminSection[] = [
  "overview",
  "departments",
  "media",
  "preferences",
];

const EDITOR_SECTIONS: AdminSection[] = [
  "overview",
  "courses",
  "news",
  "events",
  "media",
  "achievements",
  "news-highlights",
  "webinars",
  "banners",
  "partners",
  "preferences",
];

export function canAccessSection(
  role: string | null | undefined,
  section: AdminSection,
): boolean {
  if (isSuperAdmin(role)) return true;
  if (isDepartmentAdmin(role)) return DEPARTMENT_ADMIN_SECTIONS.includes(section);
  if (role === "editor") return EDITOR_SECTIONS.includes(section);
  return false;
}
