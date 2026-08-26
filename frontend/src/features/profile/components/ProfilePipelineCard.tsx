import { memo, useMemo } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ALL_JOB_APPLICATIONS_KEY,
  listAllJobApplications,
} from "@/features/job-track/services/jobService"

export const ProfilePipelineCard = memo(function ProfilePipelineCard() {
  const { data: applications = [] } = useQuery({
    queryKey: ALL_JOB_APPLICATIONS_KEY,
    queryFn: listAllJobApplications,
  })

  const { totalApps, interviewingCount, offeredCount } = useMemo(() => {
    return {
      totalApps: applications.length,
      interviewingCount: applications.filter((a) => a.status === "interviewing").length,
      offeredCount: applications.filter((a) => a.status === "offered").length,
    }
  }, [applications])

  return (
    <Card className="rounded-3xl border-primary/20 bg-primary/5 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">Pipeline Activity</CardTitle>
          </div>
          <Badge variant="secondary" className="text-[11px] font-normal">
            Live backend data
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-border/60 bg-background/80 p-2.5">
            <p className="text-xl font-bold text-foreground">{totalApps}</p>
            <p className="text-[11px] text-muted-foreground">Tracked</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/80 p-2.5">
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{interviewingCount}</p>
            <p className="text-[11px] text-muted-foreground">Interviews</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/80 p-2.5">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{offeredCount}</p>
            <p className="text-[11px] text-muted-foreground">Offers</p>
          </div>
        </div>

        <Link
          to="/jobs"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-xs font-semibold text-primary shadow-2xs transition-colors hover:bg-muted/50"
        >
          <span>View all applications</span>
          <ExternalLink className="size-3" />
        </Link>
      </CardContent>
    </Card>
  )
})
