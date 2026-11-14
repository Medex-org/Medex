import { useEffect, useRef, useState } from "react";
import { PageMeta } from "@/components/ui/page-meta";
import { useToast } from "@/hooks/use-toast";
import type { AdminActionRequest, AdminSection } from "./admin-types";
import { AdminStoreProvider, useAdminStore } from "./use-admin-store";
import { useAuth } from "./auth/AuthProvider";
import { canAccessSection, isSuperAdmin } from "./auth/access";
import { AdminLayout } from "./AdminLayout";
import { AdminOverview } from "./components/AdminOverview";
import { CoursesManager } from "./components/CoursesManager";
import { NewsManager } from "./components/NewsManager";
import { EventsManager } from "./components/EventsManager";
import { MediaLibrary } from "./components/MediaLibrary";
import { PreferencesPanel } from "./components/PreferencesPanel";
import { ManagedContentManager } from "./components/ManagedContentManager";
import { OfficersManager } from "./components/OfficersManager";
import { DepartmentTeamsManager } from "./components/DepartmentTeamsManager";

const SECTIONS: AdminSection[] = [
  "overview",
  "courses",
  "news",
  "events",
  "media",
  "achievements",
  "news-highlights",
  "webinars",
  "banners",
  "partners",
  "officers",
  "departments",
  "preferences",
];

function initialSection(): AdminSection {
  if (typeof window === "undefined") return "overview";
  const value = new URLSearchParams(window.location.search).get("section");
  return SECTIONS.includes(value as AdminSection)
    ? (value as AdminSection)
    : "overview";
}

function DashboardShell() {
  const [section, setSection] = useState<AdminSection>(initialSection);
  const [request, setRequest] = useState<AdminActionRequest | undefined>();
  const { syncLeadershipRoster } = useAdminStore();
  const { profile } = useAuth();
  const { toast } = useToast();
  const rosterSyncStarted = useRef(false);

  useEffect(() => {
    if (!canAccessSection(profile?.role, section)) setSection("overview");
  }, [profile?.role, section]);

  useEffect(() => {
    if (!isSuperAdmin(profile?.role)) return;
    if (rosterSyncStarted.current) return;
    rosterSyncStarted.current = true;
    syncLeadershipRoster()
      .then((result) => {
        if (!result.alreadySynced) {
          toast({
            title: "Team rosters synced",
            description: result.inserted
              ? `${result.inserted} people added to Supabase.`
              : "The global and department rosters are already complete.",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Could not sync the team rosters",
          description: error instanceof Error ? error.message : "Unknown error.",
          variant: "destructive",
        });
      });
  }, [profile?.role]);

  const requestCreate = (target: AdminSection) => {
    setSection(target);
    setRequest({ section: target, kind: "create", nonce: Date.now() });
  };

  const requestEdit = (target: AdminSection, id: string) => {
    setSection(target);
    setRequest({ section: target, kind: "edit", id, nonce: Date.now() });
  };

  const clearRequest = () => setRequest(undefined);

  return (
    <AdminLayout section={section} onSectionChange={setSection}>
      {section === "overview" ? (
        <AdminOverview
          onSectionChange={setSection}
          onRequestCreate={requestCreate}
          onRequestEdit={requestEdit}
        />
      ) : null}

      {section === "courses" ? (
        <CoursesManager
          request={request?.section === "courses" ? request : undefined}
          clearRequest={clearRequest}
        />
      ) : null}

      {section === "news" ? (
        <NewsManager
          request={request?.section === "news" ? request : undefined}
          clearRequest={clearRequest}
        />
      ) : null}

      {section === "events" ? (
        <EventsManager
          request={request?.section === "events" ? request : undefined}
          clearRequest={clearRequest}
        />
      ) : null}

      {section === "media" ? <MediaLibrary /> : null}
      {section === "achievements" ? <ManagedContentManager type="achievements" request={request?.section === "achievements" ? request : undefined} clearRequest={clearRequest} /> : null}
      {section === "news-highlights" ? <ManagedContentManager type="news-highlights" request={request?.section === "news-highlights" ? request : undefined} clearRequest={clearRequest} /> : null}
      {section === "webinars" ? <ManagedContentManager type="webinars" request={request?.section === "webinars" ? request : undefined} clearRequest={clearRequest} /> : null}
      {section === "banners" ? <ManagedContentManager type="banners" request={request?.section === "banners" ? request : undefined} clearRequest={clearRequest} /> : null}
      {section === "partners" ? <ManagedContentManager type="partners" request={request?.section === "partners" ? request : undefined} clearRequest={clearRequest} /> : null}
      {section === "officers" ? <OfficersManager request={request?.section === "officers" ? request : undefined} clearRequest={clearRequest} /> : null}
      {section === "departments" ? <DepartmentTeamsManager /> : null}
      {section === "preferences" ? <PreferencesPanel /> : null}
    </AdminLayout>
  );
}

export default function AdminDashboard() {
  return (
    <AdminStoreProvider>
      <PageMeta
        title="Admin Dashboard"
        description="MEDX content management dashboard."
        noindex
      />
      <DashboardShell />
    </AdminStoreProvider>
  );
}
