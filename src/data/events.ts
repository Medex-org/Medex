import { LINKS } from "@/config/links";
import researchWeekDay1 from "@assets/nsri-and-medx-announces-complete-research-week.webp";
import lteFlyer from "@assets/collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp";
import campusAmbFlyer from "@assets/medx-join-us-as-campus-ambassadors.webp";

export const EVENT_CATEGORIES = [
  "Conference",
  "Workshop",
  "Recruitment",
  "Community",
] as const;

export type EventType = (typeof EVENT_CATEGORIES)[number];

export type EventFilter = EventType | "All";

export type EventStatus = "Upcoming" | "Ongoing" | "Completed" | "Open";

export interface EventItem {
  name: string;
  type: EventType;
  status: EventStatus;
  date: string;
  desc: string;
  image: string | null;
  link: string | null;
  linkLabel: string | null;
}

export const EVENTS: EventItem[] = [
  {
    name: "ASH Annual Meeting",
    type: "Conference",
    status: "Upcoming",
    date: "TBA - Dec 2026",
    desc: "MEDX R&Ed is preparing participants for the American Society of Hematology Annual Meeting - one of the premier global conferences in blood disorders research. Apply for mentorship and abstract preparation support.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "Apply for Mentorship",
  },
  {
    name: "SVIN Annual Meeting",
    type: "Conference",
    status: "Upcoming",
    date: "TBA",
    desc: "Society of Vascular and Interventional Neurology Annual Meeting. MEDX is coordinating participation and abstract submissions for students.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "Express Interest",
  },
  {
    name: "MEDX × NSRI Complete Research Week",
    type: "Workshop",
    status: "Ongoing",
    date: "July 20–26, 2026 · 10PM PKT",
    desc: "6-day intensive online research program in collaboration with NSRI BUMHS-LC. Covering Cross-Sectional Studies, SPSS Data Analysis, Manuscript Writing, and more. Mentors: Dr. Rida Noor & Abdul Moiz.",
    image: researchWeekDay1,
    link: "https://docs.google.com/forms/d/e/1FAIpQLSfCvfQnpyB96EkLhmeIVv8JZl3VOeSBSQITBiBNa3R5FydsBQ/viewform",
    linkLabel: "View Program",
  },
  {
    name: "LTE Free Workshop - Letter to the Editor",
    type: "Workshop",
    status: "Completed",
    date: "July 18, 2026 · 10PM PKT",
    desc: "Free session on Letter to the Editor writing - what it is, structure, journal selection, and submission process. Speaker: Imad Khan (North West School of Medicine, Peshawar, 5+ Publications).",
    image: lteFlyer,
    link: null,
    linkLabel: null,
  },
  {
    name: "SRMA Free Lecture Series",
    type: "Workshop",
    status: "Ongoing",
    date: "Recurring · 8PM PKT",
    desc: "Free introductory lectures on systematic review and meta-analysis methodology. Open to all. Sessions held regularly - check MEDX channels for the next scheduled session.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "Register",
  },
  {
    name: "MEDX Website Official Launch",
    type: "Community",
    status: "Upcoming",
    date: "Monday (Announced)",
    desc: "Official MEDX website launch - a live session with the global team and a guest speaker. Registration open.",
    image: null,
    link: LINKS.membershipForm,
    linkLabel: "RSVP",
  },
  {
    name: "Campus Ambassador Recruitment Drive",
    type: "Recruitment",
    status: "Open",
    date: "Ongoing",
    desc: "MEDX is recruiting Campus Ambassadors across institutions worldwide. Be the voice of MEDX in your institution - expand the global network, lead initiatives, and develop leadership skills.",
    image: campusAmbFlyer,
    link: LINKS.campusAmbassadorForm,
    linkLabel: "Apply Now",
  },
];

/** Filter options shown above the event cards. `value: "All"` shows every event. */
export const EVENT_FILTERS: { value: EventFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Workshop", label: "Workshops" },
  { value: "Conference", label: "Conferences" },
  { value: "Recruitment", label: "Recruitment" },
  { value: "Community", label: "Community" },
];
