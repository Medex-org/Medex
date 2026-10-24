import type { ContentStatus } from "../admin-types";

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex items-center border-[1px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
        status === "published" ? "badge-open" : "badge-closed"
      }`}
    >
      {status}
    </span>
  );
}
