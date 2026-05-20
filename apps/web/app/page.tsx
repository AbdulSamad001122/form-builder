"use client"

import { useEffect } from "react";
import { useUser } from "../hooks/api/auth/index"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const { user, isLoading } = useUser() as any

  useEffect(() => {
    if (isLoading) return;

    if (user?.id) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [user, router, isLoading])

  return (
    <main className="min-h-screen w-full flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Formline</h1>
        {isLoading ? (
          <p>Verifying session...</p>
        ) : (
          <h2>Message: {JSON.stringify(user, null, 2)} </h2>
        )}
      </div>
    </main >
  );
}
