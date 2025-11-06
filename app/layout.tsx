import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { FloatingChatbot } from "@/components/floating-chatbot"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReuseHub - Sustainable Living Community",
  description:
    "Join the sustainable revolution with ReuseHub - Track waste, buy/sell secondhand items, and earn eco-rewards!",
  generator: "v0.app",
  icons: {
    icon: "/placeholder-logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <FloatingChatbot />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
