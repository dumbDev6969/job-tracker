import axios from "axios"

import { API_BASE_URL, api } from "@/lib/api"
import type { AuthUser, LoginRequestPayload } from "@/features/auth/types"

async function getCsrfCookie() {
  return axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  })
}

export async function login(payload: LoginRequestPayload) {
  await getCsrfCookie()
  return api.post("/login", payload)
}

export async function logout() {
  return api.post("/logout")
}

export async function getCurrentUser() {
  const response = await api.get<AuthUser>("/api/user")
  return response.data
}
