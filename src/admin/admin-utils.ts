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

export function formatSupabaseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    const message = typeof record.message === "string" ? record.message : "";
    const fallback = typeof record.error === "string" ? record.error : "";
    const details = typeof record.details === "string" ? record.details : "";
    const hint = typeof record.hint === "string" ? record.hint : "";
    const code = typeof record.code === "string" ? record.code : "";
    const status = typeof record.statusCode === "number" || typeof record.statusCode === "string"
      ? String(record.statusCode)
      : "";
    const parts = [
      message || fallback,
      details,
      hint,
      code ? `(${code})` : "",
      status ? `HTTP ${status}` : "",
    ].filter(Boolean);
    if (parts.length) {
      const combined = parts.join(" — ");
      if (code === "PGRST204" && /column/i.test(message)) {
        return `${combined} — the deployed admin build may be out of date; hard-refresh the page.`;
      }
      return combined;
    }
  }

  return "Unknown error.";
}
