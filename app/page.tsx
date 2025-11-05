"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      if (!isAuthenticated) {
        router.push("/auth?mode=signin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [mounted, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-foreground/60">Loading...</p>
      </div>
    </div>
  )
}
