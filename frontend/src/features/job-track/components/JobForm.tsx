import { useState } from "react"
import { Loader2, Sparkles } from "lucide-react"

import { FormField } from "@/components/FormField"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createJobApplication } from "@/features/job-track/services/jobService"
import { cn } from "@/lib/utils"

const APPLICATION_STATUS = ["saved", "applied", "interviewing", "offered", "rejected"] as const

type JobFormValues = {
  company: string
  role: string
  status: (typeof APPLICATION_STATUS)[number]
  url: string
  contact: string
  referral: boolean
  notes: string
}

type JobFormProps = {
  onSubmit?: (values: JobFormValues) => void | Promise<void>
  className?: string
  submitLabel?: string
}

const defaultValues: JobFormValues = {
  company: "",
  role: "",
  status: "saved",
  url: "",
  contact: "",
  referral: false,
  notes: "",
}

export function JobForm({ onSubmit, className, submitLabel = "Save job" }: JobFormProps) {
  const [values, setValues] = useState<JobFormValues>(defaultValues)
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const updateField = <K extends keyof JobFormValues>(field: K, value: JobFormValues[K]) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof JobFormValues, string>> = {}

    if (!values.company.trim()) {
      nextErrors.company = "Company is required"
    }

    if (!values.role.trim()) {
      nextErrors.role = "Role is required"
    }

    if (values.url.trim() && !/^https?:\/\//i.test(values.url.trim())) {
      nextErrors.url = "Use a valid URL"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const resetForm = () => setValues(defaultValues)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      company: values.company.trim(),
      role: values.role.trim(),
      status: values.status,
      url: values.url.trim() || null,
      contact: values.contact.trim() || null,
      referral: values.referral,
      notes: values.notes.trim() || null,
      applied_date: values.status === "saved" ? null : new Date().toISOString().slice(0, 10),
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      await createJobApplication(payload)
      await onSubmit?.(values)
      setSubmitSuccess("Application saved successfully.")
      resetForm()
    } catch (error) {
      console.error("Failed to save job application:", error)
      setSubmitError("We couldn’t save this job. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            New application
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Track a role</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {submitError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        {submitSuccess ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
            {submitSuccess}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <FormField id="company" label="Company" required error={errors.company}>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={values.company}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </FormField>

          <FormField id="role" label="Role" required error={errors.role}>
            <Input
              id="role"
              placeholder="Senior Product Designer"
              value={values.role}
              onChange={(event) => updateField("role", event.target.value)}
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField id="status" label="Status" error={errors.status}>
            <Select
              value={values.status}
              onValueChange={(value) =>
                updateField("status", value as (typeof APPLICATION_STATUS)[number])
              }
            >
              <SelectTrigger className="w-full" aria-label="Application status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            id="contact"
            label="Contact"
            description="Recruiter or hiring manager"
            error={errors.contact}
          >
            <Input
              id="contact"
              placeholder="Jordan Lee"
              value={values.contact}
              onChange={(event) => updateField("contact", event.target.value)}
            />
          </FormField>
        </div>

        <FormField
          id="url"
          label="Job URL"
          description="Link to the posting"
          error={errors.url}
        >
          <Input
            id="url"
            type="url"
            placeholder="https://company.com/careers/role"
            value={values.url}
            onChange={(event) => updateField("url", event.target.value)}
          />
        </FormField>

        <FormField
          id="notes"
          label="Notes"
          description="Anything important from the posting or conversation"
          error={errors.notes}
        >
          <Textarea
            id="notes"
            placeholder="Strong product portfolio, salary range, hiring panel, etc."
            className="min-h-28 resize-y"
            value={values.notes}
            onChange={(event) => updateField("notes", event.target.value)}
          />
        </FormField>

        <div className="rounded-2xl border border-border bg-muted/30 p-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="referral"
              checked={values.referral}
              onCheckedChange={(checked) => updateField("referral", checked === true)}
            />
            <label htmlFor="referral" className="text-sm font-medium text-foreground">
              I was referred for this role
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-36">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default JobForm
