"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Loader2 } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useSignin } from "~/hooks/api/auth"

type LoginFormValues = {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  })

  const { siginUserWithEmailAndPasswordAsync, isError, error, isPending } = useSignin()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await siginUserWithEmailAndPasswordAsync({
        email: values.email,
        password: values.password,
      })
      router.replace("/dashboard")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #D4CFC6",
          borderRadius: 12,
          padding: "32px 28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="22" height="22" rx="4" stroke="#1A3D2B" strokeWidth="1.8" fill="none" />
              <line x1="8" y1="10" x2="20" y2="10.3" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="14.5" x2="18" y2="14.2" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="19" x2="15" y2="19.1" stroke="#1A3D2B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0F0F0E" }}>Formit</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F0F0E", margin: 0 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#6B6860", marginTop: 4 }}>
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F0F0E", marginBottom: 6 }}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...form.register("email", { required: "Email is required" })}
                style={{ borderColor: form.formState.errors.email ? "#ef4444" : undefined }}
              />
              {form.formState.errors.email && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: "#0F0F0E" }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: "#1A3D2B", fontWeight: 600, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register("password", { required: "Password is required" })}
                style={{ borderColor: form.formState.errors.password ? "#ef4444" : undefined }}
              />
              {form.formState.errors.password && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* API Error */}
            {isError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
                  {(error as any)?.message ?? "Login failed. Please check your credentials."}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={form.formState.isSubmitting || isPending}
              style={{
                width: "100%",
                padding: "11px 0",
                background: (form.formState.isSubmitting || isPending) ? "#4a7a5c" : "#1A3D2B",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: (form.formState.isSubmitting || isPending) ? "not-allowed" : "pointer",
                transition: "background 150ms, box-shadow 150ms, transform 150ms",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => { if (!(form.formState.isSubmitting || isPending)) { e.currentTarget.style.boxShadow = "2px 2px 0 #0F0F0E"; e.currentTarget.style.transform = "translate(-1px,-1px)"; } }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              {(form.formState.isSubmitting || isPending) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {form.formState.isSubmitting || isPending ? "Logging in…" : "Log in"}
            </button>



            {/* Sign up link */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#6B6860", margin: 0 }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "#1A3D2B", fontWeight: 600, textDecoration: "none" }}>
                Sign up free
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
