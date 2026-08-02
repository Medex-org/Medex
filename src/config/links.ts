/**
 * Centralized, hardcoded external links for MEDX R&Ed.
 * Swap a value here to update it everywhere on the site.
 *
 * Entries marked "NEEDS REAL LINK" are placeholders - they currently point at
 * the Membership Application Form (the closest known real destination) until
 * MEDX provides the dedicated URL.
 */

const MEMBERSHIP_FORM =
  "https://forms.gle/yJzGnk4DwmWysygv9";

const MENTEE_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSe-BjOnNLFh69zvHYdOU9rfRtm7AJhjn_cbgXL9qg2GGQQ6LA/viewform?usp=header";

export const LINKS = {
  /** Applications */
  membershipForm: MEMBERSHIP_FORM,
  menteeForm: MENTEE_FORM,
  // NEEDS REAL LINK - fallback to the membership form until MEDX supplies a
  // dedicated City Representative application form.
  cityRepForm: MEMBERSHIP_FORM,
  // NEEDS REAL LINK - fallback to the membership form until MEDX supplies a
  // dedicated Campus Ambassador application form.
  campusAmbassadorForm: MEMBERSHIP_FORM,

  /** Strategic partners */
  partners: {
    metasphere: "https://www.linkedin.com/company/metasphere-official/",
    gradmeta: "https://www.linkedin.com/company/gradmeta/",
  },

  /** Global footer socials */
  social: {
    linkedin:
      "https://www.linkedin.com/company/medx-medical-exchange-research-and-education",
    instagram: "https://www.instagram.com/medxresearch_education",
    whatsappCommunity: "https://chat.whatsapp.com/Gxqcdg1itm1La2Yt2d1EdO",
    whatsappChannel: "https://whatsapp.com/channel/0029VbAYOnk7DAWpfVCs8V1Y",
  },

  email: "connect@medx.org",
} as const;

export const BRAND = {
  motto: "Together we turn Curiosity, into Discovery",
  mottoTagline: "Learn · Research · Exchange · Innovate · Inspire",
} as const;
