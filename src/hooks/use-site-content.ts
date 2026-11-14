import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GOVERNANCE } from "@/data/governance";
import {
  DEPARTMENT_SYNC_MARKER,
  ROSTER_SYNC_MARKER,
  contentKey,
  isRosterMarker,
} from "@/data/leadership";
import { DEPARTMENT_ROSTERS } from "@/data/department-roster";
import {
  FALLBACK_ACHIEVEMENTS,
  FALLBACK_COURSES,
  FALLBACK_EVENTS,
  FALLBACK_EVENT_BANNERS,
  FALLBACK_NEWS_HIGHLIGHTS,
  FALLBACK_PARTNERS,
  FALLBACK_WEBINARS,
  type SiteAchievement,
  type SiteCourse,
  type SiteEvent,
  type SiteEventBanner,
  type SiteGlobalOfficer,
  type SiteNewsHighlight,
  type SitePartner,
  type SiteUpdate,
  type SiteWebinar,
} from "@/data/site-content";

export interface SiteContent {
  achievements: SiteAchievement[];
  newsHighlights: SiteNewsHighlight[];
  webinars: SiteWebinar[];
  eventBanners: SiteEventBanner[];
  partners: SitePartner[];
  globalOfficers: SiteGlobalOfficer[];
  leadershipSynced: boolean;
  departmentsSynced: boolean;
  courses: SiteCourse[];
  events: SiteEvent[];
  updates: SiteUpdate[];
  loading: boolean;
}

function publicMediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>({
    achievements: FALLBACK_ACHIEVEMENTS,
    newsHighlights: FALLBACK_NEWS_HIGHLIGHTS,
    webinars: FALLBACK_WEBINARS,
    eventBanners: FALLBACK_EVENT_BANNERS,
    partners: FALLBACK_PARTNERS,
    globalOfficers: [],
    leadershipSynced: false,
    departmentsSynced: false,
    courses: FALLBACK_COURSES,
    events: FALLBACK_EVENTS,
    updates: [],
    loading: true,
  });

  useEffect(() => {
    let active = true;
    let inFlight = false;
    async function load() {
      if (inFlight) return;
      inFlight = true;
      const results = await Promise.all([
        supabase.from("achievements").select("*").order("sort_order"),
        supabase.from("news_highlights").select("*").order("sort_order"),
        supabase.from("webinars").select("*").order("sort_order"),
        supabase.from("event_banners").select("*").order("sort_order"),
        supabase.from("partners").select("*").order("sort_order"),
        supabase.from("global_officers").select("*").order("sort_order"),
        supabase.from("courses").select("*").eq("status", "published").order("created_at"),
        supabase.from("events").select("*").eq("status", "published").order("date"),
        supabase.from("news_updates").select("*").eq("status", "published").order("date", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false }),
        supabase.from("media").select("id,bucket_path"),
      ]).finally(() => {
        inFlight = false;
      });
      if (!active) return;
      const [achievements, newsHighlights, webinars, eventBanners, partners, globalOfficers, courses, events, updates, media] = results;
      const mediaPaths = new Map((media.data || []).map((item) => [item.id, item.bucket_path]));
      const resolveMediaPath = (path: string | null) => publicMediaUrl(mediaPaths.get(path || "") || path);
      const fallbackAchievement = new Map(FALLBACK_ACHIEVEMENTS.map((item) => [contentKey(item.title), item]));
      const fallbackBanner = new Map(FALLBACK_EVENT_BANNERS.map((item) => [contentKey(item.label), item]));
      const fallbackPartner = new Map(FALLBACK_PARTNERS.map((item) => [contentKey(item.name), item]));
      const fallbackEvent = new Map(FALLBACK_EVENTS.map((item) => [contentKey(item.name), item]));
      const fallbackOfficer = new Map<string, { intro?: string; image: string | null }>([
        ...GOVERNANCE.flatMap((level) => level.people),
        ...Object.values(DEPARTMENT_ROSTERS).flat(),
      ].map((item) => [contentKey(item.name), item]));
      const officerRows = globalOfficers.data || [];
      const leadershipSynced = officerRows.some((item) => item.name === ROSTER_SYNC_MARKER);
      const departmentsSynced = officerRows.some((item) => item.name === DEPARTMENT_SYNC_MARKER);
      const officers: SiteGlobalOfficer[] = officerRows
        .filter((item) => !isRosterMarker(item.name))
        .map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          intro: item.intro || fallbackOfficer.get(contentKey(item.name))?.intro || "",
          linkedinUrl: item.linkedin_url || undefined,
          image: resolveMediaPath(item.image_path) || fallbackOfficer.get(contentKey(item.name))?.image || null,
          sortOrder: Number(item.sort_order) || 0,
          vacant: String(item.name || "").trim().toLowerCase() === "open position",
          scope: item.scope === "department" ? "department" : "global",
          departmentSlug: item.department_slug || null,
          levelKey: item.level_key || null,
          personKey: item.person_key || null,
          supervisorKey: item.supervisor_key || null,
          isActive: item.is_active !== false,
        }));
      setContent({
        achievements: achievements.data?.length ? achievements.data.map((item) => ({ id: item.id, title: item.title, badge: item.badge || "", description: item.description || "", image: resolveMediaPath(item.image_path) || fallbackAchievement.get(contentKey(item.title))?.image || null })) : FALLBACK_ACHIEVEMENTS,
        newsHighlights: newsHighlights.data?.length ? newsHighlights.data.map((item) => ({ id: item.id, title: item.title, description: item.description || "" })) : FALLBACK_NEWS_HIGHLIGHTS,
        webinars: webinars.data?.length ? webinars.data.map((item) => ({ id: item.id, title: item.title, cadence: item.cadence || "", description: item.description || "" })) : FALLBACK_WEBINARS,
        eventBanners: eventBanners.data?.length ? eventBanners.data.map((item) => ({ id: item.id, label: item.label, href: item.href || "#", image: resolveMediaPath(item.image_path) || fallbackBanner.get(contentKey(item.label))?.image || null })) : FALLBACK_EVENT_BANNERS,
        partners: partners.data?.length ? partners.data.map((item) => ({ id: item.id, name: item.name, description: item.description || "", linkedinUrl: item.linkedin_url || undefined, image: resolveMediaPath(item.image_path) || fallbackPartner.get(contentKey(item.name))?.image || null })) : FALLBACK_PARTNERS,
        globalOfficers: officers,
        leadershipSynced,
        departmentsSynced,
        courses: courses.data?.length ? courses.data.map((item) => ({ id: item.id, title: item.title, category: item.category || "", description: item.description || "", registrationUrl: item.registration_url || "" })) : FALLBACK_COURSES,
        events: events.data?.length ? events.data.map((item) => ({ id: item.id, name: item.title, type: item.category || "Event", status: "Upcoming", date: [item.date, item.time, item.timezone].filter(Boolean).join(" · "), desc: item.description || "", location: item.location || "", image: resolveMediaPath(item.image_path) || fallbackEvent.get(contentKey(item.title))?.image || null, link: item.registration_url || null, linkLabel: item.registration_url ? "Register" : null })) : FALLBACK_EVENTS,
        updates: (updates.data || []).map((item) => ({ id: item.id, title: item.title, category: item.category || "", body: item.body || "", date: item.date || "", image: resolveMediaPath(item.image_path) })),
        loading: false,
      });
    }
    load().catch(() => {
      if (active) setContent((current) => ({ ...current, loading: false }));
    });
    const refresh = () => {
      if (document.visibilityState === "visible") {
        load().catch(() => {});
      }
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return content;
}
