import { useEffect, useRef, useState } from "react";

export interface SectionNavItem {
  id: string;
  label: string;
}

/**
 * Sticky row of jump links for long, multi-section pages (Research,
 * Leadership). Sits just under the fixed header and highlights whichever
 * section is currently in view, so a long page reads more like a dashboard
 * with a table of contents than an endless scroll.
 */
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the active tab visible within the horizontally-scrolling strip when
  // it changes from page scroll (not just a direct tab click). block:
  // "nearest" is required so this never also scrolls the page vertically.
  useEffect(() => {
    if (!active) return;
    const link = navRef.current?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    link?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [active]);

  // Edge-fade affordance so a horizontally-scrollable tab strip doesn't read
  // as "this is all of them" when more tabs sit off-screen (mostly a mobile
  // concern - desktop/tablet usually fit every tab already).
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const maskStops = [
    canScrollLeft ? "transparent 0%" : "black 0%",
    ...(canScrollLeft ? ["black 24px"] : []),
    ...(canScrollRight ? ["black calc(100% - 24px)"] : []),
    canScrollRight ? "transparent 100%" : "black 100%",
  ];
  const maskImage = `linear-gradient(to right, ${maskStops.join(", ")})`;

  return (
    <nav
      ref={navRef}
      aria-label="Section navigation"
      className="sticky top-16 z-30 w-full bg-background/95 backdrop-blur-sm border-b-[1px] border-border overflow-x-auto"
      style={{ maskImage, WebkitMaskImage: maskImage }}
    >
      <ul className="max-w-7xl mx-auto flex items-center gap-1 px-4 sm:px-6 whitespace-nowrap">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`inline-block px-4 py-3.5 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
                active === item.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
