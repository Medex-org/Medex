import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { MapPin, User } from "lucide-react";

export interface RepEntry {
  name: string;
  role: "City Representative" | "Campus Ambassador";
  country: string;
  state: string;
  city: string;
  campus: string;
}

type Tree = Record<string, Record<string, Record<string, Record<string, RepEntry[]>>>>;

function buildTree(entries: RepEntry[]): Tree {
  const tree: Tree = {};
  for (const e of entries) {
    tree[e.country] ??= {};
    tree[e.country][e.state] ??= {};
    tree[e.country][e.state][e.city] ??= {};
    tree[e.country][e.state][e.city][e.campus] ??= [];
    tree[e.country][e.state][e.city][e.campus].push(e);
  }
  return tree;
}

/** Interactive dashboard grouped Country -> State/Province -> City -> Campus. */
export function RegionalDashboard({ entries }: { entries: RepEntry[] }) {
  const tree = buildTree(entries);
  const countries = Object.keys(tree).sort();

  return (
    <Accordion type="multiple" className="w-full" defaultValue={countries.slice(0, 1)}>
      {countries.map((country) => {
        const states = Object.keys(tree[country]).sort();
        const countryCount = states.reduce(
          (sum, s) =>
            sum +
            Object.values(tree[country][s]).reduce(
              (a2, cityMap) => a2 + Object.values(cityMap).reduce((a3, arr) => a3 + arr.length, 0),
              0,
            ),
          0,
        );
        return (
          <AccordionItem key={country} value={country} className="border-border">
            <AccordionTrigger className="text-base font-semibold hover:no-underline py-5">
              <span className="flex items-center gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {country}
                <span className="font-mono text-xs text-muted-foreground">({countryCount})</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-2 sm:pl-6 space-y-5 border-l-[1px] border-border ml-0 sm:ml-2">
                {states.map((state) => (
                  <div key={state}>
                    <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-3">
                      {state}
                    </p>
                    <div className="space-y-4 pl-2 sm:pl-4">
                      {Object.keys(tree[country][state])
                        .sort()
                        .map((city) => (
                          <div key={city}>
                            <p className="text-sm font-semibold mb-2">{city}</p>
                            <div className="space-y-3 pl-2 sm:pl-4">
                              {Object.keys(tree[country][state][city])
                                .sort()
                                .map((campus) => (
                                  <div key={campus} className="border-l-2 border-accent/20 pl-2 sm:pl-4">
                                    <p className="text-xs text-muted-foreground font-mono mb-2">{campus}</p>
                                    <ul className="space-y-1.5">
                                      {tree[country][state][city][campus].map((entry, i) => (
                                        <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                                          <User size={12} className="text-accent flex-shrink-0" aria-hidden="true" />
                                          <span className="font-medium">{entry.name}</span>
                                          <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                                            {entry.role}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
