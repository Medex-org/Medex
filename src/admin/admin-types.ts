export type ContentStatus = "draft" | "published";

export interface MediaAsset {
  id: string;
  bucketPath?: string;
  fileName: string;
  type: string;
  sizeLabel: string;
  src: string;
  usedIn: string[];
  /** True for browser-only previews created during this session. */
  isLocal?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  startDate: string;
  status: ContentStatus;
  lastUpdated: string;
  imageId: string | null;
  registrationUrl: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  category: string;
  body: string;
  date: string;
  status: ContentStatus;
  lastUpdated: string;
  imageId: string | null;
}

export type EventLocationType = "Virtual" | "In person" | "Hybrid";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  timezone: string;
  locationType: EventLocationType;
  location: string;
  description: string;
  status: ContentStatus;
  lastUpdated: string;
  registrationUrl: string;
  imageId: string | null;
}

export type CourseInput = Omit<Course, "id" | "lastUpdated">;
export type NewsUpdateInput = Omit<NewsUpdate, "id" | "lastUpdated">;
export type EventInput = Omit<EventItem, "id" | "lastUpdated">;
export type MediaInput = Omit<MediaAsset, "id">;

export type AdminSection =
  | "overview"
  | "courses"
  | "news"
  | "events"
  | "media"
  | "achievements"
  | "news-highlights"
  | "webinars"
  | "banners"
  | "partners"
  | "officers"
  | "preferences";

export type Achievement = {
  id: string;
  title: string;
  badge: string | null;
  description: string | null;
  image_path: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type NewsHighlight = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type Webinar = {
  id: string;
  title: string;
  cadence: string | null;
  description: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type EventBanner = {
  id: string;
  label: string;
  href: string | null;
  image_path: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type Partner = {
  id: string;
  name: string;
  description: string | null;
  linkedin_url: string | null;
  image_path: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

export type ManagedContentType = "achievements" | "news-highlights" | "webinars" | "banners" | "partners" | "officers";

export interface ManagedContentItem {
  id: string;
  title: string;
  secondary: string;
  description: string;
  link: string;
  imagePath: string;
  sortOrder: number;
}

export interface AdminActionRequest {
  section: AdminSection;
  kind: "create" | "edit";
  id?: string;
  nonce: number;
}
