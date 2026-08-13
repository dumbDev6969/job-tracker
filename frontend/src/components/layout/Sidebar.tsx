import { ArrowUpRight, LogOut } from "lucide-react"
import { NavLink } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { navItems } from "./nav-config"

type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 flex-col border-r border-border bg-sidebar/80 px-4 py-5 backdrop-blur md:flex",
        className
      )}
    >
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
          JT
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Workspace</p>
          <h2 className="text-lg font-semibold text-foreground">JobTracker</h2>
        </div>
      </div>

      <nav className="space-y-1.5" aria-label="Sidebar navigation">
        {navItems.map(({ label, href, icon: Icon, badge }) => (
          <NavLink
            key={label}
            to={href}
            className={({ isActive }) =>
              cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      isActive
                        ? "bg-primary-foreground/10 text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  {label}
                </span>

                {badge ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      isActive ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted text-foreground"
                    )}
                  >
                    {badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-3 rounded-2xl border border-border bg-background/60 p-3">
        <div className="flex items-center justify-between rounded-xl bg-muted/80 p-2.5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              AM
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Alicia Moore</p>
              <p className="text-xs text-muted-foreground">Product Designer</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Open profile">
            <ArrowUpRight className="size-4" />
          </Button>
        </div>

        <Button type="button" variant="outline" className="w-full justify-between gap-2">
          <span className="flex items-center gap-2">
            <LogOut className="size-4" />
            Log out
          </span>
        </Button>
      </div>
    </aside>
  )
}
