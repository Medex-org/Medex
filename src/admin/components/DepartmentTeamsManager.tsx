import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ManagedContentItem } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import { useAuth } from "../auth/AuthProvider";
import { isDepartmentAdmin, isSuperAdmin } from "../auth/access";
import { DEPARTMENTS } from "@/data/departments";
import {
  DEPARTMENT_LEVELS,
  DEPARTMENT_ROSTERS,
  departmentLevelForKey,
  departmentLevelIndexForItem,
  type DepartmentLevelKey,
} from "@/data/department-roster";
import { contentKey, rosterKey } from "@/data/leadership";
import { AdminFormDialog } from "./AdminFormDialog";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminEmptyState } from "./AdminEmptyState";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { DemoMediaPicker } from "./DemoMediaPicker";

interface DepartmentForm {
  title: string;
  secondary: string;
  description: string;
  link: string;
  imagePath: string;
  levelKey: DepartmentLevelKey;
  departmentSlug: string;
  supervisorKey: string;
  vacant: boolean;
  personKey: string;
  sortOrder: number;
}

const emptyForm = (departmentSlug: string, levelKey: DepartmentLevelKey, sortOrder: number): DepartmentForm => ({
  title: "",
  secondary: "",
  description: "",
  link: "",
  imagePath: "",
  levelKey,
  departmentSlug,
  supervisorKey: "",
  vacant: false,
  personKey: "",
  sortOrder,
});

function isVacant(item: ManagedContentItem): boolean {
  return item.title.trim().toLowerCase() === "open position";
}

const staticImages = new Map(
  Object.values(DEPARTMENT_ROSTERS)
    .flat()
    .filter((person) => person.image)
    .map((person) => [contentKey(person.name), person.image]),
);

