import {
  FlaskConical,
  GraduationCap,
  Globe2,
  Cpu,
  Handshake,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

export interface Department {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
}

/** The 6 core domains MEDX R&Ed's routing and navigation are organized around. */
export const DEPARTMENTS: Department[] = [
  {
    slug: "research",
    href: "/research",
    name: "Department of Research",
    shortName: "Research",
    icon: FlaskConical,
    tagline: "SRMA Mentorship · Cohorts · Publication",
    description:
      "Structured mentorship and cohort programs guiding students from methodology basics to published, peer-reviewed research.",
  },
  {
    slug: "education",
    href: "/education",
    name: "Department of Education",
    shortName: "Education & Higher Pathways",
    icon: GraduationCap,
    tagline: "Academic Programs · Higher Pathways",
    description:
      "Health awareness, clinical skills training, evidence-based study materials, and guidance for USMLE, PLAB, AMC & Gulf licensing.",
  },
  {
    slug: "medical-exchange",
    href: "/medical-exchange",
    name: "Department of Medical Exchange",
    shortName: "Medical Exchange",
    icon: Globe2,
    tagline: "SUSI · UGRAD · Global Electives",
    description:
      "International exchange placements, electives, and observership announcements connecting students across borders.",
  },
  {
    slug: "technology",
    href: "/technology",
    name: "Department of Technology & Innovation",
    shortName: "Technology & Innovation",
    icon: Cpu,
    tagline: "Centralized LMS · AI Study Companion",
    description:
      "The technology backbone of MEDX - a centralized learning platform with course tracking, certificates, and AI-assisted study tools.",
  },
  {
    slug: "partnerships",
    href: "/partnerships",
    name: "Department of Partnerships & External Affairs",
    shortName: "Partnerships & External Affairs",
    icon: Handshake,
    tagline: "Strategic Collaborations",
    description:
      "Building and stewarding MEDX's strategic collaborations with institutions, forums, and organizations worldwide.",
  },
  {
    slug: "medx-minds",
    href: "/medx-minds",
    name: "Department of MEDX Minds",
    shortName: "MEDX Minds",
    icon: HeartHandshake,
    tagline: "Mental Health & Wellbeing",
    description:
      "Dedicated to student mental health - burnout prevention, resilience, peer community, and storytelling.",
  },
];
