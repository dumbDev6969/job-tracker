import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Briefcase,
  CheckCircle2,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Sparkles,
  TrendingUp,
  UploadCloud,
  User,
  X,
} from "lucide-react"

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuthSession } from "@/features/auth"
import {
  ALL_JOB_APPLICATIONS_KEY,
  listAllJobApplications,
} from "@/features/job-track/services/jobService"
import { cn } from "@/lib/utils"

type JobSearchStatus = "actively_looking" | "open_to_offers" | "not_looking"

type ProfileData = {
  fullName: string
  headline: string
  location: string
  phone: string
  bio: string
  status: JobSearchStatus
  targetRoles: string[]
  workplaceTypes: string[]
  employmentTypes: string[]
  targetSalary: string
  portfolioUrl: string
  githubUrl: string
  linkedinUrl: string
  resumeFileName: string
  resumeFileSize: string
  resumeUpdatedAt: string
}

const DEFAULT_PROFILE: ProfileData = {
  fullName: "",
  headline: "Full Stack Engineer & Web Developer",
  location: "Manila, Philippines (Open to Remote)",
  phone: "+63 917 123 4567",
  bio: "Passionate engineer with experience building full-stack web applications using React, TypeScript, and Laravel. Focused on high-performance interfaces and scalable APIs.",
  status: "actively_looking",
  targetRoles: ["Full Stack Engineer", "Frontend Developer", "Software Engineer"],
  workplaceTypes: ["Remote", "Hybrid"],
  employmentTypes: ["Full-time", "Contract"],
  targetSalary: "$80,000 - $110,000 / year",
  portfolioUrl: "https://portfolio.dev",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  resumeFileName: "Joshua_Resume_2026.pdf",
  resumeFileSize: "142 KB",
  resumeUpdatedAt: "Aug 2026",
}

