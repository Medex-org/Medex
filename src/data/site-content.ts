import { LINKS } from "@/config/links";
import { mediaUrl } from "@/lib/media-url";

export interface SiteAchievement {
  id: string;
  title: string;
  badge: string;
  description: string;
  image: string | null;
}

export interface SiteNewsHighlight {
  id: string;
  title: string;
  description: string;
}

export interface SiteWebinar {
  id: string;
  title: string;
  cadence: string;
  description: string;
}

export interface SiteEventBanner {
  id: string;
  label: string;
  href: string;
  image: string | null;
}

export interface SitePartner {
  id: string;
  name: string;
  description: string;
  linkedinUrl?: string;
  image: string | null;
}

export interface SiteGlobalOfficer {
  id: string;
  name: string;
  role: string;
  intro: string;
  image: string | null;
  linkedinUrl?: string;
}

export interface SiteCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  registrationUrl: string;
}

export interface SiteEvent {
  id: string;
  name: string;
  type: string;
  status: string;
  date: string;
  desc: string;
  image: string | null;
  link: string | null;
  linkLabel: string | null;
}

export interface SiteUpdate {
  id: string;
  title: string;
  category: string;
  body: string;
  date: string;
  image: string | null;
}

export const FALLBACK_ACHIEVEMENTS: SiteAchievement[] = [
  { id: "srma", title: "6-Lecture SRMA Workshop Series", badge: "Flagship", image: mediaUrl("medx-systematic-review-and-meta-analysis-project.webp"), description: "A structured six-lecture series on systematic review and meta-analysis methodology, from basics to publication." },
  { id: "lte", title: "LTE Recap & Interactive Q&A", badge: "Completed", image: mediaUrl("collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp"), description: "A recap session on Letter to the Editor writing with live, interactive Q&A - held in collaboration with NSRI." },
  { id: "research-basics", title: "Basics of Research & Publication", badge: "Ongoing", image: mediaUrl("medx-invites-you-to-join-free-workshop-basics-of-research-and-why-srma-mentorship-is-essential.webp"), description: "A free introductory workshop covering research fundamentals and why structured mentorship matters." },
  { id: "research-week", title: "Collaborative Research Week × NSRI BUMHS-LC", badge: "Featured", image: mediaUrl("nsri-and-medx-announces-complete-research-week.webp"), description: "A multi-day intensive research program co-hosted with NSRI BUMHS-LC, covering the full research pipeline." },
];

export const FALLBACK_EVENT_BANNERS: SiteEventBanner[] = [
  { id: "officers", image: mediaUrl("medx-calls-main-officers.webp"), label: "Global Main Officer Recruitment", href: "/team" },
  { id: "city-reps", image: mediaUrl("medx-announces-slots-for-city-representative.webp"), label: "City Representative Slots Open", href: "/city-reps" },
  { id: "campus", image: mediaUrl("medx-join-us-as-campus-ambassadors.webp"), label: "Campus Ambassador Recruitment", href: "/city-reps" },
  { id: "minds", image: mediaUrl("medx-minds-join-us-as-speakers-or-story-tellers.webp"), label: "MEDX Minds - Speakers & Storytellers", href: "/medx-minds" },
];

export const FALLBACK_NEWS_HIGHLIGHTS: SiteNewsHighlight[] = [
  { id: "srma-project", title: "SRMA Project-1 underway, led by Tarooba Khan", description: "MEDX's flagship active systematic review is progressing toward its September completion target." },
  { id: "research-week-news", title: "Research Week wraps with NSRI BUMHS-LC", description: "Students completed the full pipeline - from topic selection to manuscript writing and SPSS analysis." },
  { id: "gradmeta", title: "GradMeta partnership brings members free SR tooling", description: "MEDX members now get access to GradMeta's professional systematic review tool at no cost." },
];

export const FALLBACK_WEBINARS: SiteWebinar[] = [
  { id: "srma-series", title: "SRMA Free Lecture Series", cadence: "Recurring", description: "Free introductory lectures on systematic review and meta-analysis methodology, open to all." },
  { id: "lte-series", title: "LTE Lecture Series", cadence: "Ongoing Cohorts", description: "Structured lectures on Letter to the Editor writing and long-term mentorship engagement." },
];

