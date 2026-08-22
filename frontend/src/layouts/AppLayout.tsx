import { useState } from "react"
import { Outlet } from "react-router-dom"
import { PanelLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/layout/MobileNav"
import { Sidebar } from "@/components/layout/Sidebar"

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("job_tracker_sidebar_collapsed") === "true"
    } catch {
      return false
    }
  })

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem("job_tracker_sidebar_collapsed", String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isCollapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navigation header with panel toggle */}
        <header className="sticky top-0 z-20 hidden h-14 items-center border-b border-border/50 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="size-4.5" />
          </Button>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-8 lg:px-10">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
