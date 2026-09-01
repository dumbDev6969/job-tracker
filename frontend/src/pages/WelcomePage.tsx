import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Calendar,
  Check,
  CircleCheckBig,
  Clock3,
  ExternalLink,
  Filter,
  Handshake,
  Moon,
  MoreHorizontal,
  OctagonX,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Table as TableIcon,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/features/settings"
import { cn } from "@/lib/utils"
import sampleData from "@/sampleData/sample.json"

const KPI_META: Record<
  string,
  {
    icon: typeof Clock3
    cardClass: string
    iconClass: string
    barClass: string
  }
> = {
  saved: {
    icon: Clock3,
    cardClass: "border-border/70",
    iconClass: "text-muted-foreground",
    barClass: "bg-muted-foreground",
  },
  applied: {
    icon: Briefcase,
    cardClass: "border-blue-500/25",
    iconClass: "text-blue-600 dark:text-blue-400",
    barClass: "bg-blue-600 dark:bg-blue-400",
  },
  interviewing: {
    icon: CircleCheckBig,
    cardClass: "border-amber-500/25",
    iconClass: "text-amber-600 dark:text-amber-400",
    barClass: "bg-amber-600 dark:bg-amber-400",
  },
  offered: {
    icon: Handshake,
    cardClass: "border-emerald-500/25",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    barClass: "bg-emerald-600 dark:bg-emerald-400",
  },
  rejected: {
    icon: OctagonX,
    cardClass: "border-destructive/25",
    iconClass: "text-destructive",
    barClass: "bg-destructive",
  },
}

type JobStatus = "saved" | "applied" | "interviewing" | "offered" | "rejected"

type MockJob = {
  id: number
  status: string
  company: string
  role: string
  location: string
  salary: string
  appliedDate: string
  dateSaved: string
  referral: boolean
}

