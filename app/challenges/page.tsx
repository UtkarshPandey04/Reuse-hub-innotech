"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Check, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DailyLog {
  challengeId: string
  date: string
  activity: string
  duration: number
}

const CHALLENGES = [
  {
    id: 1,
    title: "Zero Waste Week",
    description: "Live a complete zero-waste lifestyle for 7 days",
    difficulty: "Hard",
    duration: 7,
    reward: 500,
    participants: 2340,
    color: "from-red-500 to-pink-500",
    icon: "🚫",
  },
  {
    id: 2,
    title: "Plastic Free July",
    description: "Avoid all single-use plastics for 30 days",
    difficulty: "Medium",
    duration: 30,
    reward: 1000,
    participants: 5600,
    color: "from-blue-500 to-cyan-500",
    icon: "♻️",
  },
  {
    id: 3,
    title: "Secondhand September",
    description: "Buy only secondhand items for a month",
    difficulty: "Easy",
    duration: 30,
    reward: 800,
    participants: 3200,
    color: "from-green-500 to-emerald-500",
    icon: "🔄",
  },
  {
    id: 4,
    title: "Water Conservation",
    description: "Reduce water usage by 50% for 14 days",
    difficulty: "Medium",
    duration: 14,
    reward: 300,
    participants: 1800,
    color: "from-cyan-500 to-blue-500",
    icon: "💧",
  },
  {
    id: 5,
    title: "Plant Based Pledge",
    description: "Go vegetarian for 7 days",
    difficulty: "Medium",
    duration: 7,
    reward: 400,
    participants: 2100,
    color: "from-orange-500 to-yellow-500",
    icon: "🌱",
  },
  {
    id: 6,
    title: "Circular Shopping",
    description: "Make 5 secondhand purchases in 14 days",
    difficulty: "Easy",
    duration: 14,
    reward: 350,
    participants: 1500,
    color: "from-green-500 to-teal-500",
    icon: "🛍️",
  },
]