export function DepartmentTeamsManager() {
  const {
    managedContent,
    media,
    departmentsSynced,
    createManagedContent,
    updateManagedContent,
    reorderManagedContent,
    deleteManagedContent,
    syncLeadershipRoster,
  } = useAdminStore();
  const { profile } = useAuth();
  const { toast } = useToast();
  const departmentAdmin = isDepartmentAdmin(profile?.role);
  const superAdmin = isSuperAdmin(profile?.role);
  const availableDepartments = useMemo(() => {
    if (!departmentAdmin) return DEPARTMENTS;
    if (!profile?.department_slug) return [];
    return DEPARTMENTS.filter((department) => department.slug === profile.department_slug);
  }, [departmentAdmin, profile?.department_slug]);
  const [selectedSlug, setSelectedSlug] = useState(
    () => (departmentAdmin ? profile?.department_slug || "" : DEPARTMENTS[0].slug),
  );
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DepartmentForm>(emptyForm(selectedSlug, "chief", 0));
  const [deleteTarget, setDeleteTarget] = useState<ManagedContentItem | null>(null);
  const [syncing, setSyncing] = useState(false);

  const departmentItems = managedContent.officers.filter(
    (item) => item.scope === "department" && item.departmentSlug === selectedSlug,
  );
  const orderedItems = [...departmentItems].sort((a, b) => a.sortOrder - b.sortOrder);
  const selectedDepartment = DEPARTMENTS.find((department) => department.slug === selectedSlug);

  const levelItems = (levelKey: DepartmentLevelKey) =>
    orderedItems.filter((item) => {
      const itemLevel = departmentLevelForKey(item.levelKey) || DEPARTMENT_LEVELS[departmentLevelIndexForItem(item)];
      return itemLevel.key === levelKey;
    });

  const nextSortOrder = (levelKey: DepartmentLevelKey) => {
    const level = DEPARTMENT_LEVELS.find((entry) => entry.key === levelKey);
    const current = levelItems(levelKey);
    const next = current.length ? Math.max(...current.map((item) => item.sortOrder)) + 1 : level?.band || 0;
    return Math.min(next, (level?.band || 0) + 99);
  };

  useEffect(() => {
    if (departmentAdmin) {
      setSelectedSlug(profile?.department_slug || "");
    }
  }, [departmentAdmin, profile?.department_slug]);

  const openCreate = (levelKey: DepartmentLevelKey = "chief") => {
    if (!selectedSlug) {
      toast({
        title: "No department assigned",
        description: "Ask a super admin to set your department before adding team members.",
        variant: "destructive",
      });
      return;
    }
    setEditingId(null);
    setForm(emptyForm(selectedSlug, levelKey, nextSortOrder(levelKey)));
    setOpen(true);
  };

  const openEdit = (item: ManagedContentItem) => {
    const level = departmentLevelForKey(item.levelKey) || DEPARTMENT_LEVELS[departmentLevelIndexForItem(item)];
    setEditingId(item.id);
    setForm({
      title: item.title,
      secondary: item.secondary,
      description: item.description,
      link: item.link,
      imagePath: item.imagePath,
      levelKey: level.key,
      departmentSlug: item.departmentSlug || selectedSlug,
      supervisorKey: item.supervisorKey || "",
      vacant: isVacant(item),
      personKey: item.personKey || rosterKey(item.title, item.secondary),
      sortOrder: item.sortOrder,
    });
    setOpen(true);
  };

  const applyExistingPerson = (personKey: string) => {
    if (!personKey) {
      setForm((current) => ({ ...current, personKey: "" }));
      return;
    }
    const source = managedContent.officers.find(
      (item) =>
        (item.personKey || rosterKey(item.title, item.secondary)) === personKey &&
        !isVacant(item),
    );
    if (!source) return;
    setForm((current) => ({
      ...current,
      title: source.title,
      description: source.description,
      link: source.link,
      imagePath: source.imagePath,
      personKey,
      vacant: false,
    }));
  };

  const submit = async () => {
    if (!form.secondary.trim()) {
      toast({ title: "Role is required", variant: "destructive" });
      return;
    }
    if (!form.vacant && (!form.title.trim() || form.title.trim().toLowerCase() === "open position")) {
      toast({ title: "Enter the person's name", variant: "destructive" });
      return;
    }

    const currentItem = editingId ? managedContent.officers.find((item) => item.id === editingId) : undefined;
    const currentLevel = currentItem ? departmentLevelIndexForItem(currentItem) : -1;
    const nextLevel = DEPARTMENT_LEVELS.find((level) => level.key === form.levelKey)?.index ?? 0;
    const sortOrder = editingId && currentLevel === nextLevel
      ? form.sortOrder
      : nextSortOrder(form.levelKey);
    const title = form.vacant ? "Open Position" : form.title.trim();
    const payload = {
      title,
      secondary: form.secondary.trim(),
      description: form.vacant ? "" : form.description.trim(),
      link: form.vacant ? "" : form.link.trim(),
      imagePath: form.vacant ? "" : form.imagePath,
      sortOrder,
      scope: "department" as const,
      departmentSlug: form.departmentSlug,
      levelKey: form.levelKey,
      personKey: form.personKey || rosterKey(title, form.secondary),
      supervisorKey: form.vacant ? "" : form.supervisorKey.trim(),
      isActive: currentItem?.isActive ?? true,
    };

    try {
      if (editingId) await updateManagedContent("officers", editingId, payload);
      else await createManagedContent("officers", payload);
      setOpen(false);
      toast({
        title: "Department team member saved",
        description: "The public department page will use this record.",
      });
    } catch (error) {
      toast({
        title: "Could not save department team member",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const move = async (item: ManagedContentItem, direction: -1 | 1) => {
    const level = departmentLevelForKey(item.levelKey) || DEPARTMENT_LEVELS[departmentLevelIndexForItem(item)];
    const current = levelItems(level.key);
    const index = current.findIndex((entry) => entry.id === item.id);
    const target = current[index + direction];
    if (!target) return;
    const next = [...current];
    next[index] = target;
    next[index + direction] = item;
    try {
      await reorderManagedContent("officers", next.map((entry) => entry.id), level.band);
    } catch (error) {
      toast({
        title: "Could not reorder department team",
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
      toast({ title: "Department team member deleted" });
    } catch (error) {
      toast({
        title: "Could not delete department team member",
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
        title: result.alreadySynced ? "Rosters already synced" : "Team rosters synced",
        description: result.alreadySynced
          ? "Supabase already has the global and department rosters."
          : `${result.inserted} people added to Supabase.`,
      });
    } catch (error) {
      toast({
        title: "Could not sync team rosters",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const supervisorOptions = orderedItems.filter(
    (item) =>
      !isVacant(item) &&
      ["chief", "director", "head", "supervisor"].includes(
        (departmentLevelForKey(item.levelKey) || DEPARTMENT_LEVELS[departmentLevelIndexForItem(item)]).key,
      ),
  );
  const existingPeople = Array.from(
    new Map(
      managedContent.officers
        .filter((item) => !isVacant(item))
        .map((item) => [item.personKey || rosterKey(item.title, item.secondary), item]),
    ).entries(),
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Departments"
        title="Department Teams"
        description="Manage each department's Chief, Director, Head, Supervisors, Mentors, and Peer Reviewers. Changes publish directly to the department page."
        action={
          <div className="flex flex-wrap gap-2">
            {superAdmin ? (
              <Button type="button" variant="outline" onClick={manualSync} disabled={syncing}>
                <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
                {syncing ? "Syncing..." : departmentsSynced ? "Rosters synced" : "Sync rosters"}
              </Button>
            ) : null}
            <Button
              onClick={() => openCreate()}
              disabled={!selectedSlug}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus size={16} /> Add team member
            </Button>
          </div>
        }
      />

      {!superAdmin && availableDepartments.length ? (
        <div className="border-[1px] border-accent/30 bg-accent/5 px-4 py-3 mb-6">
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            Your account is scoped to {selectedDepartment?.name || "your department"}. You can manage this department's team only.
          </p>
        </div>
      ) : null}

      {!availableDepartments.length ? (
        <AdminEmptyState
          icon={<UserPlus size={20} />}
          title="No department assigned"
          description="Ask a super admin to set the department for your account before you can manage a team."
        />
      ) : null}

      <div className="flex flex-wrap gap-2 mb-8">
        {availableDepartments.map((department) => {
          const active = department.slug === selectedSlug;
          const count = managedContent.officers.filter(
            (item) => item.scope === "department" && item.departmentSlug === department.slug,
          ).length;
          return (
            <button
              key={department.slug}
              type="button"
              onClick={() => setSelectedSlug(department.slug)}
              className={`px-4 py-2 border-[1px] text-xs font-semibold uppercase tracking-widest transition-colors ${
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-foreground/75 hover:border-accent/40"
              }`}
            >
              {department.shortName}
              <span className="ml-2 font-mono text-[10px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {!selectedDepartment ? null : departmentItems.length === 0 ? (
        <AdminEmptyState
          icon={<UserPlus size={20} />}
          title={`No team records for ${selectedDepartment.shortName}`}
          description="Sync the default roster or add the first team member."
          action={<Button onClick={() => openCreate()}>Add team member</Button>}
        />
      ) : (
        <div className="space-y-8">
          {DEPARTMENT_LEVELS.map((level) => {
            const current = levelItems(level.key);
            return (
              <section key={level.key} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1px] border-border pb-2">
                  <div>
                    <h2 className="font-serif text-lg text-primary">{level.title}</h2>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {current.length} {current.length === 1 ? "person" : "people"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openCreate(level.key)}>
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
                      const vacant = isVacant(item);
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
        title={`${editingId ? "Edit" : "Add"} department team member`}
        description="Choose a department and hierarchy level, then enter the details shown on the public department page."
        onSubmit={submit}
        submitLabel="Save"
        formId="department-team-form"
      >
        <label className="space-y-2 block text-sm font-medium">
          Department
          <select
            value={form.departmentSlug}
            onChange={(event) => setForm({ ...form, departmentSlug: event.target.value })}
            disabled={departmentAdmin}
            className="h-10 w-full border-[1px] border-border bg-background px-3 text-sm disabled:opacity-60"
          >
            {availableDepartments.map((department) => (
              <option key={department.slug} value={department.slug}>
                {department.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 block text-sm font-medium">
          Level
          <select
            value={form.levelKey}
            onChange={(event) => setForm({ ...form, levelKey: event.target.value as DepartmentLevelKey })}
            className="h-10 w-full border-[1px] border-border bg-background px-3 text-sm"
          >
            {DEPARTMENT_LEVELS.map((level) => (
              <option key={level.key} value={level.key}>
                {level.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 block text-sm font-medium">
          Link existing person (optional)
          <select
            value={form.personKey}
            onChange={(event) => applyExistingPerson(event.target.value)}
            className="h-10 w-full border-[1px] border-border bg-background px-3 text-sm"
          >
            <option value="">New person</option>
            {existingPeople.map(([key, person]) => (
              <option key={key} value={key}>
                {person.title} — {person.secondary}
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
                supervisorKey: vacant ? "" : form.supervisorKey,
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
            <label className="space-y-2 block text-sm font-medium">
              Supervisor (optional)
              <select
                value={form.supervisorKey}
                onChange={(event) => setForm({ ...form, supervisorKey: event.target.value })}
                className="h-10 w-full border-[1px] border-border bg-background px-3 text-sm"
              >
                <option value="">No supervisor selected</option>
                {supervisorOptions.map((person) => {
                  const key = person.personKey || rosterKey(person.title, person.secondary);
                  return (
                    <option key={key} value={key}>
                      {person.title} — {person.secondary}
                    </option>
                  );
                })}
              </select>
            </label>
            <div className="space-y-2 block text-sm font-medium">
              <span>Photo</span>
              <DemoMediaPicker
                id="department-team-image"
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
