import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { AdminActionRequest, ManagedContentItem } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import { AdminFormDialog } from "./AdminFormDialog";
import { AdminPageHeader } from "./AdminPageHeader";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { AdminEmptyState } from "./AdminEmptyState";
import { DemoMediaPicker } from "./DemoMediaPicker";
import { GOVERNANCE } from "@/data/governance";
import {
  LEADERSHIP_LEVELS,
  bandForLevel,
  contentKey,
  levelIndexForSortOrder,
  rosterKey,
} from "@/data/leadership";

interface OfficerForm {
  title: string;
  secondary: string;
  description: string;
  link: string;
  imagePath: string;
  level: number;
  vacant: boolean;
  sortOrder: number;
}

const emptyForm = (level: number, sortOrder: number): OfficerForm => ({
  title: "",
  secondary: "",
  description: "",
  link: "",
  imagePath: "",
  level,
  vacant: false,
  sortOrder,
});

const staticImages = new Map(
  GOVERNANCE.flatMap((level) => level.people).map((person) => [contentKey(person.name), person.image]),
);

const GLOBAL_LEVEL_KEYS = ["executive", "director", "head", "mentor"] as const;

export function OfficersManager({
  request,
  clearRequest,
}: {
  request?: AdminActionRequest;
  clearRequest: () => void;
}) {
  const {
    managedContent,
    media,
    leadershipSynced,
    createManagedContent,
    updateManagedContent,
    reorderManagedContent,
    deleteManagedContent,
    syncLeadershipRoster,
  } = useAdminStore();
  const { toast } = useToast();
  const items = managedContent.officers.filter((item) => item.scope !== "department");
  const orderedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OfficerForm>(emptyForm(0, 0));
  const [deleteTarget, setDeleteTarget] = useState<ManagedContentItem | null>(null);
  const [syncing, setSyncing] = useState(false);

  const levelItems = (level: number) =>
    orderedItems.filter((item) => levelIndexForSortOrder(item.sortOrder) === level);

  const nextSortOrder = (level: number) => {
    const current = levelItems(level);
    const next = current.length ? Math.max(...current.map((item) => item.sortOrder)) + 1 : bandForLevel(level);
    return Math.min(next, bandForLevel(level) + 99);
  };

  const openCreate = (level = 0) => {
    setEditingId(null);
    setForm(emptyForm(level, nextSortOrder(level)));
    setOpen(true);
  };

  const openEdit = (item: ManagedContentItem) => {
    const level = levelIndexForSortOrder(item.sortOrder);
    setEditingId(item.id);
    setForm({
      title: item.title,
      secondary: item.secondary,
      description: item.description,
      link: item.link,
      imagePath: item.imagePath,
      level,
      vacant: item.title.trim().toLowerCase() === "open position",
      sortOrder: item.sortOrder,
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!request) return;
    if (request.kind === "edit" && request.id) {
      const item = items.find((entry) => entry.id === request.id);
      if (item) openEdit(item);
    } else {
      openCreate();
    }
    clearRequest();
  }, [request?.nonce]);

  const submit = async () => {
    if (!form.secondary.trim()) {
      toast({ title: "Role is required", variant: "destructive" });
      return;
    }
    if (!form.vacant && (!form.title.trim() || form.title.trim().toLowerCase() === "open position")) {
      toast({ title: "Enter the person's name", variant: "destructive" });
      return;
    }

    const currentLevel = levelIndexForSortOrder(form.sortOrder);
    const sortOrder = editingId && form.level === currentLevel
      ? form.sortOrder
      : nextSortOrder(form.level);
    const title = form.vacant ? "Open Position" : form.title.trim();
    const payload = {
      title,
      secondary: form.secondary.trim(),
      description: form.vacant ? "" : form.description.trim(),
      link: form.vacant ? "" : form.link.trim(),
      imagePath: form.vacant ? "" : form.imagePath,
      sortOrder,
      scope: "global" as const,
      departmentSlug: null,
      levelKey: GLOBAL_LEVEL_KEYS[form.level] || "executive",
      personKey: rosterKey(title, form.secondary),
      supervisorKey: null,
      isActive: true,
    };

    try {
      if (editingId) await updateManagedContent("officers", editingId, payload);
      else await createManagedContent("officers", payload);
      setOpen(false);
      toast({
        title: "Officer saved",
        description: "The published leadership page will use this record.",
      });
    } catch (error) {
      toast({
        title: "Could not save officer",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const move = async (item: ManagedContentItem, direction: -1 | 1) => {
    const level = levelIndexForSortOrder(item.sortOrder);
    const current = levelItems(level);
    const index = current.findIndex((entry) => entry.id === item.id);
    const target = current[index + direction];
    if (!target) return;
    const next = [...current];
    next[index] = target;
    next[index + direction] = item;
    try {
      await reorderManagedContent("officers", next.map((entry) => entry.id), bandForLevel(level));
    } catch (error) {
      toast({
        title: "Could not reorder officers",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteManagedContent("officers", deleteTarget.id);
      setDeleteTarget(null);
      toast({ title: "Officer deleted" });
    } catch (error) {
      toast({
        title: "Could not delete officer",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const manualSync = async () => {
    setSyncing(true);
    try {
      const result = await syncLeadershipRoster();
      toast({
        title: result.alreadySynced ? "Roster already synced" : "Leadership roster synced",
        description: result.alreadySynced
          ? "Supabase already has the full roster."
          : `${result.inserted} people added to Supabase.`,
      });
    } catch (error) {
      toast({
        title: "Could not sync the leadership roster",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Leadership"
        title="Global Officers"
        description="Manage every leadership level displayed on the public team page. Changes are saved to Supabase."
        action={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={manualSync} disabled={syncing}>
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing..." : leadershipSynced ? "Roster synced" : "Sync roster"}
            </Button>
            <Button onClick={() => openCreate()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus size={16} /> Add officer
            </Button>
          </div>
        }
      />

      <div className="border-[1px] border-border bg-accent/5 px-4 py-3 mb-6">
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          All four leadership levels are stored in Supabase. Use the level selector when adding
          someone, and reorder people within their level.
        </p>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState
          icon={<UserPlus size={20} />}
          title="No officers yet"
          description="Sync the default roster or add the first officer."
          action={<Button onClick={() => openCreate()}>Add officer</Button>}
        />
      ) : (
        <div className="space-y-8">
          {LEADERSHIP_LEVELS.map((level) => {
            const current = levelItems(level.index);
            return (
              <section key={level.index} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1px] border-border pb-2">
                  <div>
                    <h2 className="font-serif text-lg text-primary">{level.title}</h2>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Level {["I", "II", "III", "IV"][level.index]} · {current.length} {current.length === 1 ? "person" : "people"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openCreate(level.index)}>
                    <Plus size={14} /> Add to {level.label}
                  </Button>
                </div>

                {current.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-3">
                    No people in this level yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {current.map((item, index) => {
                      const selectedMedia = media.find((asset) => asset.id === item.imagePath);
                      const image = selectedMedia?.src || staticImages.get(contentKey(item.title)) || null;
                      const vacant = item.title.trim().toLowerCase() === "open position";
                      return (
                        <article
                          key={item.id}
                          className="border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                        >
                          <div className="flex items-start gap-4">
                            {image ? (
                              <img
                                src={image}
                                alt=""
                                className="h-20 w-20 shrink-0 rounded-full object-cover border border-border"
                              />
                            ) : (
                              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-muted text-muted-foreground">
                                <UserPlus size={24} strokeWidth={1.4} />
                              </span>
                            )}
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-primary">{vacant ? "Open Position" : item.title}</h3>
                                {vacant ? (
                                  <span className="border-[1px] border-dashed border-accent/40 bg-accent/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accent">
                                    Vacant
                                  </span>
                                ) : null}
                              </div>
                              {item.secondary ? (
                                <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">
                                  {item.secondary}
                                </p>
                              ) : null}
                              {item.description ? (
                                <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{item.description}</p>
                              ) : null}
                              {item.link ? (
                                <p className="text-xs text-accent mt-2 break-all">{item.link}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => move(item, -1)}
                              disabled={index === 0}
                              aria-label={`Move ${item.title} up`}
                            >
                              <ArrowUp size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => move(item, 1)}
                              disabled={index === current.length - 1}
                              aria-label={`Move ${item.title} down`}
                            >
                              <ArrowDown size={14} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                              <Pencil size={14} /> Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteTarget(item)}
                              aria-label={`Delete ${item.title}`}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <AdminFormDialog
        open={open}
        onOpenChange={setOpen}
        title={`${editingId ? "Edit" : "Add"} officer`}
        description="Choose a level and enter the details shown on the public leadership page."
        onSubmit={submit}
        submitLabel="Save"
        formId="officer-form"
      >
        <label className="space-y-2 block text-sm font-medium">
          Leadership level
          <select
            value={form.level}
            onChange={(event) => setForm({ ...form, level: Number(event.target.value) })}
            className="h-10 w-full border-[1px] border-border bg-background px-3 text-sm"
          >
            {LEADERSHIP_LEVELS.map((level) => (
              <option key={level.index} value={level.index}>
                {level.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.vacant}
            onChange={(event) => {
              const vacant = event.target.checked;
              setForm({
                ...form,
                vacant,
                title: vacant ? "Open Position" : form.title === "Open Position" ? "" : form.title,
                description: vacant ? "" : form.description,
                link: vacant ? "" : form.link,
                imagePath: vacant ? "" : form.imagePath,
              });
            }}
            className="h-4 w-4"
          />
          Vacant position
        </label>

        {!form.vacant ? (
          <label className="space-y-2 block text-sm font-medium">
            Name
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </label>
        ) : null}

        <label className="space-y-2 block text-sm font-medium">
          Role
          <Input value={form.secondary} onChange={(event) => setForm({ ...form, secondary: event.target.value })} />
        </label>

        {!form.vacant ? (
          <>
            <label className="space-y-2 block text-sm font-medium">
              Intro (optional)
              <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label className="space-y-2 block text-sm font-medium">
              LinkedIn URL (optional)
              <Input value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} />
            </label>
            <div className="space-y-2 block text-sm font-medium">
              <span>Photo</span>
              <DemoMediaPicker
                id="officer-image"
                media={media}
                value={form.imagePath || null}
                onChange={(imagePath) => setForm({ ...form, imagePath: imagePath || "" })}
                imagesOnly
              />
            </div>
          </>
        ) : null}
      </AdminFormDialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(value) => !value && setDeleteTarget(null)}
        itemLabel={deleteTarget?.title || ""}
        onConfirm={confirmDelete}
      />
    </>
  );
}
