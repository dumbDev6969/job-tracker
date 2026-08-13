import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuthSession } from "@/features/auth"

export function ProtectedRoute() {
  const location = useLocation()
  const { status, errorMessage, isAuthenticated } = useAuthSession()

  if (status === "loading") {
    return null
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-destructive">
        {errorMessage ?? "Unable to verify authentication state."}
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