export const FALLBACK_PARTNERS: SitePartner[] = [
  { id: "metasphere", name: "Metasphere Global", description: "AI-Powered Research & Education for Clinician-Scientists.", linkedinUrl: LINKS.partners.metasphere, image: null },
  { id: "gradmeta", name: "GradMeta", description: "AI-Powered Research Solutions", linkedinUrl: LINKS.partners.gradmeta, image: null },
  { id: "srf-aku", name: "SRF AKU", description: "Student Research Forum, Aga Khan University", image: null },
  { id: "nsri", name: "NSRI BUMHS-LC", description: "National Students Research Institution", image: null },
];

export const FALLBACK_COURSES: SiteCourse[] = [
  { id: "srma-foundations", title: "SRMA Foundations", category: "Research", description: "Systematic review and meta-analysis methodology.", registrationUrl: LINKS.membershipForm },
  { id: "manuscript-writing", title: "Manuscript Writing Essentials", category: "Research", description: "Practical manuscript writing skills for medical research.", registrationUrl: LINKS.membershipForm },
  { id: "spss", title: "SPSS for Medical Research", category: "Technology", description: "A practical introduction to SPSS data analysis.", registrationUrl: LINKS.membershipForm },
];

export const FALLBACK_EVENTS: SiteEvent[] = [
  { id: "ash", name: "ASH Annual Meeting", type: "Conference", status: "Upcoming", date: "TBA - Dec 2026", desc: "MEDX R&Ed is preparing participants for the American Society of Hematology Annual Meeting - one of the premier global conferences in blood disorders research. Apply for mentorship and abstract preparation support.", image: null, link: LINKS.membershipForm, linkLabel: "Apply for Mentorship" },
  { id: "svin", name: "SVIN Annual Meeting", type: "Conference", status: "Upcoming", date: "TBA", desc: "Society of Vascular and Interventional Neurology Annual Meeting. MEDX is coordinating participation and abstract submissions for students.", image: null, link: LINKS.membershipForm, linkLabel: "Express Interest" },
  { id: "research-week-event", name: "MEDX × NSRI Complete Research Week", type: "Workshop", status: "Ongoing", date: "July 20–26, 2026 · 10PM PKT", desc: "6-day intensive online research program in collaboration with NSRI BUMHS-LC. Covering Cross-Sectional Studies, SPSS Data Analysis, Manuscript Writing, and more. Mentors: Dr. Rida Noor & Abdul Moiz.", image: mediaUrl("nsri-and-medx-announces-complete-research-week.webp"), link: "https://docs.google.com/forms/d/e/1FAIpQLSfCvfQnpyB96EkLhmeIVv8JZl3VOeSBSQITBiBNa3R5FydsBQ/viewform", linkLabel: "View Program" },
  { id: "lte-event", name: "LTE Free Workshop - Letter to the Editor", type: "Workshop", status: "Completed", date: "July 18, 2026 · 10PM PKT", desc: "Free session on Letter to the Editor writing - what it is, structure, journal selection, and submission process. Speaker: Imad Khan (North West School of Medicine, Peshawar, 5+ Publications).", image: mediaUrl("collaboration-nsri-and-medx-LTE-recap-and-question-and-answer.webp"), link: null, linkLabel: null },
  { id: "srma-event", name: "SRMA Free Lecture Series", type: "Workshop", status: "Ongoing", date: "Recurring · 8PM PKT", desc: "Free introductory lectures on systematic review and meta-analysis methodology. Open to all. Sessions held regularly - check MEDX channels for the next scheduled session.", image: null, link: LINKS.membershipForm, linkLabel: "Register" },
  { id: "launch", name: "MEDX Website Official Launch", type: "Community", status: "Upcoming", date: "Monday (Announced)", desc: "Official MEDX website launch - a live session with the global team and a guest speaker. Registration open.", image: null, link: LINKS.membershipForm, linkLabel: "RSVP" },
  { id: "campus-event", name: "Campus Ambassador Recruitment Drive", type: "Recruitment", status: "Open", date: "Ongoing", desc: "MEDX is recruiting Campus Ambassadors across institutions worldwide. Be the voice of MEDX in your institution - expand the global network, lead initiatives, and develop leadership skills.", image: mediaUrl("medx-join-us-as-campus-ambassadors.webp"), link: LINKS.campusAmbassadorForm, linkLabel: "Apply Now" },
];
