import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/lib/models/User'
import Activity from '@/lib/models/Activity'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const { email, password } = await request.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    // Log login activity
    await Activity.create({
      userId: user._id,
      type: 'login',
      description: 'User logged in',
      metadata: { email: user.email }
    })

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
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
