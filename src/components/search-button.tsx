import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

const SHORTCUT_LABEL = IS_MAC ? "⌘K" : "Ctrl K";

interface SearchButtonProps {
  onClick: () => void;
  /** Icon-only variant for the mobile cluster. */
  compact?: boolean;
  className?: string;
}

export function SearchButton({ onClick, compact, className }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search MEDX"
      title={`Search MEDX (${SHORTCUT_LABEL})`}
      className={cn(
        "inline-flex items-center gap-2 text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        compact
          ? "p-2.5 -mr-0.5 hover:bg-muted"
          : "h-11 px-3 border-[1px] border-border text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <Search size={compact ? 20 : 15} aria-hidden="true" />
      {!compact && (
        <>
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-widest">
            Search
          </span>
          <kbd className="hidden md:inline-flex items-center rounded-[4px] border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
            {SHORTCUT_LABEL}
          </kbd>
        </>
      )}
    </button>
  );
}
