import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Globe2, MapPin, X } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { PresenceMap } from "@/components/shared/presence-map";
import { computePresenceByCountry, computePresenceStats } from "@/data/presence";
import type { CountryPresence } from "@/data/presence";
import type { RepEntry } from "@/components/shared/regional-dashboard";
import { LINKS } from "@/config/links";

interface CountryPanelProps {
  country: string;
  presence: CountryPresence | null;
  onClose: () => void;
  reduceMotion: boolean;
}

function CountryPanel({ country, presence, onClose, reduceMotion }: CountryPanelProps) {
  const total = presence ? presence.cityReps + presence.ambassadors : 0;

  return (
    <div className="rounded-xl border-[1px] border-border bg-card p-6 shadow-[var(--card-shadow)]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-1">
            Country
          </p>
          <h3 className="text-2xl font-semibold text-primary">{country}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${country} details`}
          className="p-3 -m-1 rounded-lg border-[1px] border-border text-secondary hover:text-accent hover:border-accent/40 transition-colors flex-shrink-0"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>

      {presence ? (
        <>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border-[1px] border-border bg-border mb-6">
            {[
              { num: presence.cityReps, label: "City Reps" },
              { num: presence.ambassadors, label: "Ambassadors" },
              { num: presence.cities.length, label: "Cities" },
            ].map((s) => (
              <div key={s.label} className="bg-background py-4 text-center">
                <div className="font-mono text-2xl sm:text-3xl text-accent font-semibold tracking-tight">
                  {s.num}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-secondary mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">
            Locations
          </p>
          {presence.cities.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              {presence.cities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1px] border-border bg-background px-3 py-1 text-xs text-secondary"
                >
                  <MapPin size={11} className="text-accent flex-shrink-0" aria-hidden="true" />
                  {city}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Country-wide representation.
            </p>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {total} MEDX leader{total === 1 ? "" : "s"} building local research
            communities across {country}.
          </p>

          <a
            href={LINKS.cityRepForm}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-accent text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-accent/90 transition-colors rounded-lg"
          >
            Become a City Representative <ArrowRight size={13} aria-hidden="true" />
          </a>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="size-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <MapPin size={18} className="text-accent" aria-hidden="true" />
          </div>
          <h4 className="text-base font-semibold text-primary mb-2">
            No representatives in {country} yet
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Be the first to bring MEDX to students, researchers, and future
            healthcare leaders in {country}.
          </p>
          <a
            href={LINKS.cityRepForm}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 border-[1px] border-accent text-accent font-semibold uppercase tracking-widest text-xs hover:bg-accent/5 transition-colors rounded-lg"
          >
            Become the First <ArrowRight size={13} aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}

interface PromptPanelProps {
  reduceMotion: boolean;
}

function PromptPanel({ reduceMotion }: PromptPanelProps) {
  return (
    <div className="rounded-xl border-[1px] border-border bg-card p-6 text-center flex flex-col items-center justify-center min-h-72 shadow-[var(--card-shadow)]">
      <div className="size-10 rounded-xl bg-muted flex items-center justify-center mb-4">
        <Globe2 size={18} className="text-accent" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">
        Explore our global footprint
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        Select a country on the map to see its representatives, cities, and
        open opportunities.
      </p>
    </div>
  );
}

/**
 * "MEDX Around the World" — an interactive global presence map driven by the
 * same `REGIONAL_LEADERSHIP` data as the Regional Dashboard below.
 */
export function GlobalPresenceMap({ entries }: { entries: RepEntry[] }) {
  const reduceMotion = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const byCountry = useMemo(() => computePresenceByCountry(entries), [entries]);
  const stats = useMemo(() => computePresenceStats(entries), [entries]);

  const selectedPresence = selected ? byCountry.get(selected) ?? null : null;

  useEffect(() => {
    if (!selected) return;
    if (typeof window === "undefined") return;
    const small = window.matchMedia("(max-width: 1023px)").matches;
    if (small && panelRef.current) {
      panelRef.current.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
    }
  }, [selected, reduceMotion]);

  return (
    <section className="py-24 px-4 sm:px-6 border-b-[1px] border-border">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-12 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-4">
            Global Network
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4">
            MEDX Around the World
          </h2>
          <p className="font-sans text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
            Connecting students, researchers, and future healthcare leaders
            across borders.
          </p>
        </FadeIn>

        {/* Summary statistics */}
        <FadeIn className="mb-10">
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border-[1px] border-border bg-border max-w-2xl mx-auto">
            {[
              { num: stats.countries, label: "Countries" },
              { num: stats.cities, label: "Cities" },
              { num: stats.representatives, label: "Representatives" },
            ].map((s) => (
              <div key={s.label} className="bg-card py-5 text-center">
                <div className="font-mono text-2xl sm:text-3xl text-accent font-semibold tracking-tight">
                  {s.num}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-secondary mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Map + side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <FadeIn className="min-w-0">
            <div className="overflow-hidden rounded-xl border-[1px] border-border bg-card">
              <PresenceMap
                countries={byCountry}
                selected={selected}
                onSelect={(country) =>
                  setSelected((prev) => (prev === country ? null : country))
                }
              />
              <div className="flex flex-wrap items-center justify-center gap-5 border-t-[1px] border-border px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-secondary">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-accent" aria-hidden="true" />
                  MEDX presence
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full border-[1px] border-border bg-muted/50"
                    aria-hidden="true"
                  />
                  No representatives yet
                </span>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest text-secondary">
              Click or tap a country to explore
            </p>
          </FadeIn>

          <div ref={panelRef} className="lg:sticky lg:top-24 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected ?? "none"}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {selected ? (
                  <CountryPanel
                    country={selected}
                    presence={selectedPresence}
                    onClose={() => setSelected(null)}
                    reduceMotion={reduceMotion}
                  />
                ) : (
                  <PromptPanel reduceMotion={reduceMotion} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
