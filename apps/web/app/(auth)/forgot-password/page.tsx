"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import { Input } from "~/components/ui/input"
import { useForgotPassword } from "~/hooks/api/auth"
import { RedirectIfAuthenticated } from "~/components/auth-aware-link"

type ForgotPasswordValues = {
  email: string
}

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordValues>({
    defaultValues: { email: "" },
  })

  const { forgotPasswordAsync, isPending, isSuccess, isError, error } = useForgotPassword()

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await forgotPasswordAsync({
        email: values.email,
        webUrl: window.location.origin,
      })
    } catch (err) {
      console.error("Forgot password request failed:", err)
    }
  }

  return (
    <RedirectIfAuthenticated>
      <div
        className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
        style={{ background: "#F9F8F4" }}
      >
        <div className="w-full max-w-sm">
          <div
            style={{
              background: "#fff",
              border: "1px solid #D4CFC6",
              borderRadius: 12,
              padding: "32px 28px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
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
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F0F0E", margin: 0 }}>Reset your password</h1>
              <p style={{ fontSize: 14, color: "#6B6860", marginTop: 4 }}>
                Enter your email address and we will send you secure reset instructions.
              </p>
            </div>

            {isSuccess ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "#F4F7F5", border: "1px solid #D4E2D8", borderRadius: 8, padding: "14px", display: "flex", gap: 10, alignItems: "start" }}>
                  <Mail className="h-5 w-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1A3D2B", margin: 0 }}>Check your inbox</p>
                    <p style={{ fontSize: 13, color: "#4A7A5C", margin: "4px 0 0 0" }}>
                      If an account exists with that email, secure instructions have been sent.
                    </p>
                  </div>
                </div>
                <Link
                  href="/login"
                  style={{
                    width: "100%",
                    padding: "11px 0",
                    background: "#1A3D2B",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Log in
                </Link>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label htmlFor="reset-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0F0F0E", marginBottom: 6 }}>
                      Email address
                    </label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      {...form.register("email", { required: "Email is required" })}
                      style={{ borderColor: form.formState.errors.email ? "#ef4444" : undefined }}
                    />
                    {form.formState.errors.email && (
                      <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  {isError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
                      <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
                        {(error as any)?.message ?? "Something went wrong. Please try again."}
                      </p>
                    </div>
                  )}

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
                    {form.formState.isSubmitting || isPending ? "Sending instructions…" : "Send reset instructions"}
                  </button>

                  <p style={{ textAlign: "center", fontSize: 13, color: "#6B6860", margin: 0 }}>
                    <Link href="/login" style={{ color: "#6B6860", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <ArrowLeft className="h-3.5 w-3.5" /> Back to Log in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </RedirectIfAuthenticated>
  )
}
