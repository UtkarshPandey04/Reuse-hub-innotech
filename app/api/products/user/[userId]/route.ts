import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase()
    const products = await Product.find({ sellerId: params.userId }).populate('sellerId', 'username displayName')
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching user products:', error)
    return NextResponse.json({ error: 'Failed to fetch user products' }, { status: 500 })
  }
}
