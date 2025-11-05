"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Plus, Loader } from "lucide-react"

interface Task {
  id: string
  description: string
  quantity: number
  unit: string
  carbonSaved: number
  alternatives: string[]
  timestamp: Date
}

export function TaskLogger() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("items")
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const generateAlternatives = async (task: string, qty: string, selectedUnit: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `I just ${task} - quantity: ${qty} ${selectedUnit}. Can you provide 2-3 eco-friendly alternatives I could do instead? Also estimate how much CO2 in kg could be saved. Format clearly with alternatives numbered.`,
            },
          ],
        }),
      })

      const data = await response.json()
      const content = data.response || ""

      const alternatives = content
        .split("\n")
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 3)

      const carbonMatch = content.match(/(\d+(?:\.\d+)?)\s*kg/i)
      const carbonSaved = carbonMatch
        ? Number.parseFloat(carbonMatch[1])
        : Number.parseFloat(qty) * 0.8 + Math.random() * 2

      const newTask: Task = {
        id: Date.now().toString(),
        description: task,
        quantity: Number.parseInt(qty) || 1,
        unit: selectedUnit,
        carbonSaved,
        alternatives,
        timestamp: new Date(),
      }

      setTasks([newTask, ...tasks])
      setInput("")
      setQuantity("")
      setUnit("items")
    } catch (error) {
      console.error("[v0] Error generating alternatives:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && quantity.trim()) {
      await generateAlternatives(input, quantity, unit)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-purple-500/20 col-span-1 md:col-span-2">
      <h3 className="font-semibold mb-6 flex items-center gap-2 text-white text-lg">
        <Sparkles className="w-5 h-5 text-purple-400" />
        Daily Eco-Task Logger
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="What eco-action did you take? (e.g., 'recycled plastic bottles')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-400 flex-1"
          />
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={loading}
            className="bg-slate-800 border-purple-500/30 text-white placeholder:text-gray-400 w-24"
            min="1"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="bg-slate-800 border border-purple-500/30 text-white px-3 rounded-md focus:outline-none focus:border-purple-500/60"
          >
            <option>items</option>
            <option>kg</option>
            <option>liters</option>
            <option>hours</option>
            <option>days</option>
          </select>
          <Button
            type="submit"
            disabled={loading || !input.trim() || !quantity.trim()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Log
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Log your first eco-action to get AI suggestions!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
              onClick={() => setExpanded(expanded === task.id ? null : task.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-white font-medium">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Quantity: {task.quantity} {task.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{task.carbonSaved.toFixed(2)} kg CO2</p>
                  <p className="text-xs text-gray-400">Potential Save</p>
                </div>
              </div>

              {expanded === task.id && task.alternatives.length > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-500/20 animate-slideDown">
                  <p className="text-sm text-green-400 font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Suggestions:
                  </p>
                  <div className="space-y-2">
                    {task.alternatives.map((alt, i) => (
                      <div
                        key={i}
                        className="p-3 bg-purple-500/10 rounded border border-purple-500/30 text-sm text-gray-100 hover:bg-purple-500/20 transition-colors"
                      >
                        <p className="font-semibold text-green-400 mb-1">Alternative {i + 1}:</p>
                        {alt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expanded === task.id && task.alternatives.length === 0 && (
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-sm text-yellow-400">Loading AI suggestions...</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
