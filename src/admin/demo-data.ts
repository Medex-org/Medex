import type {
  Course,
  EventItem,
  MediaAsset,
  NewsUpdate,
} from "./admin-types";

import srmaImg from "@assets/medx-systematic-review-and-meta-analysis-project.webp";
import basicsImg from "@assets/medx-invites-you-to-join-free-workshop-basics-of-research-and-why-srma-mentorship-is-essential.webp";
import lteImg from "@assets/collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp";
import researchWeekImg from "@assets/nsri-and-medx-announces-complete-research-week.webp";
import campusImg from "@assets/medx-join-us-as-campus-ambassadors.webp";
import cityRepImg from "@assets/medx-announces-slots-for-city-representative.webp";
import mindsImg from "@assets/medx-minds-join-us-as-speakers-or-story-tellers.webp";
import officersImg from "@assets/medx-calls-main-officers.webp";

export const COURSE_CATEGORIES = [
  "Research Methods",
  "Academic Writing",
  "Data & Analysis",
  "Technology",
  "Clinical Skills",
] as const;

export const NEWS_CATEGORIES = [
  "Announcement",
  "Program",
  "Partnership",
  "Community",
] as const;

export const EVENT_CATEGORIES = [
  "Workshop",
  "Conference",
  "Recruitment",
  "Community",
  "Webinar",
] as const;

export const TIMEZONES = ["PKT", "UTC", "GMT", "EST", "CET", "IST"] as const;

export const DEMO_MEDIA: MediaAsset[] = [
  {
    id: "media-srma",
    fileName: "sample-srma-workshop.webp",
    type: "image/webp",
    sizeLabel: "184 KB",
    src: srmaImg,
    usedIn: ["Course: SRMA Foundations", "Update: Sample research methods cohort"],
  },
  {
    id: "media-basics",
    fileName: "sample-basics-of-research.webp",
    type: "image/webp",
    sizeLabel: "162 KB",
    src: basicsImg,
    usedIn: ["Course: Systematic Review Protocol Design"],
  },
  {
    id: "media-lte",
    fileName: "sample-lte-recap.webp",
    type: "image/webp",
    sizeLabel: "149 KB",
    src: lteImg,
    usedIn: ["Course: Letter to the Editor Workshop"],
  },
  {
    id: "media-research-week",
    fileName: "sample-research-week.webp",
    type: "image/webp",
    sizeLabel: "201 KB",
    src: researchWeekImg,
    usedIn: ["Event: Demo research week kickoff", "Update: Sample recap"],
  },
  {
    id: "media-campus",
    fileName: "sample-campus-ambassadors.webp",
    type: "image/webp",
    sizeLabel: "177 KB",
    src: campusImg,
    usedIn: ["Event: Sample campus ambassador info session"],
  },
  {
    id: "media-city-rep",
    fileName: "sample-city-representatives.webp",
    type: "image/webp",
    sizeLabel: "168 KB",
    src: cityRepImg,
    usedIn: ["Update: Sample community notice"],
  },
  {
    id: "media-minds",
    fileName: "sample-medx-minds.webp",
    type: "image/webp",
    sizeLabel: "155 KB",
    src: mindsImg,
    usedIn: [],
  },
  {
    id: "media-officers",
    fileName: "sample-officer-recruitment.webp",
    type: "image/webp",
    sizeLabel: "190 KB",
    src: officersImg,
    usedIn: ["Event: Sample conference prep session"],
  },
];

export const DEMO_COURSES: Course[] = [
  {
    id: "course-1",
    title: "SRMA Foundations",
    category: "Research Methods",
    description:
      "Sample course covering the first steps of a systematic review and meta-analysis: framing a question, searching, and screening.",
    startDate: "2026-11-04",
    status: "published",
    lastUpdated: "2026-10-21T09:30:00.000Z",
    imageId: "media-srma",
    registrationUrl: "https://example.org/medx-demo/srma-foundations",
  },
  {
    id: "course-2",
    title: "Manuscript Writing Essentials",
    category: "Academic Writing",
    description:
      "A sample workshop on structuring a manuscript, reporting standards, and responding to reviewer feedback.",
    startDate: "2026-11-18",
    status: "published",
    lastUpdated: "2026-10-19T13:10:00.000Z",
    imageId: "media-basics",
    registrationUrl: "https://example.org/medx-demo/manuscript-writing",
  },
  {
    id: "course-3",
    title: "SPSS for Medical Research",
    category: "Data & Analysis",
    description:
      "Draft sample course introducing descriptive statistics, common tests, and clean data workflows in SPSS.",
    startDate: "2026-12-02",
    status: "draft",
    lastUpdated: "2026-10-17T16:45:00.000Z",
    imageId: null,
    registrationUrl: "",
  },
  {
    id: "course-4",
    title: "Letter to the Editor Workshop",
    category: "Academic Writing",
    description:
      "Sample workshop on the structure and purpose of letters to the editor, journal selection, and submission.",
    startDate: "2026-12-09",
    status: "published",
    lastUpdated: "2026-10-15T08:20:00.000Z",
    imageId: "media-lte",
    registrationUrl: "https://example.org/medx-demo/lte-workshop",
  },
  {
    id: "course-5",
    title: "Systematic Review Protocol Design",
    category: "Research Methods",
    description:
      "Draft sample course on registering a review protocol, defining eligibility criteria, and planning extraction.",
    startDate: "2027-01-13",
    status: "draft",
    lastUpdated: "2026-10-12T11:00:00.000Z",
    imageId: "media-basics",
    registrationUrl: "",
  },
  {
    id: "course-6",
    title: "AI-Assisted Literature Screening",
    category: "Technology",
    description:
      "Draft sample course exploring how assisted screening tools can support - never replace - human review decisions.",
    startDate: "2027-01-27",
    status: "draft",
    lastUpdated: "2026-10-10T15:25:00.000Z",
    imageId: null,
    registrationUrl: "",
  },
];

