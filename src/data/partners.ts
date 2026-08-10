import type { Partner } from "@/components/shared/partner-card";
import { LINKS } from "@/config/links";

/**
 * Strategic partners, shown per the strict "logo + 1-2 sentence description +
 * social link only" display rule. No transparent partner logo assets are on
 * file yet - cards fall back to a plain typographic mark rather than reusing
 * promotional flyer graphics as logos.
 */
export const PARTNERS: Partner[] = [
  {
    name: "Metasphere Global",
    description:
    "AI-Powered Research\n" +
    "& Education for\n" +
    "Clinician-Scientists.",
    linkedinUrl: LINKS.partners.metasphere,
  },
  {
    name: "GradMeta",
    description: "AI-Powered Research Solutions",
    linkedinUrl: LINKS.partners.gradmeta,
  },
  {
    name: "SRF AKU",
    description: "Student Research Forum, Aga Khan University",
  },
  {
    name: "NSRI BUMHS-LC",
    description: "National Students Research Institution",
  },
];
