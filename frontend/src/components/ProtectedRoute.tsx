import { Link, Navigate, Outlet, useLocation } from "react-router-dom"
import { AlertCircle, RefreshCw } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { useAuthSession } from "@/features/auth"
import { cn } from "@/lib/utils"

export function ProtectedRoute() {
  const location = useLocation()
  const { status, errorMessage, isAuthenticated, refreshSession } = useAuthSession()

  if (status === "loading") {
    return null
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-card p-6 text-center shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-foreground">Authentication Error</h2>
          <p className="text-xs text-muted-foreground">
            {errorMessage ?? "Unable to verify authentication state. Please ensure the backend server is running."}
          </p>
          <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => void refreshSession()}
            >
              <RefreshCw className="size-3.5" />
              Retry Connection
            </Button>
            <Link
              to="/welcome"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
