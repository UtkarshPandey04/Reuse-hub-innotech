"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Leaf, Trophy, TrendingUp, Zap, Users, Droplets, Activity, User } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState, useEffect } from "react"
import { WelcomeSplash } from "@/components/welcome-splash"
import { TaskLogger } from "@/components/task-logger"

const wasteData = [
  { month: "Jan", waste: 2.4, water: 45, energy: 120, carbon: 12 },
  { month: "Feb", waste: 3.2, water: 42, energy: 115, carbon: 14 },
  { month: "Mar", waste: 2.8, water: 48, energy: 125, carbon: 11 },
  { month: "Apr", waste: 4.1, water: 40, energy: 110, carbon: 16 },
  { month: "May", waste: 3.9, water: 38, energy: 105, carbon: 15 },
  { month: "Jun", waste: 4.8, water: 35, energy: 95, carbon: 18 },
]

const waterSavingsData = [
  { month: "Jan", liters: 450 },
  { month: "Feb", liters: 520 },
  { month: "Mar", liters: 480 },
  { month: "Apr", liters: 610 },
  { month: "May", liters: 580 },
  { month: "Jun", liters: 720 },
]

const energySavingsData = [
  { month: "Jan", kwh: 120 },
  { month: "Feb", kwh: 135 },
  { month: "Mar", kwh: 128 },
  { month: "Apr", kwh: 145 },
  { month: "May", kwh: 152 },
  { month: "Jun", kwh: 168 },
]

const carbonReductionData = [
  { month: "Jan", kg: 45 },
  { month: "Feb", kg: 52 },
  { month: "Mar", kg: 48 },
  { month: "Apr", kg: 61 },
  { month: "May", kg: 58 },
  { month: "Jun", kg: 72 },
]

const pointsData = [
  { name: "Shopping", value: 35, fill: "#00b894" },
  { name: "Challenges", value: 25, fill: "#a55eea" },
  { name: "Sharing", value: 20, fill: "#00dda3" },
  { name: "Reviews", value: 20, fill: "#ffa502" },
]

