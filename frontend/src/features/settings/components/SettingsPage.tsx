import { NotificationToggle } from "./NotificationToggle"
import { ThemeToggle } from "./ThemeToggle"
import { VerifyEmail } from "./VerifyEmail"

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences, theme, and notification settings.
        </p>
      </div>

      <div className="space-y-6">
        <VerifyEmail />
        <ThemeToggle />
        <NotificationToggle />
      </div>
    </div>
  )
}
