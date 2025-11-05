import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import UserChallenge from '@/lib/models/UserChallenge'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userChallenges = await UserChallenge.find({ userId })
      .populate('challengeId')
      .sort({ startedAt: -1 })

    return NextResponse.json(userChallenges)
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch user challenges' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { challengeId, action } = body

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID required' }, { status: 400 })
    }

    if (action === 'join') {
      // Check if already joined
      const existing = await UserChallenge.findOne({ userId, challengeId })
      if (existing) {
        return NextResponse.json({ error: 'Already joined this challenge' }, { status: 400 })
      }

      const userChallenge = new UserChallenge({ userId, challengeId })
      await userChallenge.save()
      return NextResponse.json(userChallenge, { status: 201 })
    }

    if (action === 'complete') {
      const userChallenge = await UserChallenge.findOne({ userId, challengeId })
      if (!userChallenge) {
        return NextResponse.json({ error: 'Challenge not joined' }, { status: 400 })
      }

      userChallenge.completed = true
      userChallenge.completedAt = new Date()
      await userChallenge.save()
      return NextResponse.json(userChallenge)
    }

    if (action === 'update_progress') {
      const { progress } = body
      const userChallenge = await UserChallenge.findOne({ userId, challengeId })
      if (!userChallenge) {
        return NextResponse.json({ error: 'Challenge not joined' }, { status: 400 })
      }

      userChallenge.progress = progress
      await userChallenge.save()
      return NextResponse.json(userChallenge)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error managing user challenge:', error)
    return NextResponse.json({ error: 'Failed to manage user challenge' }, { status: 500 })
  }
}