const STATUS_CONFIG: Record<
  JobSearchStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  actively_looking: {
    label: "Actively Looking",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  open_to_offers: {
    label: "Open to Offers",
    badgeClass: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dotClass: "bg-blue-500",
  },
  not_looking: {
    label: "Not Looking",
    badgeClass: "border-muted bg-muted/40 text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
}

const WORKPLACE_OPTIONS = ["Remote", "Hybrid", "On-site"]
const EMPLOYMENT_OPTIONS = ["Full-time", "Part-time", "Contract", "Freelance"]

export function ProfilePage() {
  const { user } = useAuthSession()
  const storageKey = `job_tracker_profile_${user?.id ?? "default"}`

  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
      }
    } catch {
      // ignore
    }
    return {
      ...DEFAULT_PROFILE,
      fullName: user?.name ?? DEFAULT_PROFILE.fullName,
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<ProfileData>(profile)
  const [newRoleInput, setNewRoleInput] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)

  // Fetch real job stats from backend for live snapshot
  const { data: applications = [] } = useQuery({
    queryKey: ALL_JOB_APPLICATIONS_KEY,
    queryFn: listAllJobApplications,
  })

  // Sync user name when user loads if not yet set
  useEffect(() => {
    if (user?.name && !profile.fullName) {
      setProfile((prev) => ({ ...prev, fullName: user.name }))
      setEditValues((prev) => ({ ...prev, fullName: user.name }))
    }
  }, [user?.name, profile.fullName])

  const handleSave = () => {
    setProfile(editValues)
    try {
      localStorage.setItem(storageKey, JSON.stringify(editValues))
    } catch {
      // ignore
    }
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleCancel = () => {
    setEditValues(profile)
    setIsEditing(false)
  }

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newRoleInput.trim()
    if (trimmed && !editValues.targetRoles.includes(trimmed)) {
      setEditValues((prev) => ({
        ...prev,
        targetRoles: [...prev.targetRoles, trimmed],
      }))
      setNewRoleInput("")
    }
  }

  const handleRemoveRole = (role: string) => {
    setEditValues((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.filter((r) => r !== role),
    }))
  }

  const toggleWorkplace = (type: string) => {
    setEditValues((prev) => ({
      ...prev,
      workplaceTypes: prev.workplaceTypes.includes(type)
        ? prev.workplaceTypes.filter((t) => t !== type)
        : [...prev.workplaceTypes, type],
    }))
  }

  const toggleEmployment = (type: string) => {
    setEditValues((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type],
    }))
  }

  const handleSimulateResumeUpload = () => {
    setIsUploadingResume(true)
    setTimeout(() => {
      const now = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
      const updated = {
        ...profile,
        resumeFileName: `${(profile.fullName || "Candidate").replace(/\s+/g, "_")}_Resume.pdf`,
        resumeUpdatedAt: now,
      }
      setProfile(updated)
      setEditValues(updated)
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {
        // ignore
      }
      setIsUploadingResume(false)
    }, 1200)
  }

  // Calculate profile completeness score
  const completenessItems = [
    Boolean(profile.fullName),
    Boolean(profile.headline),
    Boolean(profile.bio),
    Boolean(profile.location),
    Boolean(profile.phone),
    profile.targetRoles.length > 0,
    Boolean(profile.targetSalary),
    Boolean(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl),
    Boolean(profile.resumeFileName),
  ]
  const completedCount = completenessItems.filter(Boolean).length
  const completenessPercent = Math.round((completedCount / completenessItems.length) * 100)

  // Pipeline stats from live data
  const totalApps = applications.length
  const interviewingCount = applications.filter((a) => a.status === "interviewing").length
  const offeredCount = applications.filter((a) => a.status === "offered").length

  const userInitials = (profile.fullName || user?.name || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

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
              <Button type="button" onClick={handleSave} className="gap-2">
                <Save className="size-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
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
                  {profile.fullName || user?.name || "Your Name"}
                </h2>
                <Badge variant="outline" className={cn("gap-1.5 px-2.5 py-0.5", STATUS_CONFIG[profile.status].badgeClass)}>
                  <span className={cn("size-2 rounded-full", STATUS_CONFIG[profile.status].dotClass)} />
                  {STATUS_CONFIG[profile.status].label}
                </Badge>
              </div>

              <p className="text-base font-medium text-muted-foreground">{profile.headline}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-muted-foreground sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-primary" />
                  {user?.email ?? "user@example.com"}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-primary" />
                    {profile.phone}
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

      {/* Main Grid: 2 columns on large screens */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
        {/* Left Column: Personal Bio & Preferences */}
        <div className="space-y-6">
          {/* About / Bio Card */}
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
                        onChange={(e) => setEditValues((prev) => ({ ...prev, fullName: e.target.value }))}
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
                        onChange={(e) => setEditValues((prev) => ({ ...prev, headline: e.target.value }))}
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
                        onChange={(e) => setEditValues((prev) => ({ ...prev, location: e.target.value }))}
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
                        onChange={(e) => setEditValues((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+63 917 123 4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="statusSelect" className="text-xs font-semibold text-foreground">
                      Job Search Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["actively_looking", "open_to_offers", "not_looking"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setEditValues((prev) => ({ ...prev, status: st }))}
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
                      onChange={(e) => setEditValues((prev) => ({ ...prev, bio: e.target.value }))}
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

          {/* Job Search Preferences Card */}
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
                            onClick={() => handleRemoveRole(role)}
                            className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                            aria-label={`Remove ${role}`}
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <form onSubmit={handleAddRole} className="flex gap-2">
                      <Input
                        size={1}
                        className="h-8 text-xs"
                        placeholder="Add a role title (e.g. DevOps Engineer)"
                        value={newRoleInput}
                        onChange={(e) => setNewRoleInput(e.target.value)}
                      />
                      <Button type="submit" size="sm" variant="outline" className="h-8 gap-1 px-2.5 text-xs">
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
                          onClick={() => toggleWorkplace(opt)}
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
                          onClick={() => toggleEmployment(opt)}
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
                    onChange={(e) => setEditValues((prev) => ({ ...prev, targetSalary: e.target.value }))}
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
        </div>

        {/* Right Column: Links, Resume, & Live Activity Stats */}
        <div className="space-y-6">
          {/* Links & Portfolio Card */}
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
                      onChange={(e) => setEditValues((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
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
                      onChange={(e) => setEditValues((prev) => ({ ...prev, githubUrl: e.target.value }))}
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
                      onChange={(e) => setEditValues((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                      placeholder="https://portfolio.dev"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <a
                    href={profile.linkedinUrl || "#"}
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

                  <a
                    href={profile.githubUrl || "#"}
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

                  <a
                    href={profile.portfolioUrl || "#"}
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Primary Resume Card */}
          <Card className="rounded-3xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Resume / CV</CardTitle>
                  <CardDescription>Your primary document for job submissions.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground sm:text-sm">
                      {profile.resumeFileName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {profile.resumeFileSize} • Updated {profile.resumeUpdatedAt}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Download resume">
                  <Download className="size-4" />
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSimulateResumeUpload}
                disabled={isUploadingResume}
                className="w-full gap-2 text-xs"
              >
                <UploadCloud className="size-3.5" />
                {isUploadingResume ? "Uploading..." : "Upload New Version"}
              </Button>
            </CardContent>
          </Card>

          {/* Live Activity Snapshot */}
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
        </div>
      </div>
    </div>
  )
}
