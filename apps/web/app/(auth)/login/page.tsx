import { LoginForm } from "~/components/login-form"
import { RedirectIfAuthenticated } from "~/components/auth-aware-link"

export default function Page() {
  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
      style={{ background: "#F9F8F4" }}
    >
      <RedirectIfAuthenticated />
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
