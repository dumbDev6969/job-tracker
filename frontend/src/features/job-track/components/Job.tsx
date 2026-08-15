import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Building2,
  Check,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Inbox,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  UserCheck,
} from "lucide-react"

import { ConfirmDialog } from "@/components/ConfirmDialog"
import { EditJobModal } from "./EditJobModal"
import { EmptyState } from "@/components/EmptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { deleteJobApplication, getJobApplication } from "../services/jobService"
import { JOB_STATUSES, type JobApplication, type JobApplicationStatus } from "../types"

const STATUS_BADGE_CLASS: Record<JobApplicationStatus, string> = {
  saved: "bg-muted text-muted-foreground border-border",
  applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  interviewing: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  offered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

const STATUS_LABEL = Object.fromEntries(
  JOB_STATUSES.map((status) => [status.value, status.label])
) as Record<JobApplicationStatus, string>

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not set"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

type JobProps = {
  jobId?: string | number
  onBack?: () => void
}

export function Job({ jobId: propJobId, onBack }: JobProps) {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const activeId = propJobId ?? params.id

  const [job, setJob] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/jobs")
    }
  }

  const loadJob = async (id: string | number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getJobApplication(id)
      setJob(data)
    } catch {
      setError("Unable to load job application details.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeId) {
      void loadJob(activeId)
    } else {
      setIsLoading(false)
      setError("No job application ID specified.")
    }
  }, [activeId])

  const handleCopyId = async () => {
    if (!job) return
    try {
      await navigator.clipboard.writeText(String(job.id))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback ignore
    }
  }

  const handleDelete = async () => {
    if (!job) return
    setIsDeleting(true)
    try {
      await deleteJobApplication(job.id)
      navigate("/jobs", { replace: true })
    } catch {
      setError("Failed to delete the job application.")
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-card p-8 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading job details...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="ghost" size="sm" onClick={handleBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <EmptyState
          title="Job application not found"
          description={error ?? "The job application you requested could not be loaded."}
          icon={<Inbox className="size-6" />}
          action={
            activeId ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => void loadJob(activeId)}
              >
                <RefreshCw className="size-4" />
                Retry
              </Button>
            ) : undefined
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="w-fit gap-2"
        >
          <ArrowLeft className="size-4" />
          Back to list
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="gap-1.5"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="gap-1.5"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            {copied ? "Copied ID" : "Copy ID"}
          </Button>

          {job.url ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(job.url!, "_blank", "noopener,noreferrer")}
              className="gap-1.5"
            >
              <ExternalLink className="size-3.5" />
              Posting link
            </Button>
          ) : null}

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-1.5"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Primary Container Card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="outline" className={STATUS_BADGE_CLASS[job.status]}>
                {STATUS_LABEL[job.status] ?? job.status}
              </Badge>
              {job.referral ? (
                <Badge variant="secondary" className="gap-1 border-primary/20 bg-primary/10 text-primary">
                  <UserCheck className="size-3" />
                  Referred
                </Badge>
              ) : null}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {job.role}
            </h1>
            <p className="flex items-center gap-1.5 text-base font-medium text-muted-foreground">
              <Building2 className="size-4 shrink-0" />
              {job.company}
            </p>
          </div>

          <Separator />

          {/* Grid Layout: Main & Sidebar details */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left / Main Column */}
            <div className="space-y-6 md:col-span-2">
              {/* Notes Container */}
              <div className="space-y-2">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="size-4" />
                  Notes & Details
                </h2>
                <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-foreground">
                  {job.notes ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{job.notes}</p>
                  ) : (
                    <p className="italic text-muted-foreground">No notes added for this job application yet.</p>
                  )}
                </div>
              </div>

              {/* Timeline Info */}
              <div className="space-y-3">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Clock className="size-4" />
                  Timeline & Dates
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Applied Date</p>
                    <p className="mt-1 font-semibold text-foreground">{formatDate(job.applied_date)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Interview Date</p>
                    <p className="mt-1 font-semibold text-foreground">{formatDate(job.interview_date)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Follow-up Date</p>
                    <p className="mt-1 font-semibold text-foreground">{formatDate(job.follow_up_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right / Sidebar Column */}
            <div className="space-y-6">
              <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Application Summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Contact / Recruiter</span>
                    <p className="font-medium text-foreground">{job.contact || "None specified"}</p>
                  </div>

                  <Separator />

                  <div>
                    <span className="text-xs text-muted-foreground">Job Posting URL</span>
                    {job.url ? (
                      <p className="mt-0.5 truncate text-primary hover:underline">
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          <ExternalLink className="size-3 shrink-0" />
                          <span className="truncate">{job.url}</span>
                        </a>
                      </p>
                    ) : (
                      <p className="font-medium text-foreground">No URL provided</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <span className="text-xs text-muted-foreground">Created</span>
                    <p className="font-medium text-foreground">{formatDate(job.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete job application?"
        description={`This will permanently remove ${job.role} at ${job.company}.`}
        confirmLabel="Delete"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <EditJobModal
        job={job}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSuccess={(updated) => {
          setJob(updated)
        }}
      />
    </div>
  )
}

export default Job
