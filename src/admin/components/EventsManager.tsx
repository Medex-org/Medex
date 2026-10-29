import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
  EventInput,
  EventItem,
  EventLocationType,
} from "../admin-types";
import { EVENT_CATEGORIES, TIMEZONES } from "../demo-data";
import { useAdminStore } from "../use-admin-store";
import { formatDemoDate, isHttpUrl } from "../admin-utils";
import { AdminPageHeader } from "./AdminPageHeader";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { AdminField } from "./AdminField";
import { AdminFormDialog } from "./AdminFormDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { AdminEmptyState } from "./AdminEmptyState";
import { DemoMediaPicker } from "./DemoMediaPicker";

const LOCATION_TYPES: EventLocationType[] = ["Virtual", "In person", "Hybrid"];

function emptyEvent(): EventInput {
  return {
    title: "",
    category: "",
    date: "",
    time: "",
    timezone: "PKT",
    locationType: "Virtual",
    location: "",
    description: "",
    status: "published",
    registrationUrl: "",
    imageId: null,
  };
}

function displayLocation(event: EventItem): string {
  if (event.location.trim()) return event.location;
  return event.locationType === "Virtual" ? "Online" : "—";
}

export function EventsManager({
  request,
  clearRequest,
}: {
  request?: AdminActionRequest;
  clearRequest: () => void;
}) {
  const {
    events,
    media,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleEventStatus,
  } = useAdminStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventInput>(emptyEvent);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyEvent());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (event: EventItem) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      category: event.category,
      date: event.date,
      time: event.time,
      timezone: event.timezone,
      locationType: event.locationType,
      location: event.location,
      description: event.description,
      status: event.status,
      registrationUrl: event.registrationUrl,
      imageId: event.imageId,
    });
    setErrors({});
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!request || request.section !== "events") return;
    if (request.kind === "edit" && request.id) {
      const event = events.find((item) => item.id === request.id);
      if (event) openEdit(event);
    } else {
      openCreate();
    }
    clearRequest();
  }, [request?.nonce]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events
      .filter((event) => {
        const matchesQuery =
          !query ||
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || event.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || event.category === categoryFilter;
        return matchesQuery && matchesStatus && matchesCategory;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, search, statusFilter, categoryFilter]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "An event title is required.";
    if (!form.category) next.category = "Select a category.";
    if (!form.date) next.date = "Choose an event date.";
    if (!form.time) next.time = "Choose a start time.";
    if (form.locationType !== "Virtual" && !form.location.trim())
      next.location = "Add a venue or location.";
    if (!form.description.trim())
      next.description = "Add a short event description.";
    if (!isHttpUrl(form.registrationUrl))
      next.registrationUrl = "Enter a full http(s) URL, or leave this empty.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (editingId) {
      updateEvent(editingId, form);
      toast({
        title: "Event saved",
        description: "Changes saved to Supabase.",
      });
    } else {
      createEvent(form);
      toast({
        title: "Event created",
        description: "Saved to Supabase.",
      });
    }
    setDialogOpen(false);
  };

  const toggleStatus = (event: EventItem) => {
    toggleEventStatus(event.id);
    toast({
      title:
        event.status === "published"
          ? "Moved to draft"
          : "Marked published",
      description:
        "Status updated on the public site.",
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteEvent(deleteTarget.id);
    toast({
      title: "Event deleted",
      description: "Deleted from Supabase.",
    });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Events"
        description="Manage sample events, dates, time zones, and venues. Nothing here creates a real event or collects registrations."
        action={
          <Button
            onClick={openCreate}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={16} aria-hidden="true" /> Create event
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
            placeholder="Search events by title, category, or location"
            aria-label="Search events"
            className="pl-9 bg-card"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger aria-label="Filter events by status" className="bg-card sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published (demo)</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger aria-label="Filter events by category" className="bg-card sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {EVENT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<CalendarDays size={28} strokeWidth={1.2} />}
          title="No events match these filters"
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
                  <TableHead>Event</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date &amp; time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="max-w-[20rem]">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {event.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-secondary whitespace-nowrap">
                      {event.category}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {formatDemoDate(event.date)}
                      <br />
                      <span className="text-muted-foreground">
                        {event.time} {event.timezone}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs max-w-[12rem]">
                      <span className="block text-muted-foreground">
                        {event.locationType}
                      </span>
                      <span className="line-clamp-1">{displayLocation(event)}</span>
                    </TableCell>
                    <TableCell>
                      <ContentStatusBadge status={event.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(event)}
                        >
                          {event.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(event)}
                          aria-label={`Edit ${event.title}`}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(event)}
                          aria-label={`Delete ${event.title}`}
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
            {filtered.map((event) => (
              <div
                key={event.id}
                className="border-[1px] border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">
                      {event.category}
                    </p>
                  </div>
                  <ContentStatusBadge status={event.status} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                  {event.description}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-2">
                  {formatDemoDate(event.date)} · {event.time} {event.timezone}
                  <br />
                  {event.locationType} · {displayLocation(event)}
                </p>
                <div className="flex items-center justify-end gap-1 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(event)}
                  >
                    {event.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(event)}
                    aria-label={`Edit ${event.title}`}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(event)}
                    aria-label={`Delete ${event.title}`}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <AdminFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingId ? "Edit demo event" : "Create demo event"}
        description="Changes stay in this browser session and never reach the public site."
        onSubmit={submit}
        submitLabel={editingId ? "Save changes" : "Create event"}
        formId="event-form"
      >
        <AdminField
          label="Event title"
          htmlFor="event-title"
          required
          error={errors.title}
        >
          <Input
            id="event-title"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="e.g. Sample research workshop"
          />
        </AdminField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField
            label="Category"
            htmlFor="event-category"
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
              <SelectTrigger id="event-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select category</SelectItem>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AdminField>

          <AdminField
            label="Date"
            htmlFor="event-date"
            required
            error={errors.date}
          >
            <Input
              id="event-date"
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
            />
          </AdminField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField
            label="Time"
            htmlFor="event-time"
            required
            error={errors.time}
          >
            <Input
              id="event-time"
              type="time"
              value={form.time}
              onChange={(event) =>
                setForm((current) => ({ ...current, time: event.target.value }))
              }
            />
          </AdminField>

          <AdminField label="Time zone" htmlFor="event-timezone">
            <Select
              value={form.timezone}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, timezone: value }))
              }
            >
              <SelectTrigger id="event-timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AdminField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Location mode" htmlFor="event-location-type">
            <Select
              value={form.locationType}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  locationType: value as EventLocationType,
                }))
              }
            >
              <SelectTrigger id="event-location-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AdminField>

          <AdminField
            label="Location"
            htmlFor="event-location"
            error={errors.location}
            hint={
              form.locationType === "Virtual"
                ? "Optional for virtual events."
                : "Venue or address."
            }
          >
            <Input
              id="event-location"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder={
                form.locationType === "Virtual"
                  ? "Online"
                  : "e.g. Sample University Auditorium"
              }
            />
          </AdminField>
        </div>

        <AdminField
          label="Description"
          htmlFor="event-description"
          required
          error={errors.description}
        >
          <Textarea
            id="event-description"
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="What is this event about?"
          />
        </AdminField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField
            label="Registration URL"
            htmlFor="event-url"
            error={errors.registrationUrl}
            hint="Optional. Demo only — no link is published."
          >
            <Input
              id="event-url"
              type="url"
              value={form.registrationUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  registrationUrl: event.target.value,
                }))
              }
              placeholder="https://example.org/event"
            />
          </AdminField>

          <AdminField label="Status" htmlFor="event-status">
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  status: value as EventInput["status"],
                }))
              }
            >
              <SelectTrigger id="event-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published (demo)</SelectItem>
              </SelectContent>
            </Select>
          </AdminField>
        </div>

        <AdminField label="Cover image" htmlFor="event-image">
          <DemoMediaPicker
            id="event-image"
            media={media}
            value={form.imageId}
            onChange={(imageId) =>
              setForm((current) => ({ ...current, imageId }))
            }
          />
        </AdminField>
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
