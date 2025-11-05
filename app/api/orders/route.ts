import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Order from '@/lib/models/Order'

export async function GET() {
  try {
    await connectToDatabase()
    const orders = await Order.find({})
      .populate('buyerId', 'username displayName')
      .populate('sellerId', 'username displayName')
      .populate('productId', 'title price')
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const order = new Order(body)
    await order.save()
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
