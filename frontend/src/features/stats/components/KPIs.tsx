"use client"

import * as React from "react"
import { Briefcase, CircleCheckBig, Clock3, Handshake, OctagonX } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { listAllJobApplications } from "@/features/job-track/services/jobService"
import type { JobApplication, JobApplicationStatus } from "@/features/job-track/types"

const APPLICATION_STATUS = ["saved", "applied", "interviewing", "offered", "rejected"] as const

type ApplicationStatus = (typeof APPLICATION_STATUS)[number]

const STATUS_META: Record<
  ApplicationStatus,
  {
    label: string
    icon: typeof Briefcase
    cardClassName: string
    iconClassName: string
  }
> = {
  saved: {
    label: "Saved",
    icon: Clock3,
    cardClassName: "border-border/70",
    iconClassName: "text-muted-foreground",
  },
  applied: {
    label: "Applied",
    icon: Briefcase,
    cardClassName: "border-blue-500/25",
    iconClassName: "text-blue-600 dark:text-blue-400",
  },
  interviewing: {
    label: "Interviewing",
    icon: CircleCheckBig,
    cardClassName: "border-amber-500/25",
    iconClassName: "text-amber-600 dark:text-amber-400",
  },
  offered: {
    label: "Offered",
    icon: Handshake,
    cardClassName: "border-emerald-500/25",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: OctagonX,
    cardClassName: "border-destructive/25",
    iconClassName: "text-destructive",
  },
}

const initialStatusCounts: Record<JobApplicationStatus, number> = {
  saved: 0,
  applied: 0,
  interviewing: 0,
  offered: 0,
  rejected: 0,
}

function buildStatusCounts(applications: JobApplication[]) {
  return applications.reduce<Record<JobApplicationStatus, number>>((accumulator, application) => {
    accumulator[application.status] += 1
    return accumulator
  }, { ...initialStatusCounts })
}

export function KPIs() {
  const [applications, setApplications] = React.useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    async function loadApplications() {
      setIsLoading(true)
      setErrorMessage(null)

      const result = await listAllJobApplications()
      if (!isMounted) {
        return
      }

      setApplications(result)
      setIsLoading(false)
    }

    loadApplications().catch(() => {
      if (!isMounted) {
        return
      }

      setErrorMessage("Unable to load status KPIs right now.")
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const statusCounts = React.useMemo(() => buildStatusCounts(applications), [applications])
  const totalApplications = applications.length

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">Status Snapshot</h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Real backend data across {totalApplications.toLocaleString()} tracked applications.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Loading KPI data...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {APPLICATION_STATUS.map((status) => {
            const count = statusCounts[status]
            const ratio = totalApplications === 0 ? 0 : Math.round((count / totalApplications) * 100)
            const Icon = STATUS_META[status].icon

            return (
              <Card
                key={status}
                className={`gap-0 border bg-card/80 py-2 shadow-sm sm:py-3 ${STATUS_META[status].cardClassName}`}
              >
                <CardHeader className="pt-1 pb-2">
                  <CardTitle className="flex items-center justify-between text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {STATUS_META[status].label}
                    <Icon className={`size-4 ${STATUS_META[status].iconClassName}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-4">
                  <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{count}</p>
                  <div className="space-y-1">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${ratio}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{ratio}% of total applications</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
