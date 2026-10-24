import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
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
  refresh: () => Promise<void>;
  managedContent: Record<ManagedContentType, ManagedContentItem[]>;
  createManagedContent: (type: ManagedContentType, item: Omit<ManagedContentItem, "id">) => Promise<void>;
  updateManagedContent: (type: ManagedContentType, id: string, item: Omit<ManagedContentItem, "id">) => Promise<void>;
  deleteManagedContent: (type: ManagedContentType, id: string) => Promise<void>;
}

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

function getPublicUrl(bucketPath: string | null): string | null {
  if (!bucketPath) return null;
  const { data } = supabase.storage.from('media').getPublicUrl(bucketPath);
  return data.publicUrl;
}

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsUpdate[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [managedContent, setManagedContent] = useState<Record<ManagedContentType, ManagedContentItem[]>>({
    achievements: [], "news-highlights": [], webinars: [], banners: [], partners: [],
  });

  const managedTables: Record<ManagedContentType, string> = {
    achievements: "achievements",
    "news-highlights": "news_highlights",
    webinars: "webinars",
    banners: "event_banners",
    partners: "partners",
  };

  const uploadMedia = async (file: File): Promise<MediaAsset> => {
    if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
    if (file.size > 10 * 1024 * 1024) throw new Error("Images must be 10 MB or smaller.");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const bucketPath = `uploads/${crypto.randomUUID()}-${safeName}`;
    const upload = await supabase.storage.from("media").upload(bucketPath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (upload.error) throw upload.error;
    const { data, error } = await supabase.from("media").insert({
      file_name: file.name,
      bucket_path: bucketPath,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: profile?.id || null,
      used_in: [],
    }).select("id").single();
    if (error) {
      await supabase.storage.from("media").remove([bucketPath]);
      throw error;
    }
    await fetchAll();
    return {
      id: data.id,
      bucketPath,
      fileName: file.name,
      type: file.type,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      src: getPublicUrl(bucketPath) || "",
      usedIn: [],
      isLocal: false,
    };
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
        sizeLabel: m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : '',
        src: getPublicUrl(m.bucket_path) || '',
        usedIn: m.used_in || [],
        isLocal: false,
      });
    });
    setMedia(Array.from(mediaMap.values()));
    const mediaIdForPath = (path: string | null) =>
      path ? Array.from(mediaMap.values()).find((asset) => asset.bucketPath === path)?.id || path : null;

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
    const nextManaged = {} as Record<ManagedContentType, ManagedContentItem[]>;
    managedTypes.forEach((type, index) => {
      nextManaged[type] = (managedResults[index]?.data || []).map((item: any) => ({
        id: item.id,
        title: item.title || item.label || item.name || "",
        secondary: item.badge || item.cadence || item.linkedin_url || "",
        description: item.description || "",
        link: item.href || item.linkedin_url || "",
        imagePath: mediaIdForPath(item.image_path) || "",
        sortOrder: item.sort_order || 0,
      }));
    });
    setManagedContent(nextManaged);

    setLoading(false);
  };

  const managedPayload = (type: ManagedContentType, item: Omit<ManagedContentItem, "id">): Record<string, string | number | null> => {
    const selectedMedia = media.find((asset) => asset.id === item.imagePath);
    const base = { description: item.description, sort_order: item.sortOrder, image_path: selectedMedia?.bucketPath || item.imagePath || null };
    if (type === "achievements") return { ...base, title: item.title, badge: item.secondary || null };
    if (type === "webinars") return { ...base, title: item.title, cadence: item.secondary || null };
    if (type === "banners") return { ...base, label: item.title, href: item.link || null };
    if (type === "partners") return { ...base, name: item.title, linkedin_url: item.link || null };
    return { ...base, title: item.title };
  };

  const createManagedContent = async (type: ManagedContentType, item: Omit<ManagedContentItem, "id">) => {
    await supabase.from(managedTables[type]).insert(managedPayload(type, item) as never);
    await fetchAll();
  };

  const updateManagedContent = async (type: ManagedContentType, id: string, item: Omit<ManagedContentItem, "id">) => {
    await supabase.from(managedTables[type]).update(managedPayload(type, item) as never).eq("id", id);
    await fetchAll();
  };

  const deleteManagedContent = async (type: ManagedContentType, id: string) => {
    await supabase.from(managedTables[type]).delete().eq("id", id);
    await fetchAll();
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
    if (!error) await fetchAll();
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
    }).eq('id', id);
    if (!error) await fetchAll();
  };

  const deleteCourse = async (id: string) => {
    await supabase.from('courses').delete().eq('id', id);
    await fetchAll();
  };

  const toggleCourseStatus = async (id: string) => {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    await supabase.from('courses').update({ status: course.status === 'published' ? 'draft' : 'published' }).eq('id', id);
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
    if (!error) await fetchAll();
  };

  const updateNews = async (id: string, patch: NewsUpdateInput) => {
    const imagePath = media.find((asset) => asset.id === patch.imageId)?.bucketPath || patch.imageId;
    await supabase.from('news_updates').update({
      title: patch.title,
      category: patch.category,
      body: patch.body,
      date: patch.date || null,
      status: patch.status,
      image_path: imagePath,
    }).eq('id', id);
    await fetchAll();
  };

  const deleteNews = async (id: string) => {
    await supabase.from('news_updates').delete().eq('id', id);
    await fetchAll();
  };

  const toggleNewsStatus = async (id: string) => {
    const item = news.find(n => n.id === id);
    if (!item) return;
    await supabase.from('news_updates').update({ status: item.status === 'published' ? 'draft' : 'published' }).eq('id', id);
    await fetchAll();
  };

  const createEvent = async (input: EventInput) => {
    const imagePath = media.find((asset) => asset.id === input.imageId)?.bucketPath || input.imageId;
    await supabase.from('events').insert({
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
    await fetchAll();
  };

  const updateEvent = async (id: string, patch: EventInput) => {
    const imagePath = media.find((asset) => asset.id === patch.imageId)?.bucketPath || patch.imageId;
    await supabase.from('events').update({
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
    }).eq('id', id);
    await fetchAll();
  };

  const deleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id);
    await fetchAll();
  };

  const toggleEventStatus = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    await supabase.from('events').update({ status: event.status === 'published' ? 'draft' : 'published' }).eq('id', id);
    await fetchAll();
  };

  const addMedia = async (input: MediaInput) => {
    // For now just refresh - actual upload handled separately
    await fetchAll();
  };

  const removeMedia = async (id: string) => {
    await supabase.from('media').delete().eq('id', id);
    await fetchAll();
  };

  const value = useMemo<AdminStoreValue>(() => ({
    courses, news, events, media, loading,
    createCourse, updateCourse, deleteCourse, toggleCourseStatus,
    createNews, updateNews, deleteNews, toggleNewsStatus,
    createEvent, updateEvent, deleteEvent, toggleEventStatus,
    addMedia, removeMedia, refresh: fetchAll, managedContent,
    createManagedContent, updateManagedContent, deleteManagedContent, uploadMedia,
  }), [courses, news, events, media, loading, managedContent]);

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore(): AdminStoreValue {
  const context = useContext(AdminStoreContext);
  if (!context) throw new Error('useAdminStore must be used inside AdminStoreProvider');
  return context;
}
