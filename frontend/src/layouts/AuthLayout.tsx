import { Navigate, Outlet } from "react-router-dom"

import { useAuthSession } from "@/features/auth"

export function AuthLayout() {
  const { status, isAuthenticated } = useAuthSession()

  if (status === "loading") {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <Outlet />
      </div>
    </div>
  )
}
