import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { PlusCircle, Table as TableIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { JobForm, Jobs } from "@/features/job-track"
import {
  ALL_JOB_APPLICATIONS_KEY,
  JOB_APPLICATIONS_KEY,
} from "@/features/job-track/services/jobService"
import { PagePlaceholder } from "./PagePlaceholder"

export function JobsPage() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<"table" | "form">("table")

  return (
    <PagePlaceholder
      title={view === "table" ? "Jobs" : "Add Job Application"}
      description={
        view === "table"
          ? "Track and manage your job applications here."
          : "Fill in the details below to add a new job application."
      }
      actions={
        view === "table" ? (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => setView("form")}
          >
            <PlusCircle className="size-4" />
            Add new job
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => setView("table")}
          >
            <TableIcon className="size-4" />
            View all jobs
          </Button>
        )
      }
      className="w-full max-w-none"
    >
      {view === "form" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
          <JobForm
            onSubmit={() => {
              void queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEY })
              void queryClient.invalidateQueries({ queryKey: ALL_JOB_APPLICATIONS_KEY })
              setView("table")
            }}
          />

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium text-muted-foreground">Pipeline</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Saved", value: "04" },
                  { label: "Applied", value: "12" },
                  { label: "Interviewing", value: "03" },
                  { label: "Offers", value: "01" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl bg-background px-3 py-2"
                  >
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-primary/5 p-4">
              <p className="text-sm font-medium text-primary">Next tip</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Log every application as soon as you send it to keep your follow-up pipeline accurate.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <Jobs />
      )}
    </PagePlaceholder>
  )
}