export const DEMO_NEWS: NewsUpdate[] = [
  {
    id: "news-1",
    title: "Sample update: new research methods cohort",
    category: "Program",
    body:
      "This is fictional sample content for the admin preview. It demonstrates how a program update would appear once a content manager publishes it.",
    date: "2026-10-20",
    status: "published",
    lastUpdated: "2026-10-20T10:00:00.000Z",
    imageId: "media-srma",
  },
  {
    id: "news-2",
    title: "Demo partner spotlight: sample collaboration",
    category: "Partnership",
    body:
      "Sample announcement used only to preview the editor. No real partnership, commitment, or date is represented here.",
    date: "2026-10-14",
    status: "published",
    lastUpdated: "2026-10-14T12:30:00.000Z",
    imageId: "media-officers",
  },
  {
    id: "news-3",
    title: "Sample community notice: city rep meetup",
    category: "Community",
    body:
      "Fictional sample notice describing a local community meetup. Replace or delete this item when reviewing the mockup.",
    date: "2026-10-08",
    status: "draft",
    lastUpdated: "2026-10-08T09:15:00.000Z",
    imageId: "media-city-rep",
  },
  {
    id: "news-4",
    title: "Draft: upcoming education pathway series",
    category: "Announcement",
    body:
      "Draft sample announcement for a future education series. It stays hidden from any public view because it is only demo state.",
    date: "2026-10-02",
    status: "draft",
    lastUpdated: "2026-10-02T17:40:00.000Z",
    imageId: null,
  },
  {
    id: "news-5",
    title: "Sample recap: research week sessions",
    category: "Program",
    body:
      "A fictional recap used to preview longer body copy, image selection, and the published status in the updates list.",
    date: "2026-09-26",
    status: "published",
    lastUpdated: "2026-09-26T14:05:00.000Z",
    imageId: "media-research-week",
  },
];

export const DEMO_EVENTS: EventItem[] = [
  {
    id: "event-1",
    title: "Sample SRMA lecture: protocol basics",
    category: "Workshop",
    date: "2026-11-07",
    time: "18:00",
    timezone: "PKT",
    locationType: "Virtual",
    location: "Online (sample link)",
    description:
      "Fictional sample lecture for previewing the event editor. No registration is collected anywhere in this mockup.",
    status: "published",
    lastUpdated: "2026-10-22T08:45:00.000Z",
    registrationUrl: "https://example.org/medx-demo/events/srma-lecture",
    imageId: "media-srma",
  },
  {
    id: "event-2",
    title: "Demo research week kickoff",
    category: "Workshop",
    date: "2026-11-20",
    time: "20:00",
    timezone: "PKT",
    locationType: "Hybrid",
    location: "Sample Campus Hall + online",
    description:
      "Sample multi-day research program kickoff. All dates, venues, and links are placeholders for layout review only.",
    status: "published",
    lastUpdated: "2026-10-21T11:20:00.000Z",
    registrationUrl: "https://example.org/medx-demo/events/research-week",
    imageId: "media-research-week",
  },
  {
    id: "event-3",
    title: "Sample conference prep session",
    category: "Conference",
    date: "2026-12-04",
    time: "17:30",
    timezone: "UTC",
    locationType: "Virtual",
    location: "Online (sample link)",
    description:
      "Draft sample session on abstract preparation and conference planning. This item is not published anywhere.",
    status: "draft",
    lastUpdated: "2026-10-18T15:00:00.000Z",
    registrationUrl: "",
    imageId: "media-officers",
  },
  {
    id: "event-4",
    title: "Sample campus ambassador info session",
    category: "Recruitment",
    date: "2026-12-12",
    time: "16:00",
    timezone: "EST",
    locationType: "Virtual",
    location: "Online (sample link)",
    description:
      "Fictional information session for previewing recruitment-style events and time-zone fields.",
    status: "published",
    lastUpdated: "2026-10-16T10:10:00.000Z",
    registrationUrl: "https://example.org/medx-demo/events/ambassador-info",
    imageId: "media-campus",
  },
  {
    id: "event-5",
    title: "Sample community research showcase",
    category: "Community",
    date: "2027-01-09",
    time: "10:00",
    timezone: "PKT",
    locationType: "In person",
    location: "Sample University Auditorium",
    description:
      "Draft sample showcase for previewing in-person event fields. Venue details are fictional.",
    status: "draft",
    lastUpdated: "2026-10-09T09:25:00.000Z",
    registrationUrl: "",
    imageId: null,
  },
  {
    id: "event-6",
    title: "Past sample event: manuscript clinic",
    category: "Workshop",
    date: "2026-09-18",
    time: "19:00",
    timezone: "PKT",
    locationType: "Virtual",
    location: "Online (sample link)",
    description:
      "A past sample event included so the upcoming-events logic can be checked against the full list.",
    status: "published",
    lastUpdated: "2026-09-18T12:00:00.000Z",
    registrationUrl: "https://example.org/medx-demo/events/manuscript-clinic",
    imageId: "media-lte",
  },
];

export const DEMO_ACCOUNT = {
  name: "Sample Content Manager",
  email: "sample.manager@example.org",
  role: "Demo profile · not a real login",
} as const;
