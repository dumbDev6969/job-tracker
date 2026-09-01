import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthSession } from "@/features/auth"
import { login } from "@/features/auth/services/authService"

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshSession } = useAuthSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/overview"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await login({
        email,
        password,
        remember,
      })
      await refreshSession()
      navigate(fromPath, { replace: true })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        setErrorMessage("Invalid email or password.")
      } else {
        setErrorMessage("Unable to sign in right now. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium text-primary">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Log in
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to access your account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
              }}
              required
              aria-describedby={errorMessage ? "login-error" : undefined}
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Button type="button" variant="link" className="h-auto p-0 text-xs">
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
                className="pr-10"
                required
                aria-describedby={errorMessage ? "login-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </Field>

          <Field orientation="horizontal" className="items-center justify-between">
            <label
              htmlFor="remember-me"
              className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
            >
              <Input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-input bg-background text-primary shadow-none accent-primary"
                checked={remember}
                onChange={(event) => {
                  setRemember(event.target.checked)
                }}
              />
              Remember me
            </label>
          </Field>

          {errorMessage && <FieldError id="login-error">{errorMessage}</FieldError>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-6 rounded-xl border border-border/60 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Personal Portfolio Instance</p>
        <p className="mt-0.5">Public registration is closed. Please sign in with authorized credentials.</p>
      </div>
    </>
  )
}
