import type { RepEntry } from "@/components/shared/regional-dashboard";

/**
 * City Representatives & Campus Ambassadors, grouped for the regional
 * dashboard. Per the data clean-up instructions: Sangeen Khan is excluded
 * from the City Rep display (he's MEDX's Founder/CEO, listed on the
 * governance page instead), and Rida Shaikh & Zeenat Bibi are excluded from
 * the Campus Ambassador roster.
 */
export const REGIONAL_LEADERSHIP: RepEntry[] = [
  // ── City Representatives ──────────────────────────────────────────
  {
    name: "Abdul Waseh Khan",
    role: "City Representative",
    country: "Pakistan",
    state: "Khyber Pakhtunkhwa",
    city: "Abbottabad",
    campus: "AIMC Abbottabad",
  },
  {
    name: "Rishmi Ayodhya Sri Wijebandara",
    role: "City Representative",
    country: "Sri Lanka",
    state: "Western Province",
    city: "Colombo",
    campus: "Edgehill University UK",
  },
  {
    name: "Mahrukh Randhawa",
    role: "City Representative",
    country: "Pakistan",
    state: "Punjab",
    city: "Faisalabad",
    campus: "Aziz Fatima Medical College",
  },
  {
    name: "Stefanny Yelitzha Lopez Prada",
    role: "City Representative",
    country: "Colombia",
    state: "Santander",
    city: "Bucaramanga",
    campus: "UNAB",
  },
  {
    name: "Ghulam Dastagir",
    role: "City Representative",
    country: "Pakistan",
    state: "Khyber Pakhtunkhwa",
    city: "D.I. Khan",
    campus: "BMC Quetta",
  },
  {
    name: "Laksh Anand Lasi",
    role: "City Representative",
    country: "Pakistan",
    state: "Sindh",
    city: "Karachi",
    campus: "Bolan Medical College",
  },
  {
    name: "Muhammad Abubakar",
    role: "City Representative",
    country: "Pakistan",
    state: "Punjab",
    city: "Sialkot",
    campus: "KMSMC Sialkot",
  },
  {
    name: "Ibrahim",
    role: "City Representative",
    country: "Canada",
    state: "Unspecified Region",
    city: "Canada",
    campus: "General",
  },

  // ── Campus Ambassadors ────────────────────────────────────────────
  {
    name: "Farheen Kausar Khattak",
    role: "Campus Ambassador",
    country: "Pakistan",
    state: "Khyber Pakhtunkhwa",
    city: "Peshawar",
    campus: "KMC Peshawar",
  },
  {
    name: "Afza Ilyas Kamboh",
    role: "Campus Ambassador",
    country: "Pakistan",
    state: "Balochistan",
    city: "Quetta",
    campus: "BMC Quetta",
  },
  {
    name: "Aiss Talib",
    role: "Campus Ambassador",
    country: "Pakistan",
    state: "Punjab",
    city: "Multan",
    campus: "CMH Multan",
  },
  {
    name: "Tooba Maqsood",
    role: "Campus Ambassador",
    country: "Pakistan",
    state: "Punjab",
    city: "Rawalpindi",
    campus: "Rawalpindi Medical University",
  },
  {
    name: "Fareeha Awan",
    role: "Campus Ambassador",
    country: "Pakistan",
    state: "Punjab",
    city: "Lahore",
    campus: "Fatima Jinnah Medical University",
  },
];
