import { memo } from "react"
import { User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { JobSearchStatus, ProfileData } from "../profile.types"
import { STATUS_CONFIG } from "../profile.constants"

const STATUS_KEYS: JobSearchStatus[] = ["actively_looking", "open_to_offers", "not_looking"]

type ProfileBioCardProps = {
  isEditing: boolean
  editValues: ProfileData
  profile: ProfileData
  onFieldChange: (field: keyof ProfileData, value: string) => void
  onStatusChange: (status: JobSearchStatus) => void
}

export const ProfileBioCard = memo(function ProfileBioCard({
  isEditing,
  editValues,
  profile,
  onFieldChange,
  onStatusChange,
}: ProfileBioCardProps) {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">About & Summary</CardTitle>
            <CardDescription>Your personal pitch and background overview.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={editValues.fullName}
                  onChange={(e) => onFieldChange("fullName", e.target.value)}
                  placeholder="e.g. Joshua Santos"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="headline" className="text-xs font-semibold text-foreground">
                  Professional Headline
                </label>
                <Input
                  id="headline"
                  value={editValues.headline}
                  onChange={(e) => onFieldChange("headline", e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="location" className="text-xs font-semibold text-foreground">
                  Location
                </label>
                <Input
                  id="location"
                  value={editValues.location}
                  onChange={(e) => onFieldChange("location", e.target.value)}
                  placeholder="e.g. Manila, Philippines"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-foreground">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={editValues.phone}
                  onChange={(e) => onFieldChange("phone", e.target.value)}
                  placeholder="+63 917 123 4567"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="statusSelect" className="text-xs font-semibold text-foreground">
                Job Search Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_KEYS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onStatusChange(st)}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer",
                      editValues.status === st
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", STATUS_CONFIG[st].dotClass)} />
                    {STATUS_CONFIG[st].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bio" className="text-xs font-semibold text-foreground">
                Bio / Summary
              </label>
              <Textarea
                id="bio"
                rows={4}
                value={editValues.bio}
                onChange={(e) => onFieldChange("bio", e.target.value)}
                placeholder="Brief summary of your expertise and what roles you are pursuing..."
              />
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {profile.bio || "No summary provided yet. Click 'Edit Profile' to add your background."}
          </p>
        )}
      </CardContent>
    </Card>
  )
})
