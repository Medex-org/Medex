import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
  type SiteNewsHighlight,
  type SitePartner,
  type SiteWebinar,
} from "@/data/site-content";

export interface SiteContent {
  achievements: SiteAchievement[];
  newsHighlights: SiteNewsHighlight[];
  webinars: SiteWebinar[];
  eventBanners: SiteEventBanner[];
  partners: SitePartner[];
  courses: SiteCourse[];
  events: SiteEvent[];
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
    courses: FALLBACK_COURSES,
    events: FALLBACK_EVENTS,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    async function load() {
      const results = await Promise.all([
        supabase.from("achievements").select("*").order("sort_order"),
        supabase.from("news_highlights").select("*").order("sort_order"),
        supabase.from("webinars").select("*").order("sort_order"),
        supabase.from("event_banners").select("*").order("sort_order"),
        supabase.from("partners").select("*").order("sort_order"),
        supabase.from("courses").select("*").eq("status", "published").order("created_at"),
        supabase.from("events").select("*").eq("status", "published").order("date"),
        supabase.from("media").select("id,bucket_path"),
      ]);
      if (!active) return;
      const [achievements, newsHighlights, webinars, eventBanners, partners, courses, events, media] = results;
      const mediaPaths = new Map((media.data || []).map((item) => [item.id, item.bucket_path]));
      const resolveMediaPath = (path: string | null) => publicMediaUrl(mediaPaths.get(path || "") || path);
      setContent({
        achievements: achievements.data?.length ? achievements.data.map((item) => ({ id: item.id, title: item.title, badge: item.badge || "", description: item.description || "", image: resolveMediaPath(item.image_path) })) : FALLBACK_ACHIEVEMENTS,
        newsHighlights: newsHighlights.data?.length ? newsHighlights.data.map((item) => ({ id: item.id, title: item.title, description: item.description || "" })) : FALLBACK_NEWS_HIGHLIGHTS,
        webinars: webinars.data?.length ? webinars.data.map((item) => ({ id: item.id, title: item.title, cadence: item.cadence || "", description: item.description || "" })) : FALLBACK_WEBINARS,
        eventBanners: eventBanners.data?.length ? eventBanners.data.map((item) => ({ id: item.id, label: item.label, href: item.href || "#", image: resolveMediaPath(item.image_path) })) : FALLBACK_EVENT_BANNERS,
        partners: partners.data?.length ? partners.data.map((item) => ({ id: item.id, name: item.name, description: item.description || "", linkedinUrl: item.linkedin_url || undefined, image: resolveMediaPath(item.image_path) })) : FALLBACK_PARTNERS,
        courses: courses.data?.length ? courses.data.map((item) => ({ id: item.id, title: item.title, category: item.category || "", description: item.description || "", registrationUrl: item.registration_url || "" })) : FALLBACK_COURSES,
        events: events.data?.length ? events.data.map((item) => ({ id: item.id, name: item.title, type: item.category || "Event", status: "Upcoming", date: [item.date, item.time, item.timezone].filter(Boolean).join(" · "), desc: item.description || "", image: resolveMediaPath(item.image_path), link: item.registration_url || null, linkLabel: item.registration_url ? "Register" : null })) : FALLBACK_EVENTS,
        loading: false,
      });
    }
    load().catch(() => {
      if (active) setContent((current) => ({ ...current, loading: false }));
    });
    return () => { active = false; };
  }, []);

  return content;
}
