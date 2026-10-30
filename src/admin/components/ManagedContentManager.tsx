import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { AdminActionRequest, ManagedContentItem, ManagedContentType } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import { AdminFormDialog } from "./AdminFormDialog";
import { AdminPageHeader } from "./AdminPageHeader";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { AdminEmptyState } from "./AdminEmptyState";
import { DemoMediaPicker } from "./DemoMediaPicker";

const CONFIG: Record<ManagedContentType, { title: string; singular: string; secondary: string; hasLink?: boolean }> = {
  achievements: { title: "Achievements", singular: "achievement", secondary: "Badge" },
  "news-highlights": { title: "News Highlights", singular: "highlight", secondary: "Category" },
  webinars: { title: "Webinars", singular: "webinar", secondary: "Cadence" },
  banners: { title: "Event Banners", singular: "banner", secondary: "Link", hasLink: true },
  partners: { title: "Partners", singular: "partner", secondary: "LinkedIn URL", hasLink: true },
  officers: { title: "Global Officers", singular: "officer", secondary: "Role", hasLink: true },
};

const emptyItem = (): Omit<ManagedContentItem, "id"> => ({
  title: "", secondary: "", description: "", link: "", imagePath: "", sortOrder: 0,
});

export function ManagedContentManager({ type, request, clearRequest }: {
  type: ManagedContentType;
  request?: AdminActionRequest;
  clearRequest: () => void;
}) {
  const config = CONFIG[type];
  const { managedContent, media, createManagedContent, updateManagedContent, deleteManagedContent } = useAdminStore();
  const { toast } = useToast();
  const items = managedContent[type];
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyItem());
  const [deleteTarget, setDeleteTarget] = useState<ManagedContentItem | null>(null);

  const openCreate = () => { setEditingId(null); setForm(emptyItem()); setOpen(true); };
  const openEdit = (item: ManagedContentItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, secondary: item.secondary, description: item.description, link: item.link, imagePath: item.imagePath, sortOrder: item.sortOrder });
    setOpen(true);
  };

  useEffect(() => {
    if (!request || request.section !== type) return;
    if (request.kind === "edit" && request.id) {
      const item = items.find((entry) => entry.id === request.id);
      if (item) openEdit(item);
    } else openCreate();
    clearRequest();
  }, [request?.nonce]);

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: "Title and description are required", variant: "destructive" });
      return;
    }
    try {
      if (editingId) await updateManagedContent(type, editingId, form);
      else await createManagedContent(type, form);
      setOpen(false);
      toast({ title: `${config.singular} saved`, description: "The published site will use this record." });
    } catch (error) {
      toast({
        title: `Could not save ${config.singular}`,
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteManagedContent(type, deleteTarget.id);
      setDeleteTarget(null);
      toast({ title: `${config.singular} deleted` });
    } catch (error) {
      toast({
        title: `Could not delete ${config.singular}`,
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Published content"
        title={config.title}
        description={`Manage the ${config.title.toLowerCase()} displayed on the public website.`}
        action={<Button onClick={openCreate} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus size={16} /> Add {config.singular}</Button>}
      />
      {items.length === 0 ? (
        <AdminEmptyState icon={<Plus size={20} />} title={`No ${config.title.toLowerCase()} yet`} description="Run the migration seed SQL, or add the first record here." action={<Button onClick={openCreate}>Add {config.singular}</Button>} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                {item.imagePath && media.find((asset) => asset.id === item.imagePath) ? (
                  <img
                    src={media.find((asset) => asset.id === item.imagePath)?.src}
                    alt=""
                    className="mb-3 h-20 w-32 object-cover border border-border"
                  />
                ) : null}
                <h3 className="font-semibold text-primary">{item.title}</h3>
                {item.secondary ? <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">{item.secondary}</p> : null}
                <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{item.description}</p>
                {item.link ? <p className="text-xs text-accent mt-2 break-all">{item.link}</p> : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(item)}><Pencil size={14} /> Edit</Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.title}`}><Trash2 size={14} /></Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <AdminFormDialog open={open} onOpenChange={setOpen} title={`${editingId ? "Edit" : "Add"} ${config.singular}`} description="Changes are stored in Supabase and are visible publicly when the record is available." onSubmit={submit} submitLabel="Save" formId={`managed-${type}`}>
        <label className="space-y-2 block text-sm font-medium">Title<Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
        <label className="space-y-2 block text-sm font-medium">{config.secondary}<Input value={form.secondary} onChange={(event) => setForm({ ...form, secondary: event.target.value })} /></label>
        <label className="space-y-2 block text-sm font-medium">Description<Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
        {config.hasLink ? <label className="space-y-2 block text-sm font-medium">Link<Input value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} /></label> : null}
        <div className="space-y-2 block text-sm font-medium">
          <span>Image</span>
          <DemoMediaPicker id={`managed-image-${type}`} media={media} value={form.imagePath || null} onChange={(imagePath) => setForm({ ...form, imagePath: imagePath || "" })} />
        </div>
        <label className="space-y-2 block text-sm font-medium">Display order<Input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) || 0 })} /></label>
      </AdminFormDialog>
      <ConfirmDeleteDialog open={!!deleteTarget} onOpenChange={(value) => !value && setDeleteTarget(null)} itemLabel={deleteTarget?.title || ""} onConfirm={confirmDelete} />
    </>
  );
}
