import axios from "axios"

import { API_BASE_URL, api } from "@/lib/api"

import type { JobApplication } from "../types"

type LaravelPaginatorLinks = {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

type LaravelPaginatorMetaLink = {
  url: string | null
  label: string
  active: boolean
}

type LaravelPaginatorMeta = {
  current_page: number
  from: number | null
  last_page: number
  links: LaravelPaginatorMetaLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export type JobApplicationListResponse = {
  data: JobApplication[]
  links: LaravelPaginatorLinks
  meta: LaravelPaginatorMeta
}

export type JobApplicationPayload = {
  company: string
  role: string
  status: "saved" | "applied" | "interviewing" | "offered" | "rejected"
  applied_date?: string | null
  url?: string | null
  contact?: string | null
  referral: boolean
  notes?: string | null
  follow_up_date?: string | null
  interview_date?: string | null
}

async function getCsrfCookie() {
  return axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  })
}

export async function createJobApplication(payload: JobApplicationPayload) {
  await getCsrfCookie()
  const response = await api.post("/api/job-applications", payload)
  return response.data
}

export async function listJobApplications(page = 1): Promise<JobApplicationListResponse> {
  const response = await api.get<JobApplicationListResponse>("/api/job-applications", {
    params: { page },
  })
  return response.data
}

export async function listAllJobApplications(): Promise<JobApplication[]> {
  const firstPageResponse = await listJobApplications(1)
  const applications = [...firstPageResponse.data]

  for (let page = 2; page <= firstPageResponse.meta.last_page; page += 1) {
    const response = await listJobApplications(page)
    applications.push(...response.data)
  }

  return applications
}

export async function getJobApplication(id: number | string): Promise<JobApplication> {
  const response = await api.get<{ data: JobApplication }>(`/api/job-applications/${id}`)
  return response.data.data
}

export async function updateJobApplication(
  id: number | string,
  payload: Partial<JobApplicationPayload>
): Promise<JobApplication> {
  await getCsrfCookie()
  const response = await api.put<{ data: JobApplication }>(`/api/job-applications/${id}`, payload)
  return response.data.data
}

export async function deleteJobApplication(id: number | string): Promise<void> {
  await getCsrfCookie()
  await api.delete(`/api/job-applications/${id}`)
}
