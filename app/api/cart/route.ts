import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Cart from '@/lib/models/Cart'
import Activity from '@/lib/models/Activity'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const cartItems = await Cart.find({ userId })
      .populate('productId')
      .sort({ addedAt: -1 })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { userId, productId, quantity = 1 } = body

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 })
    }

    // Check if item already exists in cart
    const existingItem = await Cart.findOne({ userId, productId })

    if (existingItem) {
      existingItem.quantity += quantity
      await existingItem.save()
      return NextResponse.json(existingItem)
    } else {
      const cartItem = new Cart({ userId, productId, quantity })
      await cartItem.save()

      // Log activity
      await Activity.create({
        userId,
        type: 'cart_add',
        description: 'Added item to cart',
        metadata: { productId, quantity }
      })

      return NextResponse.json(cartItem, { status: 201 })
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')

    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID required' }, { status: 400 })
    }

    await Cart.findOneAndDelete({ userId, productId })

    // Log activity
    await Activity.create({
      userId,
      type: 'cart_remove',
      description: 'Removed item from cart',
      metadata: { productId }
    })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}
