import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase()
    const { userId } = await params
    const products = await Product.find({ sellerId: userId }).populate('sellerId', 'username displayName')
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Error fetching user products:', error)
    const errorMessage = error?.message || 'Failed to fetch user products'
    const errorDetails = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 })
  }
}
