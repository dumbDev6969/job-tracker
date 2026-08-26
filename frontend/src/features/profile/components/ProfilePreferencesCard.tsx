import { memo } from "react"
import { Briefcase, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ProfileData } from "../profile.types"
import { WORKPLACE_OPTIONS, EMPLOYMENT_OPTIONS } from "../profile.constants"

type ProfilePreferencesCardProps = {
  isEditing: boolean
  editValues: ProfileData
  profile: ProfileData
  newRoleInput: string
  onNewRoleInputChange: (val: string) => void
  onAddRole: (e: React.FormEvent) => void
  onRemoveRole: (role: string) => void
  onToggleWorkplace: (type: string) => void
  onToggleEmployment: (type: string) => void
  onSalaryChange: (val: string) => void
}

export const ProfilePreferencesCard = memo(function ProfilePreferencesCard({
  isEditing,
  editValues,
  profile,
  newRoleInput,
  onNewRoleInputChange,
  onAddRole,
  onRemoveRole,
  onToggleWorkplace,
  onToggleEmployment,
  onSalaryChange,
}: ProfilePreferencesCardProps) {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Briefcase className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Target Roles & Preferences</CardTitle>
            <CardDescription>Roles, workplace modes, and compensation goals.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Target Roles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Target Roles
          </label>
          {isEditing ? (
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2">
                {editValues.targetRoles.map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="gap-1.5 rounded-lg py-1 pr-1.5 pl-2.5 text-xs font-medium"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => onRemoveRole(role)}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20 cursor-pointer"
                      aria-label={`Remove ${role}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <form onSubmit={onAddRole} className="flex gap-2">
                <Input
                  size={1}
                  className="h-8 text-xs"
                  placeholder="Add a role title (e.g. DevOps Engineer)"
                  value={newRoleInput}
                  onChange={(e) => onNewRoleInputChange(e.target.value)}
                />
                <Button type="submit" size="sm" variant="outline" className="h-8 gap-1 px-2.5 text-xs cursor-pointer">
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.targetRoles.length > 0 ? (
                profile.targetRoles.map((role) => (
                  <Badge key={role} variant="secondary" className="rounded-lg px-2.5 py-1 text-xs font-medium">
                    {role}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No target roles specified.</span>
              )}
            </div>
          )}
        </div>

        {/* Workplace & Employment Types */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workplace Mode
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-1.5">
                {WORKPLACE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onToggleWorkplace(opt)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                      editValues.workplaceTypes.includes(opt)
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {profile.workplaceTypes.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-md border-border text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Employment Type
            </label>
            {isEditing ? (
              <div className="flex flex-wrap gap-1.5">
                {EMPLOYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onToggleEmployment(opt)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                      editValues.employmentTypes.includes(opt)
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {profile.employmentTypes.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-md border-border text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Target Compensation */}
        <div className="space-y-1.5">
          <label htmlFor="targetSalary" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Expected Compensation
          </label>
          {isEditing ? (
            <Input
              id="targetSalary"
              value={editValues.targetSalary}
              onChange={(e) => onSalaryChange(e.target.value)}
              placeholder="e.g. $90,000 - $120,000 / year"
              className="h-8 text-xs"
            />
          ) : (
            <p className="text-sm font-medium text-foreground">
              {profile.targetSalary || "Not specified"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
