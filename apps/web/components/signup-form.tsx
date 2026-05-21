"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Loader2 } from "lucide-react"
import { cn } from "~/lib/utils"
import { Input } from "~/components/ui/input"
import { useSignup } from "~/hooks/api/auth"

type SignupFormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const form = useForm<SignupFormValues>({
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  })

  const { createUserWithEmailAndPasswordAsync, isError, error, isPending } = useSignup()

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await createUserWithEmailAndPasswordAsync({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      })
      router.replace("/dashboard")
    } catch (err) {
      console.error("Signup failed:", err)
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    borderColor: hasError ? "#ef4444" : undefined,
  })

  return (
    <div className={cn("w-full", className)} {...props}>
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
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F0F0E", margin: 0 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "#6B6860", marginTop: 4 }}>
            Free forever. No credit card required.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Full name */}
            <div>
              <label htmlFor="fullName" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F0F0E", marginBottom: 6 }}>
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                style={inputStyle(!!form.formState.errors.fullName)}
                {...form.register("fullName", { required: "Full name is required" })}
              />
              {form.formState.errors.fullName && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{form.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F0F0E", marginBottom: 6 }}>
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle(!!form.formState.errors.email)}
                {...form.register("email", { required: "Email is required" })}
              />
              {form.formState.errors.email && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F0F0E", marginBottom: 6 }}>
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                style={inputStyle(!!form.formState.errors.password)}
                {...form.register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
              />
              {form.formState.errors.password && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F0F0E", marginBottom: 6 }}>
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                style={inputStyle(!!form.formState.errors.confirmPassword)}
                {...form.register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === form.getValues("password") || "Passwords do not match",
                })}
              />
              {form.formState.errors.confirmPassword && (
                <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* API Error */}
            {isError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
                  {(error as any)?.message ?? "Signup failed. Please try again."}
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
                marginTop: 4,
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
              {form.formState.isSubmitting || isPending ? "Creating account…" : "Create account"}
            </button>

            {/* Sign in link */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#6B6860", margin: 0 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#1A3D2B", fontWeight: 600, textDecoration: "none" }}>
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#6B6860", marginTop: 16 }}>
        By creating an account you agree to our{" "}
        <a href="#" style={{ color: "#1A3D2B" }}>Terms</a> and{" "}
        <a href="#" style={{ color: "#1A3D2B" }}>Privacy Policy</a>.
      </p>
    </div>
  )
}
