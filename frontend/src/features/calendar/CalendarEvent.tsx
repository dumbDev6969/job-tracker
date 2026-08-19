import { Video, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalendarEventType = "interview" | "follow_up"

type CalendarEventProps = {
  type: CalendarEventType
  company: string
  role: string
  time?: string
  onClick?: () => void
}

export function CalendarEvent({ type, company, role, time, onClick }: CalendarEventProps) {
  const isInterview = type === "interview"

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${isInterview ? "Interview" : "Follow-up"}: ${company} - ${role}${time ? ` (${time})` : ""}`}
      className={cn(
        "group flex w-full items-center gap-1.5 rounded-md border px-2 py-1 text-left text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 cursor-pointer",
        isInterview
          ? "border-purple-500/30 bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 dark:border-purple-400/30 dark:bg-purple-400/10 dark:text-purple-300 dark:hover:bg-purple-400/20"
          : "border-blue-500/30 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/20"
      )}
    >
      {isInterview ? (
        <Video className="size-3 shrink-0 text-purple-600 dark:text-purple-400" />
      ) : (
        <Clock className="size-3 shrink-0 text-blue-600 dark:text-blue-400" />
      )}
      <div className="min-w-0 flex-1 truncate">
        <span className="font-semibold">{company}</span>
        <span className="opacity-75"> · {role}</span>
      </div>
      {time ? (
        <span className="shrink-0 text-[10px] opacity-80">{time}</span>
      ) : null}
    </button>
  )
}
