import { useState } from "react"
import { ArrowUpRight, LogOut } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuthSession } from "@/features/auth"
import { cn } from "@/lib/utils"

import { navItems } from "./nav-config"

type SidebarProps = {
  className?: string
}

function getUserInitials(name: string | null | undefined) {
  if (!name) {
    return "?"
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return "?"
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate()
  const { signOut, user } = useAuthSession()

  const [isSigningOut, setIsSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const handleLogout = async () => {
    setLogoutError(null)
    setIsSigningOut(true)

    try {
      await signOut()
      navigate("/login", { replace: true })
    } catch {
      setLogoutError("Unable to log out right now. Please try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  const userName = user?.name ?? "Unknown user"
  const userEmail = user?.email ?? "No email available"
  const userInitials = getUserInitials(user?.name)

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
              {userInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open profile"
            onClick={() => navigate("/profile")}
          >
            <ArrowUpRight className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-between gap-2"
          onClick={handleLogout}
          disabled={isSigningOut}
        >
          <span className="flex items-center gap-2">
            <LogOut className="size-4" />
            {isSigningOut ? "Logging out..." : "Log out"}
          </span>
        </Button>
        {logoutError ? <p className="text-sm text-destructive">{logoutError}</p> : null}
      </div>
    </aside>
  )
}
