import { profile } from "./profile";

/** The sections of the page, in order. The nav bar and page.tsx both read this list. */
export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "certifications", label: "Certifications" },
  { id: "beyond", label: "Beyond Code" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Public links (GitHub, LinkedIn, CV) come from profile.ts. No phone number, ever. */
export const LINKS = profile.links;
