import { format, isValid } from "date-fns";

export function createDemoId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatDemoDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return isValid(date) ? format(date, "MMM d, yyyy") : "—";
}

export function formatDemoDateShort(value: string): string {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return isValid(date) ? format(date, "MMM d") : "—";
}

export function isUpcoming(dateValue: string): boolean {
  if (!dateValue) return false;
  const date = new Date(`${dateValue}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today.getTime();
}

export function isHttpUrl(value: string): boolean {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
