"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 I'm your ReuseHub AI Assistant. I'm here to help you with sustainability tips, answer questions about our platform, and guide you on your eco-friendly journey. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">AI Sustainability Assistant</h1>
          <p className="text-foreground/60">
            Get instant answers to your sustainability questions powered by DeepSeek AI
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 border-primary/20 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-gradient-green-purple text-white rounded-br-none"
                      : "bg-card border border-primary/20 text-foreground rounded-bl-none"
                  } transition-all-smooth`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <span
                    className={`text-xs mt-2 block ${message.sender === "user" ? "text-white/70" : "text-foreground/50"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-primary/20 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm text-foreground/70">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-primary/20 p-6">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                placeholder="Ask me anything about sustainability, ReuseHub, or eco-friendly living..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="bg-input border-primary/20 placeholder:text-foreground/50"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-green-purple hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Quick Questions */}
        <div className="mt-8">
          <p className="text-sm text-foreground/60 mb-4">Popular questions:</p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "How can I reduce my carbon footprint?",
              "What are the benefits of secondhand shopping?",
              "How do I earn green points?",
              "What eco-challenges are available?",
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-left p-3 border border-primary/20 rounded-lg hover:bg-primary/5 hover:border-primary/40 transition-all-smooth text-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
