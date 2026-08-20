import { useState } from "react"
import { CheckCircle2, MailCheck, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthSession } from "@/features/auth"

type VerifyEmailProps = {
  email?: string
  isVerified?: boolean
}

export function VerifyEmail({
  email: initialEmail = "user@example.com",
  isVerified: initialIsVerified = false,
}: VerifyEmailProps) {
  const { user } = useAuthSession()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const email = user?.email ?? initialEmail
  const isVerified = user ? user.email_verified_at !== null : initialIsVerified

  const handleSendVerification = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MailCheck className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Email Verification</h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={
            isVerified
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }
        >
          {isVerified ? "Verified" : "Unverified"}
        </Badge>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {isVerified
            ? "Your email address has been verified. Re-verification is disabled."
            : "Your email address is not verified yet. Verifying your email helps secure your account and enables notification alerts."}
        </p>

        {sent ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Verification link sent! Please check your inbox.</span>
          </div>
        ) : (
          <Button
            onClick={handleSendVerification}
            disabled={loading || isVerified}
            variant="outline"
            className="gap-2"
          >
            <Send className="size-4" />
            {loading ? "Sending link..." : "Resend Verification Email"}
          </Button>
        )}
      </div>
    </div>
  )
}
