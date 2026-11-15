export type EventLifecycle = "Upcoming" | "Ongoing" | "Completed";

function parseDateOnly(value?: string | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function endOfDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();
}

export function getEventLifecycle(
  start?: string | null,
  end?: string | null,
): EventLifecycle {
  const startDate = parseDateOnly(start);
  if (!startDate) return "Upcoming";
  const endDate = parseDateOnly(end) ?? startDate;
  const now = Date.now();
  if (now < startOfDay(startDate)) return "Upcoming";
  if (now > endOfDay(endDate)) return "Completed";
  return "Ongoing";
}

export function getEventProgress(
  start?: string | null,
  end?: string | null,
): number | null {
  const startDate = parseDateOnly(start);
  const endDate = parseDateOnly(end);
  if (!startDate || !endDate) return null;
  const startMs = startOfDay(startDate);
  const endMs = endOfDay(endDate);
  if (endMs <= startMs) return null;
  const now = Date.now();
  if (now <= startMs) return 0;
  if (now >= endMs) return 100;
  return Math.round(((now - startMs) / (endMs - startMs)) * 100);
}
