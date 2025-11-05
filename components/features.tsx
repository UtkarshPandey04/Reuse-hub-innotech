"use client"

import { Card } from "@/components/ui/card"
import { Leaf, ShoppingBag, Trophy, Heart, BarChart3, Users } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Track Your Impact",
    description:
      "Monitor your waste reduction, CO2 savings, and environmental impact in real-time with detailed analytics.",
  },
  {
    icon: ShoppingBag,
    title: "Secondhand Marketplace",
    description: "Buy and sell quality secondhand items with verified sellers and secure transactions.",
  },
  {
    icon: Trophy,
    title: "Eco-Challenges",
    description: "Complete sustainability challenges and earn badges to become a recognized eco-warrior.",
  },
  {
    icon: Heart,
    title: "Community Stories",
    description: "Share and read inspiring stories from the sustainability community worldwide.",
  },
  {
    icon: Leaf,
    title: "Green Rewards",
    description: "Earn points for every eco-action and redeem them for exclusive rewards and discounts.",
  },
  {
    icon: Users,
    title: "AI Chatbot Support",
    description: "24/7 AI-powered chatbot assistance for all your sustainability questions and tips.",
  },
]

export function Features() {
  return (
    <section className="py-20 sm:py-32 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-green-purple">Powerful Features</span>
            <br />
            <span className="text-foreground">For Sustainable Living</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Everything you need to reduce waste, save money, and make a positive environmental impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                className="p-6 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all-smooth group cursor-pointer h-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-green-purple opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-green-purple p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
