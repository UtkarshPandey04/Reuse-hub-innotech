import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function POST(request: NextRequest) {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set')
      return NextResponse.json({ 
        error: 'Server configuration error', 
        details: 'Database connection not configured' 
      }, { status: 500 })
    }

    // Connect to database
    await connectToDatabase()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    // Log login activity (don't fail if this fails)
    try {
      await Activity.create({
        userId: user._id,
        type: 'login',
        description: 'User logged in',
        metadata: { email: user.email }
      })
    } catch (activityError) {
      console.error('Failed to log activity:', activityError)
      // Continue even if activity logging fails
    }

    if (!JWT_SECRET || JWT_SECRET === 'fallback-secret') {
      console.error('JWT_SECRET is not properly configured')
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Authentication secret not configured'
      }, { status: 500 })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })
    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName
      },
      token
    })
  } catch (error: any) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
