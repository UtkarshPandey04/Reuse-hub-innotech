"use client"

import { useEffect, useState } from "react"
import { Users, Globe, Leaf, TrendingUp } from "lucide-react"

export function WelcomeSplash() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8 animate-bounce">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-purple-500 rounded-full flex items-center justify-center">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 animate-slideDown">Welcome to ReuseHub</h1>

        <p className="text-gray-300 text-lg mb-12 animate-slideUp">
          Join our global community of eco-warriors making a difference
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20 animate-slideInLeft">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">50K+</p>
            <p className="text-gray-400 text-sm">Active Users</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20 animate-slideInUp">
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">125K+</p>
            <p className="text-gray-400 text-sm">Items Reused</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20 animate-slideInDown">
            <Leaf className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">2.5M</p>
            <p className="text-gray-400 text-sm">CO2 Saved (kg)</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg border border-orange-500/20 animate-slideInRight">
            <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white">892K</p>
            <p className="text-gray-400 text-sm">Liters Saved</p>
          </div>
        </div>

        <div className="text-gray-500 text-sm animate-pulse">Redirecting in 5 seconds...</div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.8s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out 0.2s backwards; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out 0.4s backwards; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out 0.6s backwards; }
        .animate-slideInUp { animation: slideInUp 0.6s ease-out 0.5s backwards; }
        .animate-slideInDown { animation: slideInDown 0.6s ease-out 0.3s backwards; }
      `}</style>
    </div>
  )
}
