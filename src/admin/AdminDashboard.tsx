import { useState } from "react";
import { PageMeta } from "@/components/ui/page-meta";
import type { AdminActionRequest, AdminSection } from "./admin-types";
import { AdminStoreProvider } from "./use-admin-store";
import { AdminLayout } from "./AdminLayout";
import { AdminOverview } from "./components/AdminOverview";
import { CoursesManager } from "./components/CoursesManager";
import { NewsManager } from "./components/NewsManager";
import { EventsManager } from "./components/EventsManager";
import { MediaLibrary } from "./components/MediaLibrary";
import { PreferencesPanel } from "./components/PreferencesPanel";
import { ManagedContentManager } from "./components/ManagedContentManager";

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