const STATUS_BADGE_STYLE: Record<JobStatus, string> = {
  saved: "bg-muted text-muted-foreground border-border/80",
  applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  interviewing: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  offered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

const FEATURE_ICONS = [
  { icon: Briefcase, colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { icon: TrendingUp, colorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { icon: Calendar, colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { icon: ShieldCheck, colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
]

export function WelcomePage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<"overview" | "jobs">("overview")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const jobsList = sampleData.jobs as MockJob[]

  const filteredJobs = useMemo(() =>
    jobsList.filter((job) => {
      const matchesFilter = selectedStatusFilter === "all" || job.status === selectedStatusFilter
      const matchesSearch =
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.role.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    }), [jobsList, selectedStatusFilter, searchQuery])

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Subtle Background Glow Accents */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[850px] max-w-full rounded-full bg-gradient-to-tr from-primary/10 via-purple-500/10 to-blue-500/10 blur-3xl" />
        <div className="absolute top-[600px] -right-40 h-[380px] w-[450px] rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-[1000px] -left-40 h-[380px] w-[450px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-950 text-white font-bold shadow-sm dark:bg-zinc-900 ring-1 ring-border/50">
              JT
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground">Job Track</span>
              <Badge variant="secondary" className="hidden text-[10px] uppercase font-semibold sm:inline-flex">
                v1.0
              </Badge>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#demo-preview" className="hover:text-foreground transition-colors">
              Interactive Demo
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              How It Works
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:inline-flex font-medium"
              )}
            >
              Sign In
            </Link>

            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "gap-1.5 shadow-xs font-semibold"
              )}
            >
              Get Started
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-4 pt-12 pb-14 text-center sm:px-6 sm:pt-20 sm:pb-20 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-xs shadow-2xs">
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Smart Job Application & Pipeline Tracker</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-semibold">Interactive Preview</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Take complete control of your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                job search pipeline
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base text-muted-foreground sm:text-lg lg:text-xl max-w-2xl mx-auto text-balance">
              This is my personal project built to organize job opportunities, visualize interview conversion rates, track follow-up dates, and streamline the job hunt.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full sm:w-auto gap-2 text-base px-6 h-11 shadow-sm font-semibold"
                )}
              >
                Start Tracking Free
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#demo-preview"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto gap-2 text-base px-6 h-11 border-border/80"
                )}
              >
                <BarChart3 className="size-4 text-primary" />
                Explore Mock UI Demo
              </a>
            </div>

            {/* Value Checkmarks */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 pt-3 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-emerald-500 font-bold" />
                <span>Real-time KPI status snapshot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-emerald-500 font-bold" />
                <span>Interactive application table</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-4 text-emerald-500 font-bold" />
                <span>Referred vs cold apply metrics</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Dashboard Showcase (Mac Window Container) */}
        <section id="demo-preview" className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {/* Interactive Tab Switcher Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Interactive Platform Showcase
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Explore high-fidelity mockups of the Overview analytics and Jobs table.
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer",
                    activeTab === "overview"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <BarChart3 className="size-4" />
                  <span>Overview & KPIs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("jobs")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all cursor-pointer",
                    activeTab === "jobs"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <TableIcon className="size-4" />
                  <span>Jobs Table</span>
                </button>
              </div>
            </div>

            {/* Dashboard Mock Window Shell */}
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl ring-1 ring-border/50">
              {/* Window Titlebar */}
              <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-medium text-muted-foreground hidden sm:inline">
                    jobtrack.app/{activeTab === "overview" ? "overview" : "jobs"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[11px] font-normal border-border bg-background">
                    Mock Preview
                  </Badge>
                  <Link
                    to="/login"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "xs" }),
                      "h-7 text-xs gap-1.5 font-medium"
                    )}
                  >
                    Open in App
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>

              {/* Window Content */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {activeTab === "overview" ? (
                  /* ========================================================= */
                  /* OVERVIEW PAGE MOCK DESIGN (from OverviewPage.tsx)        */
                  /* ========================================================= */
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                          Job Applications Overview
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Track your job applications, conversion stages, and daily momentum.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live Pipeline Stats</span>
                      </div>
                    </div>

                    {/* Status Snapshot KPIs */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold tracking-tight text-foreground">
                          Status Snapshot
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          28 tracked opportunities
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {sampleData.kpis.map((kpi) => {
                          const meta = KPI_META[kpi.key] ?? KPI_META.saved
                          const Icon = meta.icon
                          return (
                            <Card
                              key={kpi.key}
                              className={cn(
                                "gap-0 border bg-card/90 py-2.5 shadow-2xs transition-all hover:shadow-xs",
                                meta.cardClass
                              )}
                            >
                              <CardHeader className="pt-1 pb-1.5 px-4">
                                <CardTitle className="flex items-center justify-between text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                  {kpi.label}
                                  <Icon className={cn("size-4", meta.iconClass)} />
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2 pb-2 px-4">
                                <div className="flex items-baseline justify-between">
                                  <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    {kpi.count}
                                  </p>
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {kpi.ratio}%
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                      className={cn("h-full rounded-full transition-all duration-500", meta.barClass)}
                                      style={{ width: `${kpi.ratio}%` }}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    {/* Daily Applications Interactive Chart Mock */}
                    <Card className="border border-border/80 shadow-xs overflow-hidden">
                      <CardHeader className="flex flex-col items-stretch border-b border-border/70 p-0 sm:flex-row">
                        <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4 sm:py-5">
                          <CardTitle className="text-base font-semibold">Daily Applications</CardTitle>
                          <CardDescription className="text-xs">
                            Visual breakdown of application volume across timeline and source channel.
                          </CardDescription>
                        </div>
                        <div className="grid grid-cols-3 border-t border-border/70 sm:border-t-0 sm:border-l">
                          <div className="flex flex-1 flex-col justify-center gap-0.5 border-r border-border/70 px-4 py-3 text-left sm:px-6 sm:py-4">
                            <span className="text-[11px] text-muted-foreground">Total Applied</span>
                            <span className="text-base font-bold sm:text-2xl text-foreground">14</span>
                          </div>
                          <div className="flex flex-1 flex-col justify-center gap-0.5 border-r border-border/70 px-4 py-3 text-left sm:px-6 sm:py-4">
                            <span className="text-[11px] text-blue-600 dark:text-blue-400">Referred</span>
                            <span className="text-base font-bold sm:text-2xl text-foreground">8</span>
                          </div>
                          <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-3 text-left sm:px-6 sm:py-4">
                            <span className="text-[11px] text-muted-foreground">Cold Apply</span>
                            <span className="text-base font-bold sm:text-2xl text-foreground">6</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 sm:p-6">
                        {/* CSS / SVG Bar Chart representation */}
                        <div className="space-y-4">
                          <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-border/60">
                            {sampleData.chartBars.map((bar, index) => {
                              const heightPct = (bar.count / 6) * 100
                              return (
                                <div
                                  key={bar.date}
                                  className="group relative flex flex-1 flex-col items-center h-full justify-end"
                                >
                                  {/* Tooltip on hover */}
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 z-20 rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background shadow-md pointer-events-none whitespace-nowrap">
                                    {bar.count} apps ({bar.date})
                                  </div>

                                  {/* Bar column */}
                                  <div
                                    className={cn(
                                      "w-full max-w-[40px] rounded-t-md transition-all duration-300 group-hover:scale-y-105 origin-bottom",
                                      index % 2 === 0 ? "bg-primary/90" : "bg-primary/70"
                                    )}
                                    style={{ height: `${heightPct}%` }}
                                  />
                                </div>
                              )
                            })}
                          </div>

                          {/* X-Axis Date Labels */}
                          <div className="flex justify-between gap-2 px-2 text-[11px] text-muted-foreground">
                            {sampleData.chartBars.map((bar) => (
                              <span key={bar.date} className="flex-1 text-center truncate">
                                {bar.date}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  /* ========================================================= */
                  /* JOBS TABLE PAGE MOCK DESIGN (from JobsPage.tsx)          */
                  /* ========================================================= */
                  <div className="space-y-4">
                    {/* Top Action Bar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                          Job Applications
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Track, search, and manage your pipeline opportunities.
                        </p>
                      </div>

                      <Link
                        to="/login"
                        className={cn(
                          buttonVariants({ variant: "default", size: "sm" }),
                          "gap-2 shrink-0 self-start sm:self-auto"
                        )}
                      >
                        <PlusCircle className="size-4" />
                        Add new job
                      </Link>
                    </div>

                    {/* Filter & Search Toolbar */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-1 flex-wrap items-center gap-2">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Filter by company or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </div>

                        {/* Status Filter Chips */}
                        <div className="flex items-center gap-1 overflow-x-auto py-1">
                          {[
                            { label: "All", value: "all" },
                            { label: "Offered", value: "offered" },
                            { label: "Interviewing", value: "interviewing" },
                            { label: "Applied", value: "applied" },
                            { label: "Saved", value: "saved" },
                          ].map((chip) => (
                            <button
                              key={chip.value}
                              type="button"
                              onClick={() => setSelectedStatusFilter(chip.value)}
                              className={cn(
                                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                                selectedStatusFilter === chip.value
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Filter className="size-3.5" />
                        <span>Showing {filteredJobs.length} of {jobsList.length} jobs</span>
                      </div>
                    </div>

                    {/* Responsive Data Table */}
                    <div className="overflow-x-auto rounded-xl border border-border/80 bg-background shadow-2xs">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-border/70 bg-muted/40 text-xs font-semibold text-muted-foreground">
                          <tr>
                            <th className="p-3 sm:px-4 sm:py-3 w-8">
                              <input type="checkbox" className="rounded border-input accent-primary" defaultChecked />
                            </th>
                            <th className="p-3 sm:px-4 sm:py-3">Status</th>
                            <th className="p-3 sm:px-4 sm:py-3">Company</th>
                            <th className="p-3 sm:px-4 sm:py-3">Role</th>
                            <th className="p-3 sm:px-4 sm:py-3 hidden md:table-cell">Comp / Salary</th>
                            <th className="p-3 sm:px-4 sm:py-3 hidden sm:table-cell">Applied</th>
                            <th className="p-3 sm:px-4 sm:py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {filteredJobs.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                                No applications match the filter.
                              </td>
                            </tr>
                          ) : (
                            filteredJobs.map((job) => {
                              const statusStyle = STATUS_BADGE_STYLE[job.status as JobStatus] ?? STATUS_BADGE_STYLE.saved
                              return (
                                <tr
                                  key={job.id}
                                  className="transition-colors hover:bg-muted/40 group"
                                >
                                  <td className="p-3 sm:px-4 sm:py-3">
                                    <input type="checkbox" className="rounded border-input accent-primary" />
                                  </td>
                                  <td className="p-3 sm:px-4 sm:py-3">
                                    <Badge
                                      variant="outline"
                                      className={cn("capitalize text-xs font-medium", statusStyle)}
                                    >
                                      {job.status}
                                    </Badge>
                                  </td>
                                  <td className="p-3 sm:px-4 sm:py-3 font-semibold text-foreground">
                                    <div className="flex items-center gap-2">
                                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                                        {job.company[0]}
                                      </div>
                                      <span>{job.company}</span>
                                      {job.referral ? (
                                        <Badge variant="secondary" className="text-[10px] px-1 py-0 text-blue-600 dark:text-blue-400">
                                          Referral
                                        </Badge>
                                      ) : null}
                                    </div>
                                  </td>
                                  <td className="p-3 sm:px-4 sm:py-3 text-foreground font-normal">
                                    {job.role}
                                  </td>
                                  <td className="p-3 sm:px-4 sm:py-3 text-muted-foreground hidden md:table-cell">
                                    {job.salary}
                                  </td>
                                  <td className="p-3 sm:px-4 sm:py-3 text-muted-foreground hidden sm:table-cell">
                                    {job.appliedDate}
                                  </td>
                                  <td className="p-3 sm:px-4 sm:py-3 text-right">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 text-muted-foreground group-hover:text-foreground"
                                      aria-label="Job actions"
                                    >
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Table Pagination Footer Mock */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>1 of {filteredJobs.length} row(s) selected</span>
                      <div className="flex items-center gap-2">
                        <span>Page 1 of 1</span>
                        <Button variant="outline" size="xs" disabled className="h-7 text-xs">
                          Previous
                        </Button>
                        <Button variant="outline" size="xs" disabled className="h-7 text-xs">
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="border-t border-border/60 bg-muted/20 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-xs font-semibold tracking-wider text-primary uppercase">
                Powerful Capabilities
              </h2>
              <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Engineered for serious job seekers
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Everything you need to turn chaos into a streamlined, high-converting career pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleData.features.map((feature, idx) => {
                const iconConfig = FEATURE_ICONS[idx % FEATURE_ICONS.length]
                const IconComponent = iconConfig.icon
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs space-y-3 transition-all hover:border-primary/40 hover:shadow-xs"
                  >
                    <div className={cn("flex size-10 items-center justify-center rounded-xl", iconConfig.colorClass)}>
                      <IconComponent className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Workflow Steps Section */}
        <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-xs font-semibold tracking-wider text-primary uppercase">
                Workflow
              </h2>
              <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How Job Track accelerates your search
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sampleData.workflowSteps.map((step) => (
                <div key={step.step} className="relative flex flex-col items-center text-center space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-border/80 bg-gradient-to-tr from-primary/10 via-card to-card p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
            <div className="space-y-4 max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready to organize your job search?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join ambitious professionals tracking applications with clarity, confidence, and speed.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to="/login"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "px-8 h-12 font-semibold shadow-md inline-flex items-center justify-center gap-2"
                  )}
                >
                  Get Started Now
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/10 py-8 px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-zinc-950 text-white font-bold text-[10px] dark:bg-zinc-900">
              JT
            </div>
            <span className="font-semibold text-foreground">Job Track</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#demo-preview" className="hover:text-foreground transition-colors">
              Interactive Demo
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <Link to="/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
