"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

  const { siginUserWithEmailAndPasswordAsync, isError, error } = useSignin()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { id } = await siginUserWithEmailAndPasswordAsync({
        email: values.email,
        password: values.password,
      })
      console.log(`Signed in with id ${id}`)
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
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "#0F0F0E" }}>Formline</span>
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: "#0F0F0E" }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: 12, color: "#1A3D2B", textDecoration: "none" }}
                  onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  Forgot password?
                </a>
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
              disabled={form.formState.isSubmitting}
              style={{
                width: "100%",
                padding: "11px 0",
                background: form.formState.isSubmitting ? "#4a7a5c" : "#1A3D2B",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: form.formState.isSubmitting ? "not-allowed" : "pointer",
                transition: "background 150ms, box-shadow 150ms, transform 150ms",
              }}
              onMouseOver={(e) => { if (!form.formState.isSubmitting) { e.currentTarget.style.boxShadow = "2px 2px 0 #0F0F0E"; e.currentTarget.style.transform = "translate(-1px,-1px)"; } }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              {form.formState.isSubmitting ? "Logging in…" : "Log in"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "#D4CFC6" }} />
              <span style={{ fontSize: 12, color: "#6B6860" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#D4CFC6" }} />
            </div>

            {/* Google */}
            <button
              type="button"
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#fff",
                border: "1px solid #D4CFC6",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#0F0F0E",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "border-color 150ms",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#0F0F0E")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#D4CFC6")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
              </svg>
              Continue with Google
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
