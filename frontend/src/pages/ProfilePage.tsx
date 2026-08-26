import { useCallback } from "react"
import { CheckCircle2, Edit3, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useProfileState,
  ProfileHeroCard,
  ProfileBioCard,
  ProfilePreferencesCard,
  ProfileLinksCard,
  ProfileResumeCard,
  ProfilePipelineCard,
  type ProfileData,
  type JobSearchStatus,
  type CustomLink,
} from "@/features/profile"

export type { ProfileData, JobSearchStatus, CustomLink }

export function ProfilePage() {
  const {
    user,
    profile,
    editValues,
    setEditValues,
    isEditing,
    setIsEditing,
    newRoleInput,
    setNewRoleInput,
    saveSuccess,
    isUploadingResume,
    resumeUploadError,
    updateMutation,
    activeData,
    completenessPercent,
    userInitials,
    handleSave,
    handleCancel,
    handleAddRole,
    handleRemoveRole,
    toggleWorkplace,
    toggleEmployment,
    handleAddCustomLink,
    handleUpdateCustomLink,
    handleRemoveCustomLink,
    handleResumeUpload,
    handleResumeDownload,
  } = useProfileState()

  const handleBioFieldChange = useCallback(
    (field: keyof ProfileData, value: string) => {
      setEditValues((prev) => ({ ...prev, [field]: value }))
    },
    [setEditValues]
  )

  const handleBioStatusChange = useCallback(
    (status: JobSearchStatus) => {
      setEditValues((prev) => ({ ...prev, status }))
    },
    [setEditValues]
  )

  const handleSalaryChange = useCallback(
    (val: string) => {
      setEditValues((prev) => ({ ...prev, targetSalary: val }))
    },
    [setEditValues]
  )

  const handleLinksFieldChange = useCallback(
    (field: "linkedinUrl" | "githubUrl" | "portfolioUrl", value: string) => {
      setEditValues((prev) => ({ ...prev, [field]: value }))
    },
    [setEditValues]
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Heading & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Candidate Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your career identity, portfolio links, and job search criteria.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isEditing ? (
            <>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="gap-2 cursor-pointer"
              >
                <Save className="size-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2 cursor-pointer"
            >
              <Edit3 className="size-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Your profile information has been saved successfully.</span>
        </div>
      )}

      {/* Hero Header Card */}
      <ProfileHeroCard
        activeData={activeData}
        userInitials={userInitials}
        completenessPercent={completenessPercent}
        userEmail={user?.email}
      />

      {/* Main Grid: 2 columns on large screens */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
        {/* Left Column: Personal Bio & Preferences */}
        <div className="space-y-6">
          <ProfileBioCard
            isEditing={isEditing}
            editValues={editValues}
            profile={profile}
            onFieldChange={handleBioFieldChange}
            onStatusChange={handleBioStatusChange}
          />

          <ProfilePreferencesCard
            isEditing={isEditing}
            editValues={editValues}
            profile={profile}
            newRoleInput={newRoleInput}
            onNewRoleInputChange={setNewRoleInput}
            onAddRole={handleAddRole}
            onRemoveRole={handleRemoveRole}
            onToggleWorkplace={toggleWorkplace}
            onToggleEmployment={toggleEmployment}
            onSalaryChange={handleSalaryChange}
          />
        </div>

        {/* Right Column: Links, Resume, & Live Activity Stats */}
        <div className="space-y-6">
          <ProfileLinksCard
            isEditing={isEditing}
            editValues={editValues}
            profile={profile}
            onFieldChange={handleLinksFieldChange}
            onAddCustomLink={handleAddCustomLink}
            onUpdateCustomLink={handleUpdateCustomLink}
            onRemoveCustomLink={handleRemoveCustomLink}
          />

          <ProfileResumeCard
            resumeFileName={profile.resumeFileName}
            resumeFileSize={profile.resumeFileSize}
            resumeUpdatedAt={profile.resumeUpdatedAt}
            isUploadingResume={isUploadingResume}
            onUploadResume={handleResumeUpload}
            onDownloadResume={handleResumeDownload}
            uploadError={resumeUploadError}
          />

          <ProfilePipelineCard />
        </div>
      </div>
    </div>
  )
}
