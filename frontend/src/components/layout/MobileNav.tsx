import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

import { navItems } from "./nav-config"

export function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-5 gap-1.5">
        {navItems.slice(0, 5).map(({ label, href, icon: Icon, badge }) => (
          <li key={label}>
            <NavLink
              to={href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <span className="relative flex size-7 items-center justify-center rounded-lg">
                <Icon className="size-4" />
                {badge ? (
                  <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[8px] font-semibold text-destructive-foreground">
                    {badge}
                  </span>
                ) : null}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
