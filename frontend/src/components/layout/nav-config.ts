import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusiness,
  CalendarRange,
  CircleUserRound,
  LayoutGrid,
  MessageSquareText,
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
  { label: "Jobs", href: "/jobs", icon: BriefcaseBusiness, badge: "12" },
  { label: "Calendar", href: "/calendar", icon: CalendarRange },
  { label: "Messages", href: "/messages", icon: MessageSquareText, badge: "3" },
  { label: "Profile", href: "/profile", icon: CircleUserRound },
  { label: "Settings", href: "/settings", icon: Settings },
]
