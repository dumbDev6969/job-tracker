import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EditJobModal, getJobApplication, type JobApplication } from "@/features/job-track"
import { api } from "@/lib/api"
import { CalendarEvent } from "./CalendarEvent"

type CalendarApplication = {
  id: number
  company: string
  role: string
  interview_date: string | null
  follow_up_date: string | null
}

type DayEvent = {
  id: number
  company: string
  role: string
  type: "interview" | "follow_up"
  time?: string
}

function eventsForDay(day: Date, applications: CalendarApplication[]): DayEvent[] {
  const events: DayEvent[] = []

  for (const app of applications) {
    if (app.interview_date) {
      const parsed = parseISO(app.interview_date)
      if (isValid(parsed) && isSameDay(parsed, day)) {
        const timeStr = format(parsed, "h:mm a")
        const hasTime = !app.interview_date.endsWith("00:00:00") && timeStr !== "12:00 AM"
        events.push({
          id: app.id,
          company: app.company,
          role: app.role,
          type: "interview",
          time: hasTime ? timeStr : undefined,
        })
      }
    }

    if (app.follow_up_date) {
      const parsed = parseISO(app.follow_up_date)
      if (isValid(parsed) && isSameDay(parsed, day)) {
        events.push({
          id: app.id,
          company: app.company,
          role: app.role,
          type: "follow_up",
        })
      }
    }
  }

  return events
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null)
  const [loadingJobId, setLoadingJobId] = useState<number | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const fromStr = format(gridStart, "yyyy-MM-dd")
  const toStr = format(gridEnd, "yyyy-MM-dd")

  const {
    data: applications = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["calendar-events", fromStr, toStr],
    queryFn: async () => {
      const res = await api.get<CalendarApplication[] | { data: CalendarApplication[] }>(
        "/api/job-applications/calendar",
        { params: { from: fromStr, to: toStr } }
      )
      return Array.isArray(res.data) ? res.data : res.data.data
    },
  })

  const daysInGrid = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const handleEventClick = async (jobId: number) => {
    setLoadingJobId(jobId)
    try {
      const job = await getJobApplication(jobId)
      setSelectedJob(job)
    } catch {
      // Error handled quietly or can retry
    } finally {
      setLoadingJobId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header controls & Legend */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2 text-primary">
            <CalendarIcon className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendar</h1>
            <p className="text-sm text-muted-foreground">
              Overview of scheduled interviews and follow-up deadlines.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-purple-500" />
            <span className="font-medium text-muted-foreground">Interview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-blue-500" />
            <span className="font-medium text-muted-foreground">Follow-up</span>
          </div>
        </div>
      </div>

      {/* Month Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          {isFetching && !isLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
            className="text-xs"
          >
            Today
          </Button>
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {isError ? (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>Failed to load calendar events.</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => void refetch()}
          >
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      ) : null}

      {/* Hand-rolled Month Grid */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold text-muted-foreground">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2.5">
              {day}
            </div>
          ))}
        </div>

        {/* Day cells grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-border border-b border-border">
          {daysInGrid.map((day) => {
            const inCurrentMonth = isSameMonth(day, currentMonth)
            const today = isToday(day)
            const dayEvents = eventsForDay(day, applications)

            return (
              <div
                key={day.toISOString()}
                className={`group flex min-h-[100px] flex-col p-1.5 sm:min-h-[120px] sm:p-2 transition-colors ${
                  !inCurrentMonth
                    ? "bg-muted/15 text-muted-foreground/40"
                    : "bg-background text-foreground"
                }`}
              >
                {/* Cell date number header */}
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-medium ${
                      today
                        ? "bg-primary text-primary-foreground font-bold"
                        : inCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 ? (
                    <span className="text-[10px] font-medium text-muted-foreground sm:hidden">
                      {dayEvents.length}
                    </span>
                  ) : null}
                </div>

                {/* Events pill list */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] sm:max-h-[100px] scrollbar-none">
                  {dayEvents.map((event, idx) => (
                    <div key={`${event.id}-${event.type}-${idx}`} className="relative">
                      <CalendarEvent
                        type={event.type}
                        company={event.company}
                        role={event.role}
                        time={event.time}
                        onClick={() => void handleEventClick(event.id)}
                      />
                      {loadingJobId === event.id ? (
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-[1px]">
                          <Loader2 className="size-3 animate-spin text-primary" />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Job Application Modal */}
      <EditJobModal
        job={selectedJob}
        open={selectedJob !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedJob(null)
        }}
        onSuccess={() => {
          void refetch()
        }}
      />
    </div>
  )
}
