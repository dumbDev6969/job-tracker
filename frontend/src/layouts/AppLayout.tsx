import { Outlet } from "react-router-dom"

import { MobileNav } from "@/components/layout/MobileNav"
import { Sidebar } from "@/components/layout/Sidebar"

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-8 lg:px-10">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
