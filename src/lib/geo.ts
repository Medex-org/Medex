const COORDINATE_PATTERN = /(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function extractCoordinates(text: string | null | undefined): Coordinates | null {
  if (!text) return null;
  const match = text.match(COORDINATE_PATTERN);
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude, longitude };
}

export function formatCoordinates(latitude: number, longitude: number): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export function stripCoordinates(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(COORDINATE_PATTERN, "")
    .replace(/\s*·\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function withCoordinates(
  text: string | null | undefined,
  latitude: number,
  longitude: number,
): string {
  const base = stripCoordinates(text);
  const coordinates = formatCoordinates(latitude, longitude);
  return base ? `${base} · ${coordinates}` : coordinates;
}

export function mapUrlForLocation(text: string | null | undefined): string | null {
  const coordinates = extractCoordinates(text);
  if (!coordinates) return null;
  return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
}
