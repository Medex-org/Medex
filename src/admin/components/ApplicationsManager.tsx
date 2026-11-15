import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Inbox, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { ApplicationStatus, JobApplication } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import { AdminEmptyState } from "./AdminEmptyState";
import { AdminPageHeader } from "./AdminPageHeader";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

type Filter = "all" | ApplicationStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "archived", label: "Archived" },
];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  archived: "Archived",
};

const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  new: "border-accent/30 bg-accent/10 text-accent",
  reviewed: "border-border bg-muted text-secondary",
  archived: "border-border bg-muted/60 text-muted-foreground",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "MMM d, yyyy · h:mm a");
}

export function ApplicationsManager() {
  const { applications, updateApplicationStatus, deleteApplication } = useAdminStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);

  const counts = useMemo(
    () => ({
      all: applications.length,
      new: applications.filter((application) => application.status === "new").length,
      reviewed: applications.filter((application) => application.status === "reviewed").length,
      archived: applications.filter((application) => application.status === "archived").length,
    }),
    [applications],
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? applications
        : applications.filter((application) => application.status === filter),
    [applications, filter],
  );

  async function changeStatus(application: JobApplication, status: ApplicationStatus) {
    try {
      await updateApplicationStatus(application.id, status);
      toast({ title: `Application marked ${STATUS_LABELS[status].toLowerCase()}` });
    } catch (error) {
      toast({
        title: "Could not update the application",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteApplication(deleteTarget.id);
      toast({ title: "Application deleted" });
    } catch (error) {
      toast({
        title: "Could not delete the application",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Applications"
        title="Application Inbox"
        description="Every application submitted from the website lands here. Update its status, reply by email, or archive it when it has been handled."
        action={
          <div className="border-[1px] border-border bg-card px-4 py-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-secondary">New</p>
            <p className="text-2xl font-semibold text-accent">{counts.new}</p>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Filter applications">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`inline-flex items-center gap-2 border-[1px] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              filter === item.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-background text-secondary hover:border-accent/40 hover:text-accent"
            }`}
          >
            {item.label}
            <span className="text-muted-foreground">{counts[item.id]}</span>
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((application) => (
            <article key={application.id} className="border-[1px] border-border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-base text-foreground">{application.name}</h2>
                    <span
                      className={`border-[1px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_CLASSES[application.status]}`}
                    >
                      {STATUS_LABELS[application.status]}
                    </span>
                    {application.department ? (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                        {application.department}
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-xs uppercase tracking-widest text-accent mt-1">
                    {application.position}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <a href={`mailto:${application.email}`} className="hover:text-accent transition-colors">
                      {application.email}
                    </a>
                    <span>{formatDate(application.created_at)}</span>
                    {application.portfolio_url ? (
                      <a
                        href={application.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 hover:text-accent transition-colors"
                      >
                        Portfolio / CV
                      </a>
                    ) : null}
                  </div>
                  {application.message ? (
                    <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {application.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:w-40 lg:flex-col lg:items-stretch">
                  <Select
                    value={application.status}
                    onValueChange={(value) => changeStatus(application, value as ApplicationStatus)}
                  >
                    <SelectTrigger className="h-8 text-xs" aria-label={`Status for ${application.name}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`mailto:${application.email}?subject=${encodeURIComponent(
                        `Re: your MEDX application — ${application.position}`,
                      )}`}
                    >
                      <Mail aria-hidden="true" /> Reply
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(application)}
                  >
                    <Trash2 aria-hidden="true" /> Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          icon={<Inbox size={30} strokeWidth={1.5} />}
          title={filter === "all" ? "No applications yet" : `No ${filter} applications`}
          description="Applications submitted through the website will appear here automatically."
        />
      )}

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget ? `${deleteTarget.name} — ${deleteTarget.position}` : ""}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
