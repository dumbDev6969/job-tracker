import { memo } from "react"
import { Globe, Link2, ExternalLink, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GithubIcon } from "@/components/icons/GithubIcon"
import { LinkedinIcon } from "@/components/icons/LinkedinIcon"
import type { ProfileData } from "../profile.types"

type ProfileLinksCardProps = {
  isEditing: boolean
  editValues: ProfileData
  profile: ProfileData
  onFieldChange: (field: "linkedinUrl" | "githubUrl" | "portfolioUrl", value: string) => void
  onAddCustomLink: () => void
  onUpdateCustomLink: (id: string, field: "label" | "url", value: string) => void
  onRemoveCustomLink: (id: string) => void
}

export const ProfileLinksCard = memo(function ProfileLinksCard({
  isEditing,
  editValues,
  profile,
  onFieldChange,
  onAddCustomLink,
  onUpdateCustomLink,
  onRemoveCustomLink,
}: ProfileLinksCardProps) {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Globe className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Online Presence</CardTitle>
            <CardDescription>Links for recruiters to view your work.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="linkedinUrl" className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <LinkedinIcon className="size-3.5 text-blue-600" />
                LinkedIn Profile
              </label>
              <Input
                id="linkedinUrl"
                value={editValues.linkedinUrl}
                onChange={(e) => onFieldChange("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="githubUrl" className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <GithubIcon className="size-3.5" />
                GitHub Profile
              </label>
              <Input
                id="githubUrl"
                value={editValues.githubUrl}
                onChange={(e) => onFieldChange("githubUrl", e.target.value)}
                placeholder="https://github.com/username"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="portfolioUrl" className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Globe className="size-3.5 text-emerald-600" />
                Portfolio Website
              </label>
              <Input
                id="portfolioUrl"
                value={editValues.portfolioUrl}
                onChange={(e) => onFieldChange("portfolioUrl", e.target.value)}
                placeholder="https://portfolio.dev"
                className="h-8 text-xs"
              />
            </div>

            {/* Dynamic Custom Links */}
            {(editValues.customLinks || []).length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Additional Links
                </label>
                {(editValues.customLinks || []).map((customLink, idx) => (
                  <div
                    key={customLink.id}
                    className="space-y-1.5 rounded-2xl border border-border/80 bg-muted/20 p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Link #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveCustomLink(customLink.id)}
                        className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        aria-label="Remove link"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                      <Input
                        placeholder="Label (e.g. Blog, X, Dribbble)"
                        value={customLink.label}
                        onChange={(e) => onUpdateCustomLink(customLink.id, "label", e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="https://..."
                        value={customLink.url}
                        onChange={(e) => onUpdateCustomLink(customLink.id, "url", e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddCustomLink}
              className="w-full gap-1.5 border-dashed text-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              Add URL
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl.startsWith("http") ? profile.linkedinUrl : `https://${profile.linkedinUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="size-4 text-blue-600" />
                  <span>LinkedIn Profile</span>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </a>
            )}

            {profile.githubUrl && (
              <a
                href={profile.githubUrl.startsWith("http") ? profile.githubUrl : `https://${profile.githubUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="size-4" />
                  <span>GitHub Profile</span>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </a>
            )}

            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl.startsWith("http") ? profile.portfolioUrl : `https://${profile.portfolioUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-emerald-600" />
                  <span>Portfolio Website</span>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground" />
              </a>
            )}

            {(profile.customLinks || []).map((link) => {
              if (!link.url && !link.label) return null
              const href = link.url.startsWith("http") ? link.url : `https://${link.url}`
              return (
                <a
                  key={link.id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-2">
                    <Link2 className="size-4 text-primary" />
                    <span>{link.label || link.url}</span>
                  </div>
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </a>
              )
            })}

            {!profile.linkedinUrl &&
              !profile.githubUrl &&
              !profile.portfolioUrl &&
              (!profile.customLinks || profile.customLinks.length === 0) && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  No online presence links added yet. Click &apos;Edit Profile&apos; to add URLs.
                </p>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  )
})
