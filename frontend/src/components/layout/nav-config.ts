import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  CalendarRange,
  LayoutGrid,
  Settings2,
  SquareTerminal,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/overview",
    icon: LayoutGrid,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: SquareTerminal,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: CalendarRange,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: BookOpen,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings2,
  },
]
