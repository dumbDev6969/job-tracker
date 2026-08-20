import { useState } from "react"
import { Bell, Mail, Smartphone } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"

export function NotificationToggle() {
  const [preferences, setPreferences] = useState({
    emailUpdates: true,
    interviewReminders: true,
    weeklyDigest: false,
    pushNotifications: true,
  })

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Bell className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Manage how and when you receive updates.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <label htmlFor="emailUpdates" className="text-sm font-medium text-foreground cursor-pointer">
                Email Updates
              </label>
              <p className="text-xs text-muted-foreground">Receive emails when your job application statuses change.</p>
            </div>
          </div>
          <Checkbox
            id="emailUpdates"
            checked={preferences.emailUpdates}
            onCheckedChange={() => toggle("emailUpdates")}
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex gap-3">
            <Bell className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <label htmlFor="interviewReminders" className="text-sm font-medium text-foreground cursor-pointer">
                Interview Reminders
              </label>
              <p className="text-xs text-muted-foreground">Get reminded 24 hours before scheduled interview dates.</p>
            </div>
          </div>
          <Checkbox
            id="interviewReminders"
            checked={preferences.interviewReminders}
            onCheckedChange={() => toggle("interviewReminders")}
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex gap-3">
            <Smartphone className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <label htmlFor="pushNotifications" className="text-sm font-medium text-foreground cursor-pointer">
                Push Notifications
              </label>
              <p className="text-xs text-muted-foreground">Receive real-time push alerts in your browser.</p>
            </div>
          </div>
          <Checkbox
            id="pushNotifications"
            checked={preferences.pushNotifications}
            onCheckedChange={() => toggle("pushNotifications")}
          />
        </div>

        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-muted/20 p-4">
          <div className="flex gap-3">
            <Mail className="mt-0.5 size-5 text-muted-foreground" />
            <div>
              <label htmlFor="weeklyDigest" className="text-sm font-medium text-foreground cursor-pointer">
                Weekly Digest
              </label>
              <p className="text-xs text-muted-foreground">A weekly summary of active applications and activity stats.</p>
            </div>
          </div>
          <Checkbox
            id="weeklyDigest"
            checked={preferences.weeklyDigest}
            onCheckedChange={() => toggle("weeklyDigest")}
          />
        </div>
      </div>
    </div>
  )
}
