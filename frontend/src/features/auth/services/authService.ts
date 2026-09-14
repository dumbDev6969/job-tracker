import { api, setAuthToken } from "@/lib/api"
import type { AuthUser, LoginRequestPayload } from "@/features/auth/types"

const TOKEN_KEY = "auth_token"

export async function login(payload: LoginRequestPayload) {
  const response = await api.post<{ user: AuthUser; token: string }>("/api/login", payload)
  const { token } = response.data
  sessionStorage.setItem(TOKEN_KEY, token)
  setAuthToken(token)
  return response
}

export async function logout() {
  try {
    await api.post("/api/logout")
  } finally {
    sessionStorage.removeItem(TOKEN_KEY)
    setAuthToken(null)
  }
}

export async function getCurrentUser() {
  const response = await api.get<AuthUser>("/api/user")
  return response.data
}

export function restoreAuthToken(): boolean {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (token) {
    setAuthToken(token)
    return true
  }
  return false
}
