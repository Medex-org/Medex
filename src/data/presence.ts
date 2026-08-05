import type { RepEntry } from "@/components/shared/regional-dashboard";

/**
 * Aggregated presence of MEDX leaders for one country, derived purely from
 * `REGIONAL_LEADERSHIP` — no location data is duplicated here.
 */
export interface CountryPresence {
  country: string;
  cityReps: number;
  ambassadors: number;
  /** Unique, cleaned city names (sorted). */
  cities: string[];
  /** Unique regions / states (sorted). */
  regions: string[];
}

export interface PresenceStats {
  countries: number;
  cities: number;
  representatives: number;
  cityReps: number;
  ambassadors: number;
}

/** Values that carry no geographic signal (e.g. "Unspecified Region"). */
const UNCLEAN = new Set(["", "Unspecified", "Unspecified Region", "Unknown"]);

/**
 * Gracefully normalizes a rep entry's city. Returns null when the city is
 * missing or is really a stand-in for the whole country (e.g. a rep with
 * `city: "Canada"`), so such entries read as "country-wide" instead of a
 * phantom city on the map.
 */
function cleanCity(entry: RepEntry): string | null {
  if (!entry.city || UNCLEAN.has(entry.city)) return null;
  if (entry.city.toLowerCase() === entry.country.toLowerCase()) return null;
  return entry.city;
}

export function computePresenceByCountry(entries: RepEntry[]): Map<string, CountryPresence> {
  const map = new Map<string, CountryPresence>();

  for (const entry of entries) {
    let presence = map.get(entry.country);
    if (!presence) {
      presence = {
        country: entry.country,
        cityReps: 0,
        ambassadors: 0,
        cities: [],
        regions: [],
      };
      map.set(entry.country, presence);
    }

    if (entry.role === "City Representative") presence.cityReps += 1;
    else presence.ambassadors += 1;

    const city = cleanCity(entry);
    if (city && !presence.cities.includes(city)) presence.cities.push(city);

    const region = entry.state && !UNCLEAN.has(entry.state) ? entry.state : null;
    if (region && !presence.regions.includes(region)) presence.regions.push(region);
  }

  for (const presence of map.values()) {
    presence.cities.sort((a, b) => a.localeCompare(b));
    presence.regions.sort((a, b) => a.localeCompare(b));
  }

  return map;
}

export function computePresenceStats(entries: RepEntry[]): PresenceStats {
  const byCountry = computePresenceByCountry(entries);
  let cities = 0;
  for (const presence of byCountry.values()) cities += presence.cities.length;

  return {
    countries: byCountry.size,
    cities,
    representatives: entries.length,
    cityReps: entries.filter((e) => e.role === "City Representative").length,
    ambassadors: entries.filter((e) => e.role === "Campus Ambassador").length,
  };
}
