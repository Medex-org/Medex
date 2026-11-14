import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type {
  Course,
  CourseInput,
  EventInput,
  EventItem,
  MediaAsset,
  MediaInput,
  NewsUpdate,
  NewsUpdateInput,
  ManagedContentItem,
  ManagedContentType,
} from "./admin-types";
import { formatFileSize } from "./admin-utils";
import { resolveMimeType, validateUpload } from "./media-utils";
import {
  DEPARTMENT_SYNC_MARKER,
  ROSTER_SYNC_MARKER,
  STATIC_ROSTER,
  isRosterMarker,
  rosterKey,
} from "@/data/leadership";
import { DEPARTMENT_ROSTERS, departmentRosterKey } from "@/data/department-roster";
import { useAuth } from "./auth/AuthProvider";

interface AdminStoreValue {
  courses: Course[];
  news: NewsUpdate[];
  events: EventItem[];
  media: MediaAsset[];
  loading: boolean;
  createCourse: (input: CourseInput) => Promise<void>;
  updateCourse: (id: string, patch: CourseInput) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  toggleCourseStatus: (id: string) => Promise<void>;
  createNews: (input: NewsUpdateInput) => Promise<void>;
  updateNews: (id: string, patch: NewsUpdateInput) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  toggleNewsStatus: (id: string) => Promise<void>;
  createEvent: (input: EventInput) => Promise<void>;
  updateEvent: (id: string, patch: EventInput) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventStatus: (id: string) => Promise<void>;
  addMedia: (input: MediaInput) => Promise<void>;
  removeMedia: (id: string) => Promise<void>;
  uploadMedia: (file: File) => Promise<MediaAsset>;
  uploadMediaFiles: (files: File[]) => Promise<MediaAsset[]>;
  refresh: () => Promise<void>;
  managedContent: Record<ManagedContentType, ManagedContentItem[]>;
  leadershipSynced: boolean;
  departmentsSynced: boolean;
  createManagedContent: (type: ManagedContentType, item: Omit<ManagedContentItem, "id">) => Promise<void>;
  updateManagedContent: (type: ManagedContentType, id: string, item: Omit<ManagedContentItem, "id">) => Promise<void>;
  reorderManagedContent: (type: ManagedContentType, orderedIds: string[], startAt?: number) => Promise<void>;
  deleteManagedContent: (type: ManagedContentType, id: string) => Promise<void>;
  syncLeadershipRoster: () => Promise<{ inserted: number; alreadySynced: boolean }>;
}

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

function getPublicUrl(bucketPath: string | null): string | null {
  if (!bucketPath) return null;
  const { data } = supabase.storage.from('media').getPublicUrl(bucketPath);
  return data.publicUrl;
}

function newStorageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsUpdate[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [managedContent, setManagedContent] = useState<Record<ManagedContentType, ManagedContentItem[]>>({
    achievements: [], "news-highlights": [], webinars: [], banners: [], partners: [], officers: [],
  });
  const [leadershipSynced, setLeadershipSynced] = useState(false);
  const [departmentsSynced, setDepartmentsSynced] = useState(false);
  const rosterSyncInFlight = useRef<Promise<{ inserted: number; alreadySynced: boolean }> | null>(null);

  const managedTables: Record<ManagedContentType, string> = {
    achievements: "achievements",
    "news-highlights": "news_highlights",
    webinars: "webinars",
    banners: "event_banners",
    partners: "partners",
    officers: "global_officers",
  };

  const uploadOne = async (file: File): Promise<MediaAsset> => {
    const validationError = validateUpload(file);
    if (validationError) throw new Error(validationError);
    const mimeType = resolveMimeType(file);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const bucketPath = `uploads/${newStorageId()}-${safeName}`;
    const upload = await supabase.storage.from("media").upload(bucketPath, file, {
      contentType: mimeType,
      upsert: false,
    });
    if (upload.error) throw upload.error;
    const { data, error } = await supabase.from("media").insert({
      file_name: file.name,
      bucket_path: bucketPath,
      mime_type: mimeType,
      size_bytes: file.size,
      uploaded_by: profile?.id || null,
      used_in: [],
    }).select("id").single();
    if (error) {
      await supabase.storage.from("media").remove([bucketPath]);
      throw error;
    }
    return {
      id: data.id,
      bucketPath,
      fileName: file.name,
      type: mimeType,
      sizeLabel: formatFileSize(file.size),
      src: getPublicUrl(bucketPath) || "",
      usedIn: [],
      isLocal: false,
    };
  };

  const uploadMediaFiles = async (files: File[]): Promise<MediaAsset[]> => {
    const uploaded: MediaAsset[] = [];
    const failures: string[] = [];
    for (const file of files) {
      try {
        uploaded.push(await uploadOne(file));
      } catch (error) {
        failures.push(`${file.name}: ${error instanceof Error ? error.message : "upload failed"}`);
      }
    }
    if (uploaded.length) await fetchAll();
    if (failures.length) throw new Error(failures.join(" · "));
    return uploaded;
  };

  const uploadMedia = async (file: File): Promise<MediaAsset> => {
    const [asset] = await uploadMediaFiles([file]);
    return asset;
  };

  const fetchAll = async () => {
    setLoading(true);
    const [coursesRes, newsRes, eventsRes, mediaRes, ...managedResults] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('news_updates').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('*').order('date', { ascending: true }),
      supabase.from('media').select('*').order('created_at', { ascending: false }),
      ...Object.values(managedTables).map((table) => supabase.from(table).select('*').order('sort_order')),
    ]);

    const mediaMap = new Map<string, MediaAsset>();
    (mediaRes.data || []).forEach((m: any) => {
      mediaMap.set(m.id, {
        id: m.id,
        bucketPath: m.bucket_path,
        fileName: m.file_name,
        type: m.mime_type || '',
        sizeLabel: m.size_bytes ? formatFileSize(Number(m.size_bytes)) : '',
        src: getPublicUrl(m.bucket_path) || '',
        usedIn: [],
        isLocal: false,
      });
    });
    setMedia(Array.from(mediaMap.values()));
    const mediaIdForPath = (path: string | null) =>
      path ? Array.from(mediaMap.values()).find((asset) => asset.bucketPath === path)?.id || path : null;
    const references = new Map<string, string[]>();
    const addReference = (path: string | null, label: string) => {
      if (!path) return;
      const asset = Array.from(mediaMap.values()).find((entry) => entry.id === path || entry.bucketPath === path);
      if (!asset) return;
      const current = references.get(asset.id) || [];
      references.set(asset.id, [...current, label]);
    };
    (coursesRes.data || []).forEach((item: any) => addReference(item.image_path, `Course: ${item.title}`));
    (newsRes.data || []).forEach((item: any) => addReference(item.image_path, `News: ${item.title}`));
    (eventsRes.data || []).forEach((item: any) => addReference(item.image_path, `Event: ${item.title}`));
    managedResults.forEach((result, index) => (result.data || []).forEach((item: any) => addReference(item.image_path, `${Object.keys(managedTables)[index]}: ${item.title || item.label || item.name}`)));
    mediaMap.forEach((asset) => { asset.usedIn = references.get(asset.id) || []; });

    setCourses((coursesRes.data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      category: c.category || '',
      description: c.description || '',
      startDate: c.start_date || '',
      status: c.status,
      lastUpdated: c.updated_at || c.created_at,
      imageId: mediaIdForPath(c.image_path),
      registrationUrl: c.registration_url || '',
    })));

    setNews((newsRes.data || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      category: n.category || '',
      body: n.body || '',
      date: n.date || '',
      status: n.status,
      lastUpdated: n.updated_at || n.created_at,
      imageId: mediaIdForPath(n.image_path),
    })));

    setEvents((eventsRes.data || []).map((e: any) => ({
      id: e.id,
      title: e.title,
      category: e.category || '',
      date: e.date || '',
      time: e.time || '',
      timezone: e.timezone || '',
      locationType: e.location_type,
      location: e.location || '',
      description: e.description || '',
      status: e.status,
      lastUpdated: e.updated_at || e.created_at,
      registrationUrl: e.registration_url || '',
      imageId: mediaIdForPath(e.image_path),
    })));
    const managedTypes = Object.keys(managedTables) as ManagedContentType[];
    const officerIndex = managedTypes.indexOf("officers");
    const officerRows = managedResults[officerIndex]?.data || [];
    setLeadershipSynced(officerRows.some((item) => item.name === ROSTER_SYNC_MARKER));
    setDepartmentsSynced(officerRows.some((item) => item.name === DEPARTMENT_SYNC_MARKER));
    const nextManaged = {} as Record<ManagedContentType, ManagedContentItem[]>;
    managedTypes.forEach((type, index) => {
      nextManaged[type] = (managedResults[index]?.data || [])
        .filter((item: any) => type !== "officers" || !isRosterMarker(item.name))
        .map((item: any) => ({
          id: item.id,
          title: item.title || item.label || item.name || "",
          secondary: item.badge || item.cadence || item.role || (type === "partners" ? item.linkedin_url : "") || "",
          description: item.description || item.intro || "",
          link: item.href || item.linkedin_url || "",
          imagePath: mediaIdForPath(item.image_path) || "",
          sortOrder: item.sort_order || 0,
          scope: item.scope === "department" ? "department" : "global",
          departmentSlug: item.department_slug || null,
          levelKey: item.level_key || null,
          personKey: item.person_key || null,
          supervisorKey: item.supervisor_key || null,
          isActive: item.is_active !== false,
        }));
    });
    setManagedContent(nextManaged);

    setLoading(false);
  };

  const managedPayload = (type: ManagedContentType, item: Omit<ManagedContentItem, "id">): Record<string, string | number | boolean | null> => {
    const selectedMedia = media.find((asset) => asset.id === item.imagePath);
    const imagePath = selectedMedia?.bucketPath || item.imagePath || null;
    const sortOrder = item.sortOrder;
    if (type === "achievements") {
      return {
        sort_order: sortOrder,
        image_path: imagePath,
        title: item.title,
        badge: item.secondary || null,
        description: item.description,
      };
    }
    if (type === "news-highlights") {
      return { sort_order: sortOrder, title: item.title, description: item.description };
    }
    if (type === "webinars") {
      return {
        sort_order: sortOrder,
        title: item.title,
        cadence: item.secondary || null,
        description: item.description,
      };
    }
    if (type === "banners") {
      return { sort_order: sortOrder, image_path: imagePath, label: item.title, href: item.link || null };
    }
    if (type === "partners") {
      return {
        sort_order: sortOrder,
        image_path: imagePath,
        name: item.title,
        description: item.description,
        linkedin_url: item.link || null,
      };
    }
    if (type === "officers") {
      return {
        sort_order: sortOrder,
        image_path: imagePath,
        name: item.title,
        role: item.secondary,
        intro: item.description,
        linkedin_url: item.link || null,
        scope: item.scope || "global",
        department_slug: item.departmentSlug || null,
        level_key: item.levelKey || null,
        person_key: item.personKey || rosterKey(item.title, item.secondary),
        supervisor_key: item.supervisorKey || null,
        is_active: item.isActive !== false,
      };
    }
    return { sort_order: sortOrder, image_path: imagePath, title: item.title, description: item.description };
  };

  const throwIfError = (error: { message: string } | null) => {
    if (error) throw new Error(error.message);
  };

  const timestamp = () => new Date().toISOString();

  const createManagedContent = async (type: ManagedContentType, item: Omit<ManagedContentItem, "id">) => {
    const { error } = await supabase.from(managedTables[type]).insert(managedPayload(type, item) as never);
    throwIfError(error);
    await fetchAll();
  };

  const updateManagedContent = async (type: ManagedContentType, id: string, item: Omit<ManagedContentItem, "id">) => {
    const { error } = await supabase
      .from(managedTables[type])
      .update({ ...managedPayload(type, item), updated_at: timestamp() } as never)
      .eq("id", id);
    throwIfError(error);
    await fetchAll();
  };

  const reorderManagedContent = async (type: ManagedContentType, orderedIds: string[], startAt = 0) => {
    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase
          .from(managedTables[type])
          .update({ sort_order: startAt + index, updated_at: timestamp() } as never)
          .eq("id", id),
      ),
    );
    throwIfError(results.find((result) => result.error)?.error ?? null);
    await fetchAll();
  };

  const deleteManagedContent = async (type: ManagedContentType, id: string) => {
    const { error } = await supabase.from(managedTables[type]).delete().eq("id", id);
    throwIfError(error);
    await fetchAll();
  };

  const syncLeadershipRoster = () => {
    if (rosterSyncInFlight.current) return rosterSyncInFlight.current;
    const run = (async () => {
      const { data, error } = await supabase
        .from("global_officers")
        .select("name,role,scope,department_slug");
      throwIfError(error);
      const rows = data || [];
      const globalSynced = rows.some((row) => row.name === ROSTER_SYNC_MARKER);
      const departmentsSynced = rows.some((row) => row.name === DEPARTMENT_SYNC_MARKER);
      let inserted = 0;

      if (!globalSynced) {
        const existing = new Set(
          rows
            .filter((row) => row.scope !== "department" && !isRosterMarker(row.name))
            .map((row) => rosterKey(row.name, row.role)),
        );
        const missing = STATIC_ROSTER.filter((row) => !existing.has(rosterKey(row.name, row.role)));
        if (missing.length) {
          const { error: insertError } = await supabase.from("global_officers").insert(
            missing.map((row) => ({
              name: row.name,
              role: row.role,
              intro: row.intro || null,
              linkedin_url: null,
              image_path: null,
              sort_order: row.sortOrder,
              scope: "global",
              person_key: rosterKey(row.name, row.role),
              is_active: true,
            })) as never,
          );
          throwIfError(insertError);
          inserted += missing.length;
        }

        const { error: markerError } = await supabase.from("global_officers").insert({
          name: ROSTER_SYNC_MARKER,
          role: "system",
          intro: "Internal marker used to keep the leadership roster in sync.",
          linkedin_url: null,
          image_path: null,
          sort_order: -1,
          scope: "global",
          level_key: "system",
        } as never);
        throwIfError(markerError);
      }

      if (!departmentsSynced) {
        const existingDepartmentRows = new Set(
          rows
            .filter((row) => row.scope === "department")
            .map((row) => departmentRosterKey(row.department_slug, row.name, row.role)),
        );
        const missingDepartmentRows = Object.entries(DEPARTMENT_ROSTERS).flatMap(([slug, people]) =>
          people
            .filter((person) => !existingDepartmentRows.has(departmentRosterKey(slug, person.name, person.role)))
            .map((person) => ({
              name: person.name,
              role: person.role,
              intro: person.intro || null,
              linkedin_url: person.linkedinUrl || null,
              image_path: null,
              sort_order: person.sortOrder,
              scope: "department",
              department_slug: slug,
              level_key: person.levelKey,
              person_key: person.personKey,
              supervisor_key: person.supervisorKey || null,
              is_active: true,
            })),
        );

        if (missingDepartmentRows.length) {
          const { error: insertError } = await supabase
            .from("global_officers")
            .insert(missingDepartmentRows as never);
          throwIfError(insertError);
          inserted += missingDepartmentRows.length;
        }

        const { error: markerError } = await supabase.from("global_officers").insert({
          name: DEPARTMENT_SYNC_MARKER,
          role: "system",
          intro: "Internal marker used to keep department teams in sync.",
          linkedin_url: null,
          image_path: null,
          sort_order: -2,
          scope: "department",
          level_key: "system",
        } as never);
        throwIfError(markerError);
      }

      await fetchAll();
      return { inserted, alreadySynced: globalSynced && departmentsSynced };
    })();
    rosterSyncInFlight.current = run.finally(() => {
      rosterSyncInFlight.current = null;
    });
    return rosterSyncInFlight.current;
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const createCourse = async (input: CourseInput) => {
    const imagePath = media.find((asset) => asset.id === input.imageId)?.bucketPath || input.imageId;
    const { error } = await supabase.from('courses').insert({
      title: input.title,
      category: input.category,
      description: input.description,
      start_date: input.startDate || null,
      status: input.status,
      image_path: imagePath,
      registration_url: input.registrationUrl || null,
      created_by: profile?.id,
    });
    throwIfError(error);
    await fetchAll();
  };

  const updateCourse = async (id: string, patch: CourseInput) => {
    const imagePath = media.find((asset) => asset.id === patch.imageId)?.bucketPath || patch.imageId;
    const { error } = await supabase.from('courses').update({
      title: patch.title,
      category: patch.category,
      description: patch.description,
      start_date: patch.startDate || null,
      status: patch.status,
      image_path: imagePath,
      registration_url: patch.registrationUrl || null,
      updated_at: timestamp(),
    }).eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const toggleCourseStatus = async (id: string) => {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    const { error } = await supabase.from('courses').update({ status: course.status === 'published' ? 'draft' : 'published', updated_at: timestamp() }).eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const createNews = async (input: NewsUpdateInput) => {
    const imagePath = media.find((asset) => asset.id === input.imageId)?.bucketPath || input.imageId;
    const { error } = await supabase.from('news_updates').insert({
      title: input.title,
      category: input.category,
      body: input.body,
      date: input.date || null,
      status: input.status,
      image_path: imagePath,
      created_by: profile?.id,
    });
    throwIfError(error);
    await fetchAll();
  };

  const updateNews = async (id: string, patch: NewsUpdateInput) => {
    const imagePath = media.find((asset) => asset.id === patch.imageId)?.bucketPath || patch.imageId;
    const { error } = await supabase.from('news_updates').update({
      title: patch.title,
      category: patch.category,
      body: patch.body,
      date: patch.date || null,
      status: patch.status,
      image_path: imagePath,
      updated_at: timestamp(),
    }).eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const deleteNews = async (id: string) => {
    const { error } = await supabase.from('news_updates').delete().eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const toggleNewsStatus = async (id: string) => {
    const item = news.find(n => n.id === id);
    if (!item) return;
    const { error } = await supabase.from('news_updates').update({ status: item.status === 'published' ? 'draft' : 'published', updated_at: timestamp() }).eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const createEvent = async (input: EventInput) => {
    const imagePath = media.find((asset) => asset.id === input.imageId)?.bucketPath || input.imageId;
    const { error } = await supabase.from('events').insert({
      title: input.title,
      category: input.category,
      date: input.date || null,
      time: input.time || null,
      timezone: input.timezone,
      location_type: input.locationType,
      location: input.location,
      description: input.description,
      status: input.status,
      registration_url: input.registrationUrl || null,
      image_path: imagePath,
      created_by: profile?.id,
    });
    throwIfError(error);
    await fetchAll();
  };

  const updateEvent = async (id: string, patch: EventInput) => {
    const imagePath = media.find((asset) => asset.id === patch.imageId)?.bucketPath || patch.imageId;
    const { error } = await supabase.from('events').update({
      title: patch.title,
      category: patch.category,
      date: patch.date || null,
      time: patch.time || null,
      timezone: patch.timezone,
      location_type: patch.locationType,
      location: patch.location,
      description: patch.description,
      status: patch.status,
      registration_url: patch.registrationUrl || null,
      image_path: imagePath,
      updated_at: timestamp(),
    }).eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const toggleEventStatus = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    const { error } = await supabase.from('events').update({ status: event.status === 'published' ? 'draft' : 'published', updated_at: timestamp() }).eq('id', id);
    throwIfError(error);
    await fetchAll();
  };

  const addMedia = async (input: MediaInput) => {
    // For now just refresh - actual upload handled separately
    await fetchAll();
  };

  const removeMedia = async (id: string) => {
    const asset = media.find((item) => item.id === id);
    if (asset?.bucketPath) {
      const { error } = await supabase.storage.from("media").remove([asset.bucketPath]);
      if (error) throw error;
    }
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
    await fetchAll();
  };

  const value = useMemo<AdminStoreValue>(() => ({
    courses, news, events, media, loading,
    createCourse, updateCourse, deleteCourse, toggleCourseStatus,
    createNews, updateNews, deleteNews, toggleNewsStatus,
    createEvent, updateEvent, deleteEvent, toggleEventStatus,
    addMedia, removeMedia, refresh: fetchAll, managedContent, leadershipSynced, departmentsSynced,
    createManagedContent, updateManagedContent, reorderManagedContent, deleteManagedContent,
    uploadMedia, uploadMediaFiles, syncLeadershipRoster,
  }), [courses, news, events, media, loading, managedContent, leadershipSynced, departmentsSynced]);

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore(): AdminStoreValue {
  const context = useContext(AdminStoreContext);
  if (!context) throw new Error('useAdminStore must be used inside AdminStoreProvider');
  return context;
}
