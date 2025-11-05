import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase()

    // Clear all products (for testing purposes only)
    await Product.deleteMany({})

    return NextResponse.json({ message: 'All products cleared successfully' })
  } catch (error) {
    console.error('Error clearing products:', error)
    return NextResponse.json({ error: 'Failed to clear products' }, { status: 500 })
  }
}
