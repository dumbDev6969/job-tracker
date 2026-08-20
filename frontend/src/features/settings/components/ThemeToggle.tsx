import { Laptop, Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme, type ThemeMode } from "../hooks/useTheme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: "light", label: "Light", icon: Sun },
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "system", label: "System", icon: Laptop },
  ]

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sun className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize how the job tracker interface looks.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {themes.map(({ mode, label, icon: Icon }) => {
          const isSelected = theme === mode
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5 text-primary shadow-xs font-semibold"
                  : "border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
