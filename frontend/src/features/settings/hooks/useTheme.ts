import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark" | "system"

const STORAGE_KEY = "app_theme"

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const isDark = theme === "dark" || (theme === "system" && systemDark)

  if (isDark) {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

// Initialize theme immediately on script load to avoid flicker
const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
applyTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system")

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved
    }
    return "system"
  })

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }

  useEffect(() => {
    applyTheme(theme)

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => applyTheme("system")
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  return { theme, setTheme }
}
