import type { HierarchyPerson } from "@/components/shared/hierarchy-card";

import sangeenImg from "@assets/sangeen-khan-photo.webp";
import ifzaImg from "@assets/ifza-zia-photo.webp";
import sohamImg from "@assets/soham-biren-photo.webp";
import smyanImg from "@assets/smyan-reddy-photo.webp";
import shanmukaImg from "@assets/shanmuka-gottimukkala-photo.webp";
import taroobaImg from "@assets/tarooba-khan-photo.webp";
import kamilImg from "@assets/kamil-sheikh-photo.webp";
import momImg from "@assets/syeda-momina-photo.webp";
import amnaImg from "@assets/amna-ahmed-photo.webp";
import anshikaImg from "@assets/anshika-jaiswal-photo.webp";
import fahimaImg from "@assets/fahima-hossain-muna-photo.webp";
import shehzadImg from "@assets/muhammad-shehzad-photo.webp";
import monishaImg from "@assets/monisha-pathi-photo.webp";
import aruzhanImg from "@assets/aruzhan-maratova-photo.webp";
import zohaibHassanImg from "@assets/zohaib-hassan-photo.webp";
import abdulMoizImg from "@assets/abdul-moiz-photo.webp";

export interface HierarchyLevel {
  title: string;
  people: HierarchyPerson[];
}

/**
 * Structure and every role/person assignment below follows the finalized
 * org blueprint exactly (see docs/superpowers/specs/2026-08-02-medx-
 * finalization-design.md for the full audit this was rewritten from).
 *
 * NOT resolved here, by design - see the design doc's "Decisions" and
 * "Blocked" sections: personal LinkedIn/Instagram URLs (none on file for
 * anyone), "Shaikh Kamil" name order (used as the blueprint states it), and
 * Soham Biren's CIO title (blueprint omits "Co-Founder &" for this role
 * specifically, unlike Ifza's; followed literally but flagged for a second
 * look since it changes how a real person is publicly credited).
 */
export const GOVERNANCE: HierarchyLevel[] = [
  {
    title: "Executive Board (C-Suite)",
    people: [
      {
        name: "Sangeen Khan Mandokhail",
        role: "Founder & Chief Executive Officer (CEO)",
        image: sangeenImg,
        intro:
          "Founded MEDX R&Ed to give medical students structured access to research methodology, mentorship, and a global peer network.",
      },
      {
        name: "Ifza Zia",
        role: "Co-Founder & Chief Operational Officer (COO)",
        image: ifzaImg,
        intro: "Co-founder overseeing MEDX's day-to-day operations across departments and chapters.",
      },
      {
        name: "Soham Biren",
        role: "Chief Internal Officer (CIO)",
        image: sohamImg,
        intro: "Co-founder shaping MEDX's information and technology strategy.",
      },
      {
        name: "Smyan Reddy",
        role: "Chief Advisor (CA)",
        image: smyanImg,
        intro: "Advises MEDX leadership across strategy and program direction.",
      },
      {
        name: "Tarooba Khan",
        role: "Chief Research Officer (CRO)",
        image: taroobaImg,
        intro: "Leads MEDX's research strategy and currently heads SRMA Project-1.",
      },
      {
        name: "Aruzhan Maratova",
        role: "Chief Tech Officer (CTO)",
        image: aruzhanImg,
        intro: "Leads MEDX's technology direction, including the centralized LMS.",
      },
      {
        name: "Imad Khan",
        role: "Chief Officer MEDX Education (CO.ME)",
        image: null,
        intro: "Leads MEDX's education strategy across academic programs and Higher Pathways guidance.",
      },
      {
        name: "Shaikh Kamil",
        role: "Chief External Affairs and Partnerships Officer (CEPO)",
        image: kamilImg,
        intro: "Leads MEDX's strategic partnerships and external collaborations.",
      },
      {
        name: "Open Position",
        role: "Chief Officer MEDX Minds (Co.MM)",
        image: null,
        vacant: true,
      },
      {
        name: "Open Position",
        role: "Chief Officer Medical Exchange (CO.MX)",
        image: null,
        vacant: true,
      },
    ],
  },
  {
    title: "Directors",
    people: [
      {
        name: "Rakshitha Lokesh",
        role: "Director Education",
        image: null,
        intro: "Directs MEDX's education programs and academic outreach.",
      },
      {
        name: "Amna Ahmed",
        role: "Director Research",
        image: amnaImg,
        intro: "Directs MEDX's research programs and supports mentees across active cohorts.",
      },
      {
        name: "Anshika Jaiswal",
        role: "Director Media",
        image: anshikaImg,
        intro: "Directs MEDX's media output and visual storytelling.",
      },
      {
        name: "Open Position",
        role: "Director Medical Exchange",
        image: null,
        vacant: true,
      },
      {
        name: "Open Position",
        role: "Director MEDX Minds",
        image: null,
        vacant: true,
      },
      {
        name: "Shanmuka Gottimukkala",
        role: "Director Web & Tech",
        image: shanmukaImg,
        intro: "Directs MEDX's website and technical infrastructure.",
      },
      {
        name: "Syeda Momina Bokhari",
        role: "Director External Affairs and Partnerships",
        image: momImg,
        intro: "Directs MEDX's external affairs and strategic partnerships.",
      },
    ],
  },
  {
    title: "Heads of Departments",
    people: [
      {
        name: "Monisha Pathi",
        role: "Head Web & Tech",
        image: monishaImg,
        intro: "Leads MEDX's website and technical infrastructure.",
      },
      {
        name: "Muhammad Shehzad",
        role: "Head Media",
        image: shehzadImg,
        intro: "Leads MEDX's visual identity, poster design, and content production.",
      },
      {
        name: "Open Position",
        role: "Head Research",
        image: null,
        vacant: true,
      },
      {
        name: "Fahima Hossain Muna",
        role: "Head Education",
        image: fahimaImg,
        intro: "Leads MEDX's education content and communications.",
      },
      {
        name: "Arooba Saqib",
        role: "Head MEDX Minds",
        image: null,
        intro: "Leads MEDX Minds' department programs, webinars, and peer support initiatives.",
      },
      {
        name: "Open Position",
        role: "Head Medical Exchange",
        image: null,
        vacant: true,
      },
      {
        name: "Open Position",
        role: "Head External Affairs and Partnerships",
        image: null,
        vacant: true,
      },
    ],
  },
  {
    title: "Mentorship Board",
    people: [
      {
        name: "Dr. Sasha Zaki",
        role: "Research Mentor · Senior Advisor · LTE Lead",
        image: null,
        intro:
          "Senior research advisor and one of two leads on the LTE Mentorship track, guiding cohorts through systematic review methodology, manuscript preparation, and the path to publication.",
      },
      {
        name: "Bisma Bashir",
        role: "Research Mentor · LTE Lead",
        image: null,
        intro:
          "Research mentor and co-lead on the LTE Mentorship track, working directly with mentees on study design, data analysis, and structured feedback through to submission.",
      },
      {
        name: "Zohaib Hassan",
        role: "Research Mentor",
        image: zohaibHassanImg,
        intro: "Research mentor supporting MEDX cohorts through the systematic review and meta-analysis process, from protocol design to submission.",
      },
      {
        name: "Abdul Moiz",
        role: "Programs Officer · SRMA Mentor",
        image: abdulMoizImg,
        intro: "SRMA mentor and Programs Officer who has moderated MEDX's collaborative Research Week sessions.",
      },
    ],
  },
];
