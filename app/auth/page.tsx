"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mail, Lock, User, Leaf } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { WelcomeSplash } from "@/components/welcome-splash"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") || "signin"
  const [isSignup, setIsSignup] = useState(mode === "signup")
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showSplash, setShowSplash] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login'
      const body = isSignup
        ? { email, password, displayName: fullName, username: email.split('@')[0] }
        : { email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const data = await response.json()
        // Store JWT token in cookie instead of localStorage
        document.cookie = `auth-token=${data.token}; path=/; max-age=604800; samesite=strict`
        setLoading(false)
        setShowSplash(true)
        // Redirect after splash finishes (5 seconds)
        setTimeout(() => {
          router.push("/dashboard")
        }, 5500)
      } else {
        const error = await response.json()
        alert(error.error || 'Authentication failed')
        setLoading(false)
      }
    } catch (error) {
      console.error('Auth error:', error)
      alert('Authentication failed. Please try again.')
      setLoading(false)
    }
  }

  if (showSplash) {
    return <WelcomeSplash />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-green-purple rounded-lg blur opacity-75"></div>
              <Leaf className="relative w-8 h-8 text-accent fill-accent" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-green-purple">ReuseHub</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{isSignup ? "Join ReuseHub" : "Welcome Back"}</h1>
          <p className="text-foreground/60 text-sm mt-2">
            {isSignup ? "Start your sustainable journey today" : "Continue to your dashboard"}
          </p>
        </div>

        <Card className="p-8 border-primary/20 bg-slate-900 border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-slate-800 border-primary/20 text-white placeholder:text-foreground/30"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800 border-primary/20 text-white placeholder:text-foreground/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-800 border-primary/20 text-white placeholder:text-foreground/30"
                  required
                />
              </div>
            </div>

            {isSignup && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded"
                  required
                />
                <label htmlFor="terms" className="text-xs text-foreground/60">
                  I agree to the terms and privacy policy
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-green-purple hover:opacity-90 text-white"
            >
              {loading ? "Loading..." : isSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/60 mb-2">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsSignup(!isSignup)
                router.push(`/auth?mode=${isSignup ? "signin" : "signup"}`)
              }}
              className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </Card>

        <p className="text-xs text-foreground/50 text-center mt-6">
          By continuing, you agree to ReuseHub's terms and privacy policy
        </p>
      </div>
    </div>
  )
}
