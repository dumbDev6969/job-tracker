export type JobApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected"

export type JobApplication = {
  id: number
  user_id: number
  company: string
  role: string
  status: JobApplicationStatus
  applied_date: string | null
  url: string | null
  contact: string | null
  referral: boolean
  notes: string | null
  follow_up_date: string | null
  interview_date: string | null
  created_at: string
  updated_at: string
}

export const JOB_STATUSES: { value: JobApplicationStatus; label: string }[] = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
]