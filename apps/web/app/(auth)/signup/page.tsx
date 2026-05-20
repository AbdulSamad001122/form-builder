import { SignupForm } from "~/components/signup-form"
import { RedirectIfAuthenticated } from "~/components/auth-aware-link"

export default function SignupPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
      style={{ background: "#F9F8F4" }}
    >
      <RedirectIfAuthenticated />
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
