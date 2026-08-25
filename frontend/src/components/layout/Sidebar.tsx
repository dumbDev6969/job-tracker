import { useState } from "react"
import {
  ChevronsUpDown,
  LogOut,
  Settings2,
  User,
} from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthSession } from "@/features/auth"
import { cn } from "@/lib/utils"

import { navItems, type NavItem } from "./nav-config"

type SidebarProps = {
  isCollapsed?: boolean
  className?: string
}

function getUserInitials(name: string | null | undefined) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

export function Sidebar({ isCollapsed = false, className }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuthSession()

  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      navigate("/login", { replace: true })
    } finally {
      setIsSigningOut(false)
    }
  }

  const userName = user?.name ?? "shadcn"
  const userEmail = user?.email ?? "m@example.com"
  const userInitials = getUserInitials(user?.name)

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen hidden shrink-0 flex-col justify-between border-r border-border/70 bg-card/60 px-3 py-4 backdrop-blur-md transition-all duration-200 ease-in-out md:flex",
        isCollapsed ? "w-[68px] items-center" : "w-64",
        className
      )}
    >
      {/* Top Section: Workspace / Brand Header */}
      <div className="w-full space-y-4 overflow-y-auto overflow-x-hidden">
        {isCollapsed ? (
          <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-xs dark:bg-zinc-900 mx-auto">
            JT
          </div>
        ) : (
          <div className="flex w-full items-center gap-3 rounded-2xl bg-muted/40 p-2 text-left border border-border/30">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-xs dark:bg-zinc-900">
              JT
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">Job Track</span>
              <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
            </div>
          </div>
        )}

        {/* Navigation Group */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
              Platform
            </p>
          )}

          <nav className="space-y-1" aria-label="Sidebar navigation">
            {navItems.map((item: NavItem) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              if (isCollapsed) {
                return (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    title={item.label}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl transition-colors mx-auto",
                      isActive
                        ? "bg-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </NavLink>
                )
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted/60 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: User Profile Pill */}
      <div className="w-full pt-4 shrink-0">
        {isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  title={`${userName} (${userEmail})`}
                  className="flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-xs shadow-xs ring-1 ring-border/80 hover:ring-primary/40 transition-all cursor-pointer mx-auto"
                >
                  {userInitials}
                </button>
              }
            />
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuGroupLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </DropdownMenuGroupLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2 cursor-pointer">
                  <User className="size-4 text-muted-foreground" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2 cursor-pointer">
                  <Settings2 className="size-4 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="size-4" />
                  {isSigningOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors hover:bg-muted/60 cursor-pointer border border-transparent hover:border-border/40"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-xs shadow-xs">
                    {userInitials}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-foreground">{userName}</span>
                    <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </button>
              }
            />
            <DropdownMenuContent side="top" align="start" className="w-60">
              <DropdownMenuGroup>
                <DropdownMenuGroupLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </DropdownMenuGroupLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2 cursor-pointer">
                  <User className="size-4 text-muted-foreground" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2 cursor-pointer">
                  <Settings2 className="size-4 text-muted-foreground" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="size-4" />
                  {isSigningOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  )
}
