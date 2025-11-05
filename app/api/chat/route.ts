import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json()

    const apiKey = process.env.DEEPSEEK_API_KEY

    console.log("[v0] Starting chat request")
    console.log("[v0] API Key present:", !!apiKey)
    console.log("[v0] API Key length:", apiKey?.length)

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing DEEPSEEK_API_KEY. Please configure it in your Vercel environment variables." },
        { status: 500 },
      )
    }

    if (apiKey.includes("sk-")) {
      console.log("[v0] Valid OpenRouter API key format detected")
    } else {
      console.warn("[v0] Warning: API key may not be in correct OpenRouter format (should start with sk-)")
    }

    const requestBody = {
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are ReuseHub's AI Sustainability Assistant. Help users with sustainability tips, eco-friendly living advice, waste reduction, carbon footprint reduction, secondhand shopping benefits, and information about ReuseHub features. Be friendly, encouraging, and keep responses concise.",
        },
        ...(conversationHistory || []),
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }

    console.log("[v0] Making request to OpenRouter with model:", requestBody.model)

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "ReuseHub",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] Response status:", response.status)

    const responseText = await response.text()
    console.log("[v0] Response body:", responseText.substring(0, 200))

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText)
        console.error("[v0] OpenRouter error response:", errorData)
        return NextResponse.json(
          { error: `API Error (${response.status}): ${errorData?.error?.message || "Unknown error"}` },
          { status: response.status },
        )
      } catch {
        console.error("[v0] Failed to parse error response:", responseText)
        return NextResponse.json(
          { error: `API Error (${response.status}): ${response.statusText || "Unknown error"}` },
          { status: response.status },
        )
      }
    }

    const data = JSON.parse(responseText)
    console.log("[v0] Successfully received response from OpenRouter")

    const aiMessage = data.choices?.[0]?.message?.content || "I encountered an error processing your request."

    return NextResponse.json({ response: aiMessage })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Chat API error:", errorMessage)
    console.error("[v0] Error stack:", error)
    return NextResponse.json({ error: `Failed to process chat: ${errorMessage}` }, { status: 500 })
  }
}
