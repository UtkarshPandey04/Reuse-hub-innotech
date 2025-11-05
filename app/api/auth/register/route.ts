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
    const { email, password, displayName, username } = await request.json()

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

    // Log registration activity
    await Activity.create({
      userId: user._id,
      type: 'registration',
      description: 'User registered',
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
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
