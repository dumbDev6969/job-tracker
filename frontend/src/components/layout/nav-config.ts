import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusiness,
  CalendarRange,
  CircleUserRound,
  LayoutGrid,
  Settings,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/overview", icon: LayoutGrid },
  { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness },
  { label: "Calendar", href: "/calendar", icon: CalendarRange },
  { label: "Profile", href: "/profile", icon: CircleUserRound },
  { label: "Settings", href: "/settings", icon: Settings },
]
