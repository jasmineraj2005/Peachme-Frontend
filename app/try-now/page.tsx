"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function TryNowPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If user is logged in, redirect to upload page
        router.push("/upload")
      } else {
        // If user is not logged in, redirect to signup page with a redirect parameter
        router.push("/signup?redirectTo=/upload")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="container flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-lg text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}

