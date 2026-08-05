import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Graticule } from "react-simple-maps";
import type { CountryPresence } from "@/data/presence";
import countries110mUrl from "world-atlas/countries-110m.json?url";

interface TooltipState {
  country: string;
  count: number;
  x: number;
  y: number;
}

interface PositionedTooltip {
  country: string;
  count: number;
  left: number;
  top: number;
}

interface PresenceMapProps {
  countries: Map<string, CountryPresence>;
  selected: string | null;
  onSelect: (country: string) => void;
}

const TOOLTIP_W = 200;
const TOOLTIP_H = 44;

/** Clamp the tooltip inside the map so it never overflows horizontally. */
function positionTooltip(t: TooltipState, width: number): PositionedTooltip {
  const half = TOOLTIP_W / 2;
  const left = Math.max(half, Math.min(t.x, Math.max(width - half, half)));
  const top = t.y > TOOLTIP_H + 24 ? t.y - 12 - TOOLTIP_H : t.y + 18;
  return { country: t.country, count: t.count, left, top };
}

/**
 * Interactive world map. Countries with MEDX representatives render in the
 * accent color; all others stay muted but remain clickable so visitors can
 * discover open roles. Geodata ships as a code-split static asset.
 */
export function PresenceMap({ countries, selected, onSelect }: PresenceMapProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const tip = tooltip
    ? positionTooltip(tooltip, containerRef.current?.offsetWidth ?? 0)
    : null;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tooltip) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setTooltip((t) => (t ? { ...t, x, y } : t));
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMove}
      onMouseLeave={() => setTooltip(null)}
    >
      <ComposableMap
        projection="geoEqualEarth"
        width={800}
        height={600}
        style={{ width: "100%", height: "auto" }}
      >
        <Graticule stroke="hsl(var(--border) / 0.45)" strokeWidth={0.5} />
        <Geographies geography={countries110mUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties?.name as string | undefined;
              const presence = name ? countries.get(name) : undefined;
              const active = Boolean(presence);
              const isSelected = name === selected;
              const total = presence ? presence.cityReps + presence.ambassadors : 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  role="button"
                  aria-label={
                    name
                      ? presence
                        ? `${name}: ${total} MEDX representative${total === 1 ? "" : "s"}`
                        : `${name}: no representatives yet`
                      : undefined
                  }
                  tabIndex={active ? 0 : -1}
                  onMouseEnter={(e) => {
                    if (!name) return;
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    setTooltip({
                      country: name,
                      count: total,
                      x: Math.max(0, Math.min(e.clientX - rect.left, rect.width)),
                      y: Math.max(0, Math.min(e.clientY - rect.top, rect.height)),
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onKeyDown={(e) => {
                    if (!name) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(name);
                    }
                  }}
                  onClick={() => name && onSelect(name)}
                  style={{
                    default: {
                      fill: active
                        ? isSelected
                          ? "hsl(var(--accent))"
                          : "hsl(var(--accent) / 0.16)"
                        : "hsl(var(--muted) / 0.5)",
                      stroke: active
                        ? isSelected
                          ? "hsl(var(--accent-foreground) / 0.9)"
                          : "hsl(var(--accent) / 0.5)"
                        : "hsl(var(--border))",
                      strokeWidth: 0.6,
                      outline: "none",
                      transition: "fill 0.25s ease, stroke 0.25s ease",
                      cursor: "pointer",
                    },
                    hover: {
                      fill: active
                        ? isSelected
                          ? "hsl(var(--accent))"
                          : "hsl(var(--accent) / 0.32)"
                        : "hsl(var(--muted) / 0.85)",
                      stroke: active ? "hsl(var(--accent))" : "hsl(var(--secondary) / 0.6)",
                      strokeWidth: 0.8,
                      outline: "none",
                    },
                    pressed: {
                      fill: "hsl(var(--accent))",
                      stroke: "hsl(var(--accent-foreground) / 0.9)",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <AnimatePresence>
        {tip && (
          <motion.div
            key="country-tooltip"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute z-20 w-max max-w-[200px] rounded-lg bg-primary px-3 py-2 text-primary-foreground shadow-lg"
            style={{
              left: tip.left,
              top: tip.top,
              transform: "translate(-50%, 0)",
            }}
          >
            <div className="text-sm font-semibold">{tip.country}</div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-primary-foreground/70">
              {tip.count > 0
                ? `${tip.count} representative${tip.count === 1 ? "" : "s"}`
                : "No representatives yet"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
