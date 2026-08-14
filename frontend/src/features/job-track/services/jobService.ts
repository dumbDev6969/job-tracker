import axios from "axios"

import { API_BASE_URL, api } from "@/lib/api"

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