export default function ChallengesPage() {
  const [joinedChallenges, setJoinedChallenges] = useState<any[]>([])
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [showLogForm, setShowLogForm] = useState<string | null>(null)
  const [logActivity, setLogActivity] = useState("")
  const [logDuration, setLogDuration] = useState(1)
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/challenges')
        if (response.ok) {
          const data = await response.json()
          setChallenges(data)
        }
      } catch (error) {
        console.error('Error fetching challenges:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
          }
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          return userData._id
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
      return null
    }

    const fetchUserChallenges = async (userId: string) => {
      try {
        const response = await fetch('/api/user-challenges', {
          headers: {
            'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          const joined = data.filter((uc: any) => !uc.completed)
          const completed = data.filter((uc: any) => uc.completed)
          setJoinedChallenges(joined)
          setCompletedChallenges(completed)
        }
      } catch (error) {
        console.error('Error fetching user challenges:', error)
      }
    }

    const initializeData = async () => {
      await fetchChallenges()
      const userId = await fetchUserProfile()
      if (userId) {
        await fetchUserChallenges(userId)
      }
    }

    initializeData()
  }, [])

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to join challenges",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/user-challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify({
          challengeId,
          action: 'join'
        })
      })

      if (response.ok) {
        const userChallenge = await response.json()
        setJoinedChallenges(prev => [...prev, userChallenge])
        toast({
          title: "Joined challenge",
          description: "You've successfully joined this challenge!"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to join challenge",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast({
        title: "Error",
        description: "Failed to join challenge",
        variant: "destructive"
      })
    }
  }

  const handleCompleteChallenge = async (challengeId: string) => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to complete challenges",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/user-challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify({
          challengeId,
          action: 'complete'
        })
      })

      if (response.ok) {
        const userChallenge = await response.json()
        setJoinedChallenges(prev => prev.filter(jc => jc.challengeId._id !== challengeId))
        setCompletedChallenges(prev => [...prev, userChallenge])
        toast({
          title: "Challenge completed!",
          description: "Congratulations on completing this challenge!"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to complete challenge",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error completing challenge:', error)
      toast({
        title: "Error",
        description: "Failed to complete challenge",
        variant: "destructive"
      })
    }
  }

  const handleAddLog = (challengeId: string) => {
    if (logActivity.trim()) {
      const newLog: DailyLog = {
        challengeId,
        date: new Date().toLocaleDateString(),
        activity: logActivity,
        duration: logDuration,
      }
      setDailyLogs([...dailyLogs, newLog])
      setLogActivity("")
      setLogDuration(1)
      setShowLogForm(null)
    }
  }

  const getChallengeLogs = (challengeId: string) => {
    return dailyLogs.filter((log) => log.challengeId === challengeId)
  }

  const filteredChallenges = (challenges.length > 0 ? challenges : CHALLENGES).filter((challenge) => {
    const challengeId = String(challenge._id || challenge.id)
    if (filter === "active") return joinedChallenges.some(jc => jc.challengeId._id === challengeId || jc.challengeId === challengeId)
    if (filter === "completed") return completedChallenges.some(cc => cc.challengeId._id === challengeId || cc.challengeId === challengeId)
    return true
  })

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">Eco-Challenges</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Complete challenges, earn green points, and join thousands of eco-warriors building a sustainable future!
          </p>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <Button
            onClick={() => setFilter("all")}
            className={`${
              filter === "all"
                ? "bg-green-500 text-black hover:bg-green-600"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            All Challenges
          </Button>
          <Button
            onClick={() => setFilter("active")}
            className={`${
              filter === "active"
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            My Active ({joinedChallenges.filter(jc => !jc.completed).length})
          </Button>
          <Button
            onClick={() => setFilter("completed")}
            className={`${
              filter === "completed"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            Completed ({completedChallenges.length})
          </Button>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const challengeId = String(challenge._id || challenge.id)
            const isJoined = joinedChallenges.some(jc => jc.challengeId._id === challengeId || jc.challengeId === challengeId)
            const isCompleted = completedChallenges.some(cc => cc.challengeId._id === challengeId || cc.challengeId === challengeId)
            const challengeLogs = getChallengeLogs(challengeId)

            return (
              <Card
                key={challengeId}
                className={`overflow-hidden border transition-all-smooth group hover:shadow-xl cursor-pointer ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-500/50"
                    : isJoined
                      ? "bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-purple-500/50"
                      : "bg-gradient-to-br from-slate-900/30 to-slate-900/10 border-slate-700/50 hover:border-green-500/30"
                }`}
              >
                <div
                  className={`h-24 bg-gradient-to-r ${challenge.color} opacity-80 group-hover:opacity-100 transition-opacity relative overflow-hidden flex items-center justify-center`}
                >
                  <div className="shine absolute inset-0"></div>
                  <span className="text-5xl relative z-10">{challenge.icon}</span>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <h3 className="font-semibold text-lg leading-tight text-white">{challenge.title}</h3>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Difficulty</p>
                      <p className="font-semibold text-sm text-white">{challenge.difficulty}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="font-semibold text-sm text-white">{challenge.duration}d</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Reward</p>
                      <p className="font-semibold text-sm text-green-400">{challenge.reward} pts</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants.toLocaleString()} participants</span>
                  </div>

                  {isJoined && (
                    <div className="mb-4 space-y-3 border-t border-slate-700/50 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-300">Daily Logs ({challengeLogs.length})</p>
                        <button
                          onClick={() => setShowLogForm(showLogForm === challengeId ? null : challengeId)}
                          className="text-xs text-green-400 hover:text-green-300"
                        >
                          {showLogForm === challengeId ? "Cancel" : "+ Log"}
                        </button>
                      </div>

                      {showLogForm === challengeId && (
                        <div className="space-y-2 p-3 bg-slate-800/50 rounded border border-slate-700/50">
                          <input
                            type="text"
                            placeholder="What did you do today?"
                            value={logActivity}
                            onChange={(e) => setLogActivity(e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-slate-700 border border-slate-600 rounded text-white placeholder:text-gray-500"
                          />
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              max="24"
                              value={logDuration}
                              onChange={(e) => setLogDuration(Number.parseInt(e.target.value))}
                              className="w-16 px-2 py-1 text-xs bg-slate-700 border border-slate-600 rounded text-white"
                            />
                            <span className="text-xs text-gray-400">hours</span>
                            <button
                              onClick={() => handleAddLog(challengeId)}
                              className="ml-auto px-2 py-1 text-xs bg-green-500 text-black rounded hover:bg-green-600"
                            >
                              Save Log
                            </button>
                          </div>
                        </div>
                      )}

                      {challengeLogs.length > 0 && (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {challengeLogs.map((log, idx) => (
                            <div key={idx} className="text-xs bg-slate-800/50 p-2 rounded border border-slate-700/50">
                              <p className="text-gray-300">{log.activity}</p>
                              <p className="text-gray-500 text-xs">
                                {log.date} • {log.duration}h
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {isCompleted ? (
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Completed!
                    </Button>
                  ) : isJoined ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleCompleteChallenge(challengeId)}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        In Progress
                      </Button>
                      <Button
                        onClick={() => handleCompleteChallenge(challengeId)}
                        variant="outline"
                        className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        Mark as Complete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleJoinChallenge(challengeId)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:from-green-600 hover:to-emerald-600 font-semibold"
                    >
                      Join Challenge
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {filter === "completed" ? "No completed challenges yet. Keep going!" : "No challenges found."}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
