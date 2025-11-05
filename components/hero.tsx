"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingUp } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 float">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                <span className="bg-clip-text text-transparent bg-gradient-green-purple">Reduce. Reuse.</span>
                <br />
                <span className="text-foreground">Reward.</span>
              </h1>
              <p className="text-lg text-foreground/70 max-w-md leading-relaxed">
                Join 50,000+ eco-warriors in reducing waste, buying secondhand, and earning green rewards while building
                a sustainable future.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-green-purple hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link href="/marketplace">Start Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/30 bg-transparent">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>

            <div className="flex gap-6 pt-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-green-purple">50K+</p>
                <p className="text-sm text-foreground/60">Active Users</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-green-purple">100K+</p>
                <p className="text-sm text-foreground/60">Items Listed</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-green-purple">2M+</p>
                <p className="text-sm text-foreground/60">CO2 Saved</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/sustainable-lifestyle-eco-friendly-community-green.jpg"
              alt="Sustainable lifestyle"
              className="w-full rounded-2xl shadow-2xl glow"
            />
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xl border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-green-purple flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">+280% Growth</p>
                  <p className="text-xs text-foreground/60">This quarter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
