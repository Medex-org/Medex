import {
  BarChart3,
  BookOpen,
  Cpu,
  Globe2,
  HeartHandshake,
  HelpCircle,
  Layers,
  Library,
  Plane,
  Search,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface ResearchStep {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
}

export interface ResearchTopic {
  title: string;
  description: string;
  href: string;
  tag: string;
  icon: LucideIcon;
}

export interface ResearchAction {
  title: string;
  detail: string;
  href?: string;
}

export interface ResearchPath {
  id: string;
  label: string;
  headline: string;
  description: string;
  actions: ResearchAction[];
}

export interface ResearchFaq {
  question: string;
  answer: string;
}

export const RESEARCH_STEPS: ResearchStep[] = [
  {
    id: "question",
    title: "Find a question",
    summary: "Turn a broad interest into one focused, answerable question.",
    icon: HelpCircle,
  },
  {
    id: "literature",
    title: "Map the literature",
    summary: "Find what is already known, what is missing, and what is feasible.",
    icon: Search,
  },
  {
    id: "design",
    title: "Choose a design",
    summary: "Match your question to a method you can realistically deliver.",
    icon: Layers,
  },
  {
    id: "ethics",
    title: "Plan ethics and data",
    summary: "Protect participants and keep every decision documented.",
    icon: ShieldCheck,
  },
  {
    id: "analysis",
    title: "Analyse and check",
    summary: "Use methods you understand and keep the process reproducible.",
    icon: BarChart3,
  },
  {
    id: "publish",
    title: "Write and share",
    summary: "Report clearly, credit fairly, and respond to review.",
    icon: Send,
  },
];

export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    title: "Clinical Research Fundamentals",
    description: "Definitions, study designs, and how trustworthy evidence is built.",
    href: "/education/what-is-clinical-research/",
    tag: "Foundation",
    icon: BookOpen,
  },
  {
    title: "Systematic Reviews & Meta-Analysis",
    description: "Learn the SRMA workflow and join a structured research cohort.",
    href: "/research/",
    tag: "Method",
    icon: Library,
  },
  {
    title: "Global Health Research",
    description: "Design equitable, cross-border projects without extractive habits.",
    href: "/education/global-health-research/",
    tag: "Global",
    icon: Globe2,
  },
  {
    title: "Medical Exchange",
    description: "Understand rotations, eligibility, and responsible global learning.",
    href: "/education/medical-exchange-guide/",
    tag: "Exchange",
    icon: Plane,
  },
  {
    title: "AI & Research Tools",
    description: "See how MEDX uses technology to support research learning.",
    href: "/technology/",
    tag: "Technology",
    icon: Cpu,
  },
  {
    title: "Researcher Wellbeing",
    description: "Build sustainable habits and support for the long road ahead.",
    href: "/medx-minds/",
    tag: "Wellbeing",
    icon: HeartHandshake,
  },
];

export const RESEARCH_PATHS: ResearchPath[] = [
  {
    id: "new",
    label: "I'm new to research",
    headline: "Start with orientation, not pressure.",
    description:
      "You do not need a finished idea. Build vocabulary, read one paper carefully, and ask for a small, supervised first task.",
    actions: [
      {
        title: "Read the fundamentals",
        detail: "Understand what clinical research is and how studies are designed.",
        href: "/education/what-is-clinical-research/",
      },
      {
        title: "Join an introductory session",
        detail: "Watch for MEDX workshops and research-week sessions.",
        href: "/events/",
      },
      {
        title: "Ask for a small first role",
        detail: "Literature search, data checks, or recruitment support are real contributions.",
        href: "/research/#applications",
      },
      {
        title: "Find a mentor",
        detail: "Bring a specific interest and a realistic weekly time commitment.",
        href: "/research/#mentorship",
      },
    ],
  },
  {
    id: "topic",
    label: "I have a topic",
    headline: "Turn the idea into a protocol.",
    description:
      "A topic becomes research when you can name the population, exposure or intervention, comparator, and outcome.",
    actions: [
      {
        title: "Write a PICO or PEO question",
        detail: "Keep it narrow enough to finish and specific enough to answer.",
      },
      {
        title: "Map the evidence",
        detail: "Read recent reviews and original studies, then state the gap in one paragraph.",
        href: "/education/global-health-research/",
      },
      {
        title: "Choose a feasible design",
        detail: "Review, cross-sectional, cohort, case report, or qualitative study.",
        href: "/research/",
      },
      {
        title: "Draft a one-page protocol",
        detail: "Question, population, outcomes, timeline, team, and ethics needs.",
      },
    ],
  },
  {
    id: "publish",
    label: "I want to publish",
    headline: "Plan the output before the analysis.",
    description:
      "Publication starts with a clear question, a reporting guideline, and an authorship conversation, not after the data arrive.",
    actions: [
      {
        title: "Pick the right format",
        detail: "A systematic review, original study, case report, or conference abstract.",
        href: "/research/",
      },
      {
        title: "Choose a reporting guideline",
        detail: "PRISMA, STROBE, CARE, or the guideline that fits your design.",
      },
      {
        title: "Agree authorship early",
        detail: "Discuss order, contributions, and who will handle submission.",
      },
      {
        title: "Build a writing routine",
        detail: "Use the Compass checklist to keep the project moving.",
        href: "/research/#tracker",
      },
    ],
  },
];

export const RESEARCH_CHECKLIST = [
  "Write your research question in one sentence.",
  "Read ten recent papers and note the gap.",
  "Create a reference library for the project.",
  "Discuss scope and feasibility with a mentor.",
  "Check whether ethics approval is required.",
  "Choose the reporting guideline for your design.",
  "Agree authorship, timeline, and next steps.",
  "Set a weekly writing or analysis block.",
];

export const RESEARCH_FAQS: ResearchFaq[] = [
  {
    question: "Do I need previous research experience to start?",
    answer:
      "No. Most students begin with literature searches, data checking, recruitment support, or ethics documentation. The important things are supervision, reliability, and a clear understanding of your role.",
  },
  {
    question: "How long does a first research project take?",
    answer:
      "It depends on the design. A secondary analysis or review may take a few months; a prospective study with recruitment and follow-up can take much longer. Plan backwards from your deadline and choose a feasible scope.",
  },
  {
    question: "Can I publish without a lab?",
    answer:
      "Yes. Systematic reviews, secondary analyses, case reports, qualitative work, and health services research can be done without a bench lab. You still need mentorship, ethics review where required, and a credible reporting plan.",
  },
  {
    question: "What should I do first?",
    answer:
      "Choose one focused question, read recent literature, and speak to a mentor about a small, realistic contribution. Use the six-step Research Compass above to decide what to do next.",
  },
];
