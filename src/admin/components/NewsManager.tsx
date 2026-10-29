import { useEffect, useMemo, useState } from "react";
import { Newspaper, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type {
  AdminActionRequest,
  NewsUpdate,
  NewsUpdateInput,
} from "../admin-types";
import { NEWS_CATEGORIES } from "../demo-data";
import { useAdminStore } from "../use-admin-store";
import { formatDemoDate } from "../admin-utils";
import { AdminPageHeader } from "./AdminPageHeader";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { AdminField } from "./AdminField";
import { AdminFormDialog } from "./AdminFormDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { AdminEmptyState } from "./AdminEmptyState";
import { DemoMediaPicker } from "./DemoMediaPicker";

function emptyNews(): NewsUpdateInput {
  return {
    title: "",
    category: "",
    body: "",
    date: "",
    status: "published",
    imageId: null,
  };
}

export function NewsManager({
  request,
  clearRequest,
}: {
  request?: AdminActionRequest;
  clearRequest: () => void;
}) {
  const { news, media, createNews, updateNews, deleteNews, toggleNewsStatus } =
    useAdminStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsUpdateInput>(emptyNews);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<NewsUpdate | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyNews());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (item: NewsUpdate) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      body: item.body,
      date: item.date,
      status: item.status,
      imageId: item.imageId,
    });
    setErrors({});
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!request || request.section !== "news") return;
    if (request.kind === "edit" && request.id) {
      const item = news.find((entry) => entry.id === request.id);
      if (item) openEdit(item);
    } else {
      openCreate();
    }
    clearRequest();
  }, [request?.nonce]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return news
      .filter((item) => {
        const matchesQuery =
          !query ||
          item.title.toLowerCase().includes(query) ||
          item.body.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || item.category === categoryFilter;
        return matchesQuery && matchesStatus && matchesCategory;
      })
      .sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
  }, [news, search, statusFilter, categoryFilter]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "An update title is required.";
    if (!form.category) next.category = "Select a category.";
    if (!form.body.trim()) next.body = "Add the update body text.";
    if (!form.date) next.date = "Choose a publication date.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (editingId) {
      updateNews(editingId, form);
      toast({
        title: "Update saved",
        description: "Changes saved to Supabase.",
      });
    } else {
      createNews(form);
      toast({
        title: "Update created",
        description: "Saved to Supabase.",
      });
    }
    setDialogOpen(false);
  };

  const toggleStatus = (item: NewsUpdate) => {
    toggleNewsStatus(item.id);
    toast({
      title:
        item.status === "published"
          ? "Moved to draft"
          : "Marked published",
      description:
        "Status updated on the public site.",
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteNews(deleteTarget.id);
    toast({
      title: "News update deleted",
      description: "Deleted from Supabase.",
    });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="News & Updates"
        description="Draft and review sample announcements. Published status here is visual only and never reaches the live website."
        action={
          <Button
            onClick={openCreate}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={16} aria-hidden="true" /> Create update
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 mb-6">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search updates by title, category, or body"
            aria-label="Search updates"
            className="pl-9 bg-card"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger aria-label="Filter updates by status" className="bg-card sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published (demo)</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger aria-label="Filter updates by category" className="bg-card sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {NEWS_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<Newspaper size={28} strokeWidth={1.2} />}
          title="No updates match these filters"
          description="Try a different search term or clear the status and category filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden md:block border-[1px] border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Update</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-[22rem]">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {item.body}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-secondary whitespace-nowrap">
                      {item.category}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {formatDemoDate(item.date)}
                    </TableCell>
                    <TableCell>
                      <ContentStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {formatDemoDate(item.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(item)}
                        >
                          {item.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${item.title}`}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${item.title}`}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="border-[1px] border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">
                      {item.category}
                    </p>
                  </div>
                  <ContentStatusBadge status={item.status} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                  {item.body}
                </p>
                <div className="flex items-center justify-between gap-2 mt-4">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {formatDemoDate(item.date)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(item)}
                    >
                      {item.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(item)}
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(item)}
                      aria-label={`Delete ${item.title}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <AdminFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingId ? "Edit demo update" : "Create demo update"}
        description="Changes stay in this browser session and never reach the public site."
        onSubmit={submit}
        submitLabel={editingId ? "Save changes" : "Create update"}
        formId="news-form"
      >
        <AdminField
          label="Update title"
          htmlFor="news-title"
          required
          error={errors.title}
        >
          <Input
            id="news-title"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="e.g. Sample announcement title"
          />
        </AdminField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField
            label="Category"
            htmlFor="news-category"
            required
            error={errors.category}
          >
            <Select
              value={form.category || "none"}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  category: value === "none" ? "" : value,
                }))
              }
            >
              <SelectTrigger id="news-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select category</SelectItem>
                {NEWS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AdminField>

          <AdminField
            label="Date"
            htmlFor="news-date"
            required
            error={errors.date}
          >
            <Input
              id="news-date"
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
            />
          </AdminField>
        </div>

        <AdminField
          label="Body"
          htmlFor="news-body"
          required
          error={errors.body}
        >
          <Textarea
            id="news-body"
            rows={5}
            value={form.body}
            onChange={(event) =>
              setForm((current) => ({ ...current, body: event.target.value }))
            }
            placeholder="Write the update body text."
          />
        </AdminField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Status" htmlFor="news-status">
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  status: value as NewsUpdateInput["status"],
                }))
              }
            >
              <SelectTrigger id="news-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published (demo)</SelectItem>
              </SelectContent>
            </Select>
          </AdminField>

          <AdminField label="Image" htmlFor="news-image">
            <DemoMediaPicker
              id="news-image"
              media={media}
              value={form.imageId}
              onChange={(imageId) =>
                setForm((current) => ({ ...current, imageId }))
              }
            />
          </AdminField>
        </div>
      </AdminFormDialog>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget?.title ?? ""}
        onConfirm={confirmDelete}
      />
    </>
  );
}
