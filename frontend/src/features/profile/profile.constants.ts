import type { JobSearchStatus, ProfileData } from "./profile.types"

export const DEFAULT_PROFILE: ProfileData = {
  fullName: "",
  headline: "Full Stack Engineer & Web Developer",
  location: "Manila, Philippines (Open to Remote)",
  phone: "+63 917 123 4567",
  bio: "Passionate engineer with experience building full-stack web applications using React, TypeScript, and Laravel. Focused on high-performance interfaces and scalable APIs.",
  status: "actively_looking",
  targetRoles: ["Full Stack Engineer", "Frontend Developer", "Software Engineer"],
  workplaceTypes: ["Remote", "Hybrid"],
  employmentTypes: ["Full-time", "Contract"],
  targetSalary: "$80,000 - $110,000 / year",
  portfolioUrl: "https://portfolio.dev",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  customLinks: [],
  resumeFileName: "Joshua_Resume_2026.pdf",
  resumeFileSize: "142 KB",
  resumeUpdatedAt: "Aug 2026",
}

export const STATUS_CONFIG: Record<
  JobSearchStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  actively_looking: {
    label: "Actively Looking",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  open_to_offers: {
    label: "Open to Offers",
    badgeClass: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dotClass: "bg-blue-500",
  },
  not_looking: {
    label: "Not Looking",
    badgeClass: "border-muted bg-muted/40 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
}

export const WORKPLACE_OPTIONS = ["Remote", "Hybrid", "On-site"] as const
export const EMPLOYMENT_OPTIONS = ["Full-time", "Part-time", "Contract", "Freelance"] as const
