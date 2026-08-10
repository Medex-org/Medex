import type { MentorProfile } from "@/components/shared/profile-modal";

import abdulMoizImg from "@assets/abdul-moiz-photo.webp";
import zohaibHassanImg from "@assets/zohaib-hassan-photo.webp";
import taroobaKhanImg from "@assets/tarooba-khan-photo.webp";
import amnaAhmedImg from "@assets/amna-ahmed-photo.webp";

/**
 * Research mentors & team, per the Department of Research spec.
 * Sasha Zaki and Bisma Bashir have no headshot on file yet (only a
 * promotional poster exists for Sasha Zaki) - per the media assets policy,
 * posters are never substituted for profile photos, so `image` is left null
 * and the shared profile UI falls back to a plain avatar placeholder.
 */
export const RESEARCH_MENTORS: MentorProfile[] = [
  {
    name: "Sasha Zaki",
    role: "Research Mentor · Senior Advisor · LTE Lead",
    image: null,
    bio: "Senior research advisor and one of two leads on the LTE Mentorship track, guiding cohorts through systematic review methodology, manuscript preparation, and the path to publication.",
  },
  {
    name: "Bisma Bashir",
    role: "Research Mentor · LTE Lead",
    image: null,
    bio: "Research mentor and co-lead on the LTE Mentorship track, working directly with mentees on study design, data analysis, and structured feedback through to submission.",
  },
  {
    name: "Abdul Moiz",
    role: "Programs Officer · SRMA Mentor",
    image: abdulMoizImg,
    bio: "SRMA mentor and Programs Officer who has moderated MEDX's collaborative Research Week sessions, guiding students through topic selection, data analysis, and manuscript writing.",
  },
  {
    name: "Zohaib Hassan",
    role: "Research Mentor",
    image: zohaibHassanImg,
    bio: "Research mentor supporting MEDX cohorts through the systematic review and meta-analysis process, from protocol design to submission.",
  },
  {
    name: "Tarooba Khan",
    role: "Chief Research Officer · SRMA Project Lead",
    image: taroobaKhanImg,
    bio: "Chief Research Officer at MEDX, currently leading SRMA Project-1 - MEDX's flagship active systematic review and meta-analysis - while mentoring students through the research pipeline.",
  },
  {
    name: "Amna Ahmed",
    role: "Director of Research",
    image: amnaAhmedImg,
    bio: "Director of Research at MEDX, overseeing the organization's research programs and supporting mentees across active cohorts and projects.",
  },
];
