import { useEffect, useState } from "react"
import { Loader2, Pencil } from "lucide-react"

import { FormField } from "@/components/FormField"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateJobApplication } from "../services/jobService"
import { JOB_STATUSES, type JobApplication, type JobApplicationStatus } from "../types"

type EditJobModalProps = {
  job: JobApplication | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (updatedJob: JobApplication) => void
}

type EditFormValues = {
  company: string
  role: string
  status: JobApplicationStatus
  applied_date: string
  interview_date: string
  follow_up_date: string
  url: string
  contact: string
  referral: boolean
  notes: string
}

function toInputDate(isoString: string | null | undefined): string {
  if (!isoString) return ""
  // Format to YYYY-MM-DD for standard date input
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return isoString.slice(0, 10)
  }
  return date.toISOString().slice(0, 10)
}

export function EditJobModal({ job, open, onOpenChange, onSuccess }: EditJobModalProps) {
  const [values, setValues] = useState<EditFormValues>({
    company: "",
    role: "",
    status: "applied",
    applied_date: "",
    interview_date: "",
    follow_up_date: "",
    url: "",
    contact: "",
    referral: false,
    notes: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof EditFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (job) {
      setValues({
        company: job.company ?? "",
        role: job.role ?? "",
        status: job.status ?? "applied",
        applied_date: toInputDate(job.applied_date),
        interview_date: toInputDate(job.interview_date),
        follow_up_date: toInputDate(job.follow_up_date),
        url: job.url ?? "",
        contact: job.contact ?? "",
        referral: Boolean(job.referral),
        notes: job.notes ?? "",
      })
      setErrors({})
      setSubmitError(null)
    }
  }, [job])

  const updateField = <K extends keyof EditFormValues>(field: K, value: EditFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof EditFormValues, string>> = {}
    if (!values.company.trim()) {
      nextErrors.company = "Company name is required."
    }
    if (!values.role.trim()) {
      nextErrors.role = "Role is required."
    }
    if (values.url.trim() && !/^https?:\/\//i.test(values.url.trim())) {
      nextErrors.url = "Please enter a valid URL (starting with http:// or https://)."
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job || !validate()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const updated = await updateJobApplication(job.id, {
        company: values.company.trim(),
        role: values.role.trim(),
        status: values.status,
        applied_date: values.applied_date || null,
        interview_date: values.interview_date || null,
        follow_up_date: values.follow_up_date || null,
        url: values.url.trim() || null,
        contact: values.contact.trim() || null,
        referral: values.referral,
        notes: values.notes.trim() || null,
      })

      onSuccess?.(updated)
      onOpenChange(false)
    } catch {
      setSubmitError("Failed to update job application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pencil className="size-5 text-primary" />
            Edit Job Application
          </DialogTitle>
          <DialogDescription>
            Update application details, interview schedules, and notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {submitError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {submitError}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="company" label="Company" required error={errors.company}>
              <Input
                id="company"
                value={values.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Acme Corp"
              />
            </FormField>

            <FormField id="role" label="Role" required error={errors.role}>
              <Input
                id="role"
                value={values.role}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="Senior Engineer"
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="status" label="Status">
              <Select
                value={values.status}
                onValueChange={(val) => updateField("status", val as JobApplicationStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="contact" label="Contact / Recruiter">
              <Input
                id="contact"
                value={values.contact}
                onChange={(e) => updateField("contact", e.target.value)}
                placeholder="Recruiter name or email"
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="applied_date" label="Applied Date">
              <Input
                id="applied_date"
                type="date"
                value={values.applied_date}
                onChange={(e) => updateField("applied_date", e.target.value)}
              />
            </FormField>

            <FormField id="interview_date" label="Interview Date">
              <Input
                id="interview_date"
                type="datetime-local"
                value={values.interview_date}
                onChange={(e) => updateField("interview_date", e.target.value)}
              />
            </FormField>

            <FormField id="follow_up_date" label="Follow-up Date">
              <Input
                id="follow_up_date"
                type="date"
                value={values.follow_up_date}
                onChange={(e) => updateField("follow_up_date", e.target.value)}
              />
            </FormField>
          </div>

          <FormField id="url" label="Job Posting URL" error={errors.url}>
            <Input
              id="url"
              type="url"
              value={values.url}
              onChange={(e) => updateField("url", e.target.value)}
              placeholder="https://company.com/careers/job"
            />
          </FormField>

          <FormField id="notes" label="Notes">
            <Textarea
              id="notes"
              value={values.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Application notes, interview feedback, compensation details..."
              className="min-h-24 resize-y"
            />
          </FormField>

          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="referral"
                checked={values.referral}
                onCheckedChange={(checked) => updateField("referral", checked === true)}
              />
              <label htmlFor="referral" className="text-sm font-medium text-foreground cursor-pointer">
                I was referred for this position
              </label>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-28">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditJobModal
