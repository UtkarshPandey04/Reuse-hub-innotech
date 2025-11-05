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
    const body = await request.json()

    // Check if it's a register or login request based on body structure
    const isRegister = body.displayName || body.username

    if (isRegister) {
      // Register
      const { email, password, displayName, username } = body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email,
        password: hashedPassword,
        username: username || email.split('@')[0],
        displayName: displayName || username || email.split('@')[0],
      })

      await user.save()
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
    } else {
      // Login
      const { email, password } = body

      const user = await User.findOne({ email })
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

      // Log login activity
      await Activity.create({
        userId: user._id,
        type: 'login',
        description: 'User logged in',
        metadata: { email: user.email }
      })

      return NextResponse.json({
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          displayName: user.displayName
        },
        token
      })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