export default function Dashboard() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [challenges, setChallenges] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has seen splash (store in cookie instead of localStorage)
    const hasSeenSplash = document.cookie
      .split('; ')
      .find(row => row.startsWith('hasSeenWelcomeSplash='))
    if (hasSeenSplash) {
      setShowSplash(false)
    } else {
      document.cookie = 'hasSeenWelcomeSplash=true; path=/; max-age=31536000' // 1 year
    }

    // Fetch user data, challenges, and activities with JWT authentication
    const fetchData = async () => {
      try {
        // Get auth token from cookie
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1]

        if (!token) {
          // Redirect to login if no token
          router.push('/auth?mode=signin')
          return
        }

        const headers: HeadersInit = {
          Authorization: `Bearer ${token}`
        }

        const [userRes, challengesRes, activitiesRes] = await Promise.all([
          fetch('/api/users/profile', { headers }),
          fetch('/api/challenges', { headers }),
          fetch('/api/activities', { headers })
        ])

        if (userRes.ok) {
          const userData = await userRes.json()
          setUserData(userData)
        } else {
          // If profile fetch fails, redirect to login
          document.cookie = 'auth-token=; path=/; max-age=0'
          router.push('/auth?mode=signin')
          return
        }

        if (challengesRes.ok) {
          const challengesData = await challengesRes.json()
          setChallenges(challengesData.slice(0, 3)) // Show first 3 challenges
        }

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json()
          setActivities(activitiesData.slice(0, 10)) // Show latest 10 activities
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Redirect to login on error
        router.push('/auth?mode=signin')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {showSplash && <WelcomeSplash />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={userData?.avatarUrl} alt={userData?.displayName} />
              <AvatarFallback className="text-lg bg-green-500/20 text-green-400">
                {userData?.displayName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'EW'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-white">
                Welcome back, {userData?.displayName || 'Eco-Warrior'}!
              </h1>
              <p className="text-gray-400 text-lg">Here's your sustainability progress and achievements</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/profile')}
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-900/20 to-green-900/5 border-green-500/30 hover:border-green-500/60 transition-all-smooth group cursor-pointer hover:shadow-lg hover:shadow-green-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Leaf className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs font-semibold text-green-400">+8.2 kg</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Waste Diverted</h3>
            <p className="text-2xl font-bold text-white">{userData?.wasteDiverted || 48.3} kg</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-900/5 border-purple-500/30 hover:border-purple-500/60 transition-all-smooth group cursor-pointer hover:shadow-lg hover:shadow-purple-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs font-semibold text-purple-400">+128 pts</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Green Points</h3>
            <p className="text-2xl font-bold text-white">{userData?.greenPoints?.toLocaleString() || '2,480'}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-blue-900/5 border-blue-500/30 hover:border-blue-500/60 transition-all-smooth group cursor-pointer hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Droplets className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-400">+156 L</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Water Saved</h3>
            <p className="text-2xl font-bold text-white">3,420 L</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-900/20 to-orange-900/5 border-orange-500/30 hover:border-orange-500/60 transition-all-smooth group cursor-pointer hover:shadow-lg hover:shadow-orange-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-xs font-semibold text-orange-400">↑ 12%</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">CO2 Saved</h3>
            <p className="text-2xl font-bold text-white">{userData?.co2Saved || 156} kg</p>
          </Card>
        </div>

        {/* Task Logger */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <TaskLogger />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-green-500/20 col-span-2 group hover:border-green-500/40 transition-all">
            <h3 className="font-semibold mb-6 text-white text-lg">Waste Diversion Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={wasteData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b894" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00b894" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #00b894",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#00b894", fontWeight: "bold" }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="waste"
                  stroke="#00b894"
                  strokeWidth={3}
                  dot={{ fill: "#00b894", r: 5 }}
                  activeDot={{ r: 8, fill: "#00dda3" }}
                  fillOpacity={1}
                  fill="url(#colorWaste)"
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-purple-500/20 group hover:border-purple-500/40 transition-all">
            <h3 className="font-semibold mb-6 text-white text-lg">Points Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pointsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationDuration={800}
                >
                  {pointsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-blue-500/20 group hover:border-blue-500/40 transition-all">
            <h3 className="font-semibold mb-6 text-white text-lg">Water Saved (Liters)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={waterSavingsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0984e3" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0984e3" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #0984e3",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#0984e3", fontWeight: "bold" }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Bar dataKey="liters" fill="url(#colorWater)" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-orange-500/20 group hover:border-orange-500/40 transition-all">
            <h3 className="font-semibold mb-6 text-white text-lg">Energy Saved (kWh)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={energySavingsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fdcb6e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#fdcb6e" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #fdcb6e",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fdcb6e", fontWeight: "bold" }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Bar dataKey="kwh" fill="url(#colorEnergy)" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-green-500/20 group hover:border-green-500/40 transition-all">
            <h3 className="font-semibold mb-6 text-white text-lg">Carbon Reduced (kg)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={carbonReductionData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00b894" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#00b894" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "2px solid #00b894",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#00b894", fontWeight: "bold" }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Bar dataKey="kg" fill="url(#colorCarbon)" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Challenges, Achievements & Activities */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-green-500/20">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-white text-lg">
              <Trophy className="w-5 h-5 text-green-400" />
              Active Challenges
            </h3>
            <div className="space-y-4">
              {challenges.length > 0 ? challenges.map((challenge, i) => (
                <div
                  key={challenge._id}
                  className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-green-500/30 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white group-hover:text-green-400 transition-colors">
                      {challenge.title}
                    </p>
                    <span className="text-sm font-semibold text-green-400">0%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500`}
                      style={{ width: `0%` }}
                    />
                  </div>
                </div>
              )) : (
                [
                  { name: "Zero Waste Week", progress: 75, color: "from-green-500 to-emerald-500" },
                  { name: "Plastic Free July", progress: 45, color: "from-blue-500 to-cyan-500" },
                  { name: "Water Conservation", progress: 85, color: "from-cyan-500 to-blue-500" },
                ].map((challenge, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-green-500/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-white group-hover:text-green-400 transition-colors">
                        {challenge.name}
                      </p>
                      <span className="text-sm font-semibold text-green-400">{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${challenge.color} transition-all duration-500`}
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-purple-500/20">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-white text-lg">
              <Users className="w-5 h-5 text-purple-400" />
              Leaderboard
            </h3>
            <div className="space-y-3">
              {[
                { name: "Alex Chen", points: 5240, you: true },
                { name: "Sarah Martinez", points: 4890 },
                { name: "Jordan Lee", points: 4650 },
                { name: "You", points: 2480, highlight: true },
              ].map((user, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    user.you
                      ? "bg-green-500/10 border-green-500/50"
                      : "bg-slate-800/30 border-slate-700/50 hover:border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-6 ${user.you ? "text-green-400" : "text-gray-400"}`}>{i + 1}</span>
                    <span className={`${user.you ? "font-semibold text-white" : "text-gray-300"}`}>{user.name}</span>
                  </div>
                  <span className={`font-semibold ${user.you ? "text-green-400" : "text-gray-300"}`}>
                    {user.points}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-900/20 border-blue-500/20">
            <h3 className="font-semibold mb-6 flex items-center gap-2 text-white text-lg">
              <Activity className="w-5 h-5 text-blue-400" />
              Recent Activities
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activities.length > 0 ? activities.map((activity, i) => (
                <div
                  key={activity._id}
                  className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      {activity.userId?.displayName || activity.userId?.username || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{activity.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    activity.type === 'login' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'cart_add' ? 'bg-blue-500/20 text-blue-400' :
                    activity.type === 'purchase' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {activity.type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No recent activities</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
