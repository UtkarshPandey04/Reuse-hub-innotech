import type React from "react"
import { Header } from "@/components/header"

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      {children}
    </div>
  )
}
