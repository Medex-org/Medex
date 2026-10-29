import { useEffect, useMemo, useState } from "react";
import { BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import type { AdminActionRequest, Course, CourseInput } from "../admin-types";
import { COURSE_CATEGORIES } from "../demo-data";
import { useAdminStore } from "../use-admin-store";
import {
  formatDemoDate,
  isHttpUrl,
} from "../admin-utils";
import { AdminPageHeader } from "./AdminPageHeader";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { AdminField } from "./AdminField";
import { AdminFormDialog } from "./AdminFormDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { AdminEmptyState } from "./AdminEmptyState";
import { DemoMediaPicker } from "./DemoMediaPicker";

function emptyCourse(): CourseInput {
  return {
    title: "",
    category: "",
    description: "",
    startDate: "",
    status: "published",
    imageId: null,
    registrationUrl: "",
  };
}

export function CoursesManager({
  request,
  clearRequest,
}: {
  request?: AdminActionRequest;
  clearRequest: () => void;
}) {
  const { courses, media, createCourse, updateCourse, deleteCourse, toggleCourseStatus } =
    useAdminStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseInput>(emptyCourse);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyCourse());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      category: course.category,
      description: course.description,
      startDate: course.startDate,
      status: course.status,
      imageId: course.imageId,
      registrationUrl: course.registrationUrl,
    });
    setErrors({});
    setDialogOpen(true);
  };

  useEffect(() => {
    if (!request || request.section !== "courses") return;
    if (request.kind === "edit" && request.id) {
      const course = courses.find((item) => item.id === request.id);
      if (course) openEdit(course);
    } else {
      openCreate();
    }
    clearRequest();
  }, [request?.nonce]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses
      .filter((course) => {
        const matchesQuery =
          !query ||
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || course.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" || course.category === categoryFilter;
        return matchesQuery && matchesStatus && matchesCategory;
      })
      .sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
  }, [courses, search, statusFilter, categoryFilter]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "A course title is required.";
    if (!form.category) next.category = "Select a category.";
    if (!form.description.trim())
      next.description = "Add a short description for this course.";
    if (!form.startDate) next.startDate = "Choose a start date.";
    if (!isHttpUrl(form.registrationUrl))
      next.registrationUrl = "Enter a full http(s) URL, or leave this empty.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    if (editingId) {
      updateCourse(editingId, form);
      toast({
        title: "Course updated",
        description: "Changes saved to Supabase.",
      });
    } else {
      createCourse(form);
      toast({
        title: "Course created",
        description: "Saved to Supabase.",
      });
    }
    setDialogOpen(false);
  };

  const toggleStatus = (course: Course) => {
    toggleCourseStatus(course.id);
    toast({
      title:
        course.status === "published"
          ? "Moved to draft"
          : "Marked published",
      description:
        "Status updated on the public site.",
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCourse(deleteTarget.id);
    toast({
      title: "Course deleted",
      description: "Deleted from Supabase.",
    });
    setDeleteTarget(null);
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Courses"
        description="Search, create, and edit course records published to the site."
        action={
          <Button
            onClick={openCreate}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus size={16} aria-hidden="true" /> Add course
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
            placeholder="Search courses by title, category, or description"
            aria-label="Search courses"
            className="pl-9 bg-card"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger aria-label="Filter by status" className="bg-card sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published (demo)</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger aria-label="Filter by category" className="bg-card sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {COURSE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<BookOpen size={28} strokeWidth={1.2} />}
          title="No courses match these filters"
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
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Starts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="max-w-[22rem]">
                      <p className="font-medium text-sm">{course.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {course.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-secondary whitespace-nowrap">
                      {course.category}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {formatDemoDate(course.startDate)}
                    </TableCell>
                    <TableCell>
                      <ContentStatusBadge status={course.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {formatDemoDate(course.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(course)}
                        >
                          {course.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(course)}
                          aria-label={`Edit ${course.title}`}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(course)}
                          aria-label={`Delete ${course.title}`}
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
            {filtered.map((course) => (
              <div
                key={course.id}
                className="border-[1px] border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{course.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">
                      {course.category}
                    </p>
                  </div>
                  <ContentStatusBadge status={course.status} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between gap-2 mt-4">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Starts {formatDemoDate(course.startDate)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(course)}
                    >
                      {course.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(course)}
                      aria-label={`Edit ${course.title}`}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(course)}
                      aria-label={`Delete ${course.title}`}
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
        title={editingId ? "Edit demo course" : "Add demo course"}
        description="Changes stay in this browser session and never reach the public site."
        onSubmit={submit}
        submitLabel={editingId ? "Save changes" : "Create course"}
        formId="course-form"
      >
        <AdminField
          label="Course title"
          htmlFor="course-title"
          required
          error={errors.title}
        >
          <Input
            id="course-title"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="e.g. Sample research methods course"
          />
        </AdminField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField
            label="Category"
            htmlFor="course-category"
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
              <SelectTrigger id="course-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select category</SelectItem>
                {COURSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AdminField>

          <AdminField
            label="Start date"
            htmlFor="course-start"
            required
            error={errors.startDate}
          >
            <Input
              id="course-start"
              type="date"
              value={form.startDate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
            />
          </AdminField>
        </div>

        <AdminField
          label="Description"
          htmlFor="course-description"
          required
          error={errors.description}
        >
          <Textarea
            id="course-description"
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="What would this course cover?"
          />
        </AdminField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Status" htmlFor="course-status">
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  status: value as CourseInput["status"],
                }))
              }
            >
              <SelectTrigger id="course-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published (demo)</SelectItem>
              </SelectContent>
            </Select>
          </AdminField>

          <AdminField
            label="Registration URL"
            htmlFor="course-url"
            error={errors.registrationUrl}
            hint="Optional. Demo only — no link is published."
          >
            <Input
              id="course-url"
              type="url"
              value={form.registrationUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  registrationUrl: event.target.value,
                }))
              }
              placeholder="https://example.org/course"
            />
          </AdminField>
        </div>

        <AdminField label="Cover image" htmlFor="course-image">
          <DemoMediaPicker
            id="course-image"
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
