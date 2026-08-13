import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import axios from "axios"

import { getCurrentUser } from "@/features/auth/services/authService"
import type { AuthUser } from "@/features/auth/types"

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error"

type AuthSessionContextValue = {
  status: AuthStatus
  user: AuthUser | null
  errorMessage: string | null
  isAuthenticated: boolean
  refreshSession: () => Promise<void>
}

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(
  undefined
)

async function fetchCurrentUser() {
  try {
    return await getCurrentUser()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null
    }

    throw error
  }
}

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [user, setUser] = useState<AuthUser | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const refreshSession = useCallback(async () => {
    setStatus("loading")
    setErrorMessage(null)

    try {
      const currentUser = await fetchCurrentUser()

      if (currentUser) {
        setUser(currentUser)
        setStatus("authenticated")
        return
      }

      setUser(null)
      setStatus("unauthenticated")
    } catch (error) {
      const fallbackMessage = "Unable to verify your session right now."

      if (axios.isAxiosError(error)) {
        setErrorMessage(error.message || fallbackMessage)
      } else {
        setErrorMessage(fallbackMessage)
      }

      setUser(null)
      setStatus("error")
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      status,
      user,
      errorMessage,
      isAuthenticated: status === "authenticated",
      refreshSession,
    }),
    [status, user, errorMessage, refreshSession]
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider")
  }

  return context
}
