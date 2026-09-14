import { api } from "@/lib/api"
import type { ProfileData } from "../profile.types"

export const PROFILE_QUERY_KEY = ["profile"] as const

export type BackendProfileResponse = {
  id: number | null
  user_id: number
  full_name: string
  headline: string
  location: string
  phone: string
  bio: string
  status: "actively_looking" | "open_to_offers" | "not_looking"
  target_roles: string[]
  workplace_types: string[]
  employment_types: string[]
  target_salary: string
  portfolio_url: string
  github_url: string
  linkedin_url: string
  custom_links: { id: string; label: string; url: string }[]
  resume_file_name: string
  resume_file_size: string
  resume_updated_at: string
  resume_url?: string | null
  created_at?: string
  updated_at?: string
}

export function transformBackendToFrontendProfile(data: BackendProfileResponse): ProfileData {
  return {
    fullName: data.full_name ?? "",
    headline: data.headline ?? "",
    location: data.location ?? "",
    phone: data.phone ?? "",
    bio: data.bio ?? "",
    status: data.status ?? "actively_looking",
    targetRoles: Array.isArray(data.target_roles) ? data.target_roles : [],
    workplaceTypes: Array.isArray(data.workplace_types) ? data.workplace_types : [],
    employmentTypes: Array.isArray(data.employment_types) ? data.employment_types : [],
    targetSalary: data.target_salary ?? "",
    portfolioUrl: data.portfolio_url ?? "",
    githubUrl: data.github_url ?? "",
    linkedinUrl: data.linkedin_url ?? "",
    customLinks: Array.isArray(data.custom_links) ? data.custom_links : [],
    resumeFileName: data.resume_file_name ?? "",
    resumeFileSize: data.resume_file_size ?? "",
    resumeUpdatedAt: data.resume_updated_at ?? "",
    resumeUrl: data.resume_url ?? undefined,
  }
}

export function transformFrontendToBackendProfile(data: ProfileData) {
  return {
    full_name: data.fullName,
    headline: data.headline,
    location: data.location,
    phone: data.phone,
    bio: data.bio,
    status: data.status,
    target_roles: data.targetRoles,
    workplace_types: data.workplaceTypes,
    employment_types: data.employmentTypes,
    target_salary: data.targetSalary,
    portfolio_url: data.portfolioUrl,
    github_url: data.githubUrl,
    linkedin_url: data.linkedinUrl,
    custom_links: data.customLinks,
    resume_file_name: data.resumeFileName,
    resume_file_size: data.resumeFileSize,
    resume_updated_at: data.resumeUpdatedAt,
  }
}

export async function getProfile(): Promise<ProfileData> {
  const response = await api.get<{ data: BackendProfileResponse }>("/api/profile")
  return transformBackendToFrontendProfile(response.data.data)
}

export async function updateProfile(payload: ProfileData): Promise<ProfileData> {
  const backendPayload = transformFrontendToBackendProfile(payload)
  const response = await api.put<{ data: BackendProfileResponse }>("/api/profile", backendPayload)
  return transformBackendToFrontendProfile(response.data.data)
}

export async function uploadResume(file: File): Promise<ProfileData> {
  const formData = new FormData()
  formData.append("resume", file)

  const response = await api.post<{ data: BackendProfileResponse }>(
    "/api/profile/resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return transformBackendToFrontendProfile(response.data.data)
}

export async function downloadResume(fallbackFileName = "Resume.pdf"): Promise<void> {
  const response = await api.get("/api/profile/resume/download", {
    responseType: "blob",
  })

  // Extract filename from Content-Disposition header if available
  const dispositionHeader = response.headers["content-disposition"]
  const disposition = typeof dispositionHeader === "string" ? dispositionHeader : ""
  let fileName = fallbackFileName
  if (disposition && disposition.includes("filename=")) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
    if (matches != null && matches[1]) {
      fileName = matches[1].replace(/['"]/g, "")
    }
  }

  const contentTypeHeader = response.headers["content-type"]
  const contentType = typeof contentTypeHeader === "string" ? contentTypeHeader : "application/octet-stream"

  const blob = new Blob([response.data], {
    type: contentType,
  })
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = downloadUrl
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(downloadUrl)
}
