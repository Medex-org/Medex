import { useEffect, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Dialog, DialogPortal } from "@/components/ui/dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { SEARCH_GROUPS, SEARCH_INDEX, type SearchEntry } from "@/data/search";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

function formatDestination(href: string): string {
  if (href === "/") return "Home";
  const path = href.split("#")[0].replace(/^\//, "");
  return path || href;
}

/**
 * Precise, whole-site match + ranking for cmdk.
 *
 * Every word of the query must appear as a substring somewhere in the entry
 * (title, group, description, or keywords), so partial/fuzzy subsequence
 * misses of the default scorer disappear. Higher scores rank earlier - cmdk
 * re-sorts items and groups by this value.
 */
function searchRank(value: string, search: string, keywords?: string[]): number {
  const query = search.trim().toLowerCase();
  if (!query) return 1;

  const terms = query.split(/\s+/).filter(Boolean);
  const title = value.trim().toLowerCase();
  const haystack = `${title} ${(keywords ?? []).join(" ")}`.toLowerCase();

  if (!terms.every((term) => haystack.includes(term))) return 0;

  let score = 0;
  for (const term of terms) {
    if (title === term) score += 100;
    else if (title.startsWith(term)) score += 90;
    else if (title.includes(term)) score += 80;
    else if (keywords?.some((k) => k.toLowerCase().includes(term))) score += 50;
    else score += 30;
  }
  return score;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const reduceMotion = useReducedMotion();

  const scale = reduceMotion ? 1 : 0.98;
  const contentTransition = { duration: 0.18, ease: "easeOut" as const };

  // Global ⌘K / Ctrl+K shortcut - works from anywhere on the site.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // Reset the query every time the palette is reopened.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Empty query shows only the "quick navigation" shortcuts (pages + departments).
  const visible = useMemo(() => {
    if (query.trim() === "") return SEARCH_INDEX.filter((entry) => entry.quick);
    return SEARCH_INDEX;
  }, [query]);

  const handleSelect = (entry: SearchEntry) => {
    onOpenChange(false);
    if (entry.external) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      navigate(entry.href);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPortal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content forceMount asChild aria-label="Search MEDX">
              <motion.div
                className="fixed left-[50%] top-[50%] z-50 flex w-[calc(100%-2rem)] max-w-2xl flex-col max-h-[80vh] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-xl border bg-background shadow-lg"
                initial={{ opacity: 0, scale }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale }}
                transition={contentTransition}
              >
                <CommandPrimitive
                  value={query}
                  onValueChange={setQuery}
                  filter={searchRank}
                  loop
                  className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground [&_[cmdk-group-heading]]:px-3.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-2 [&_[cmdk-group]]:px-2.5 [&_[cmdk-item]]:px-3.5 [&_[cmdk-item]]:py-3.5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
                >
                  <div className="flex items-center gap-3 border-b border-border px-4" cmdk-input-wrapper="">
                    <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <CommandPrimitive.Input
                      autoFocus
                      placeholder="Search pages, mentors, programs, events..."
                      aria-label="Search MEDX"
                      className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  <CommandPrimitive.List className="flex-1 overflow-y-auto overflow-x-hidden py-2">
                    <CommandPrimitive.Empty className="py-10 text-center text-sm text-muted-foreground">
                      No results found for &ldquo;{query}&rdquo;.
                    </CommandPrimitive.Empty>

                    {SEARCH_GROUPS.map((group) => {
                      const entries = visible.filter((entry) => entry.group === group);
                      if (entries.length === 0) return null;
                      return (
                        <CommandPrimitive.Group key={group} heading={group} className="text-foreground">
                          {entries.map((entry) => (
                            <CommandPrimitive.Item
                              key={entry.id}
                              value={entry.title}
                              keywords={[entry.group, entry.description, ...entry.keywords]}
                              onSelect={() => handleSelect(entry)}
                              className="flex cursor-pointer items-center gap-3.5"
                            >
                              <entry.icon
                                size={16}
                                strokeWidth={1.5}
                                className="shrink-0 text-accent"
                                aria-hidden="true"
                              />
                              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="truncate">{entry.title}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {entry.description}
                                </span>
                              </span>
                              <span className="ml-auto hidden shrink-0 pl-2 pr-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
                                {formatDestination(entry.href)}
                              </span>
                            </CommandPrimitive.Item>
                          ))}
                        </CommandPrimitive.Group>
                      );
                    })}
                  </CommandPrimitive.List>

                  <div className="flex items-center justify-between border-t border-border px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="hidden sm:inline">↑↓ Navigate · ↵ Select · Esc Close</span>
                    <span>{IS_MAC ? "⌘K" : "Ctrl K"}</span>
                  </div>
                </CommandPrimitive>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
