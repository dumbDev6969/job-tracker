import { memo } from "react"
import { Sparkles, MapPin, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProfileData } from "../profile.types"
import { STATUS_CONFIG } from "../profile.constants"

type ProfileHeroCardProps = {
  activeData: ProfileData
  userInitials: string
  completenessPercent: number
  userEmail?: string
}

export const ProfileHeroCard = memo(function ProfileHeroCard({
  activeData,
  userInitials,
  completenessPercent,
  userEmail,
}: ProfileHeroCardProps) {
  const currentStatusConfig = STATUS_CONFIG[activeData.status]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative flex size-20 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-2xl font-bold text-primary sm:size-24 sm:text-3xl">
            {userInitials}
            <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-emerald-500 text-white">
              <Sparkles className="size-3" />
            </span>
          </div>

          {/* Main Info */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {activeData.fullName || "Your Name"}
              </h2>
              <Badge
                variant="outline"
                className={cn("gap-1.5 px-2.5 py-0.5", currentStatusConfig.badgeClass)}
              >
                <span className={cn("size-2 rounded-full", currentStatusConfig.dotClass)} />
                {currentStatusConfig.label}
              </Badge>
            </div>

            <p className="text-base font-medium text-muted-foreground">
              {activeData.headline || "Professional Headline"}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground sm:text-sm">
              {activeData.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" />
                  {activeData.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                {userEmail ?? "user@example.com"}
              </span>
              {activeData.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" />
                  {activeData.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Strength */}
        <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 sm:w-64">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground">Profile Strength</span>
            <span className="text-primary">{completenessPercent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {completenessPercent === 100
              ? "All profile sections completed!"
              : "Complete all fields to boost your pipeline accuracy."}
          </p>
        </div>
      </div>
    </div>
  )
})
