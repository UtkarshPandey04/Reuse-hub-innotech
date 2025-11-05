"use client"

import Link from "next/link"
import { Leaf, LogOut, MessageCircle, Sun, Moon, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [mounted, setMounted] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Check for auth token in cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
    setIsAuthenticated(!!token)

    // Fetch user profile if authenticated
    if (token) {
      fetch('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token.split('=')[1]}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.displayName) {
          setUserName(data.displayName)
        }
        // Fetch cart count
        if (data._id) {
          fetch(`/api/cart?userId=${data._id}`)
            .then(res => res.json())
            .then(cartItems => {
              const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
              setCartCount(totalItems)
            })
            .catch(() => {
              setCartCount(0)
            })
        }
      })
      .catch(() => {
        // If profile fetch fails, clear auth
        document.cookie = 'auth-token=; path=/; max-age=0'
        setIsAuthenticated(false)
      })
    }

    // Make updateCartCount available globally for marketplace page
    if (typeof window !== 'undefined') {
      (window as any).updateCartCount = updateCartCount
    }
  }, [])

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; max-age=0'
    setIsAuthenticated(false)
    setUserName("")
    setCartCount(0)
    router.push("/auth?mode=signin")
  }

  const updateCartCount = (newCount: number) => {
    setCartCount(newCount)
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-all-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-green-purple rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Leaf className="relative w-8 h-8 text-accent fill-accent" />
            </div>
            <span className="font-bold text-xl text-foreground">ReuseHub</span>
          </Link>

          <nav className="flex gap-8">
            <Link
              href="/dashboard"
              className={`transition-colors duration-200 ${
                pathname === '/dashboard'
                  ? 'text-accent font-semibold'
                  : 'text-foreground/70 hover:text-accent'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/marketplace"
              className={`transition-colors duration-200 ${
                pathname === '/marketplace'
                  ? 'text-accent font-semibold'
                  : 'text-foreground/70 hover:text-accent'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/challenges"
              className={`transition-colors duration-200 ${
                pathname === '/challenges'
                  ? 'text-accent font-semibold'
                  : 'text-foreground/70 hover:text-accent'
              }`}
            >
              Challenges
            </Link>
            <Link
              href="/blog"
              className={`transition-colors duration-200 ${
                pathname === '/blog'
                  ? 'text-accent font-semibold'
                  : 'text-foreground/70 hover:text-accent'
              }`}
            >
              Stories
            </Link>
            <Link
              href="/chatbot"
              className={`transition-colors duration-200 ${
                pathname === '/chatbot'
                  ? 'text-accent font-semibold'
                  : 'text-foreground/70 hover:text-accent'
              }`}
            >
              Support
            </Link>
          </nav>

          <div className="flex gap-2 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-foreground mr-4 hidden sm:block">
                  Welcome, {userName || 'User'}!
                </span>
                {mounted && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="border-accent/30 hover:bg-accent/5 bg-transparent"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="border-accent/30 hover:bg-accent/5 bg-transparent hidden sm:flex"
                >
                  <Link href="/chatbot" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    AI Support
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-accent/30 hover:bg-accent/5 bg-transparent relative"
                >
                  <Link href="/marketplace" className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-500/30 hover:bg-red-500/5 hover:text-red-400 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {mounted && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="border-accent/30 hover:bg-accent/5 bg-transparent"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </Button>
                )}
                <Button variant="outline" asChild className="border-accent/30 hover:bg-accent/5 bg-transparent">
                  <Link href="/auth?mode=signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-green-purple hover:opacity-90">
                  <Link href="/auth?mode=signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
