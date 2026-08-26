export type JobSearchStatus = "actively_looking" | "open_to_offers" | "not_looking"

export type CustomLink = {
  id: string
  label: string
  url: string
}

export type ProfileData = {
  fullName: string
  headline: string
  location: string
  phone: string
  bio: string
  status: JobSearchStatus
  targetRoles: string[]
  workplaceTypes: string[]
  employmentTypes: string[]
  targetSalary: string
  portfolioUrl: string
  githubUrl: string
  linkedinUrl: string
  customLinks: CustomLink[]
  resumeFileName: string
  resumeFileSize: string
  resumeUpdatedAt: string
  resumeUrl?: string
}
