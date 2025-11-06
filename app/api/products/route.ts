import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Activity from '@/lib/models/Activity'

export async function GET() {
  try {
    await connectToDatabase()
    const products = await Product.find({}).populate('sellerId', 'username displayName')
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Error fetching products:', error)
    const errorMessage = error?.message || 'Failed to fetch products'
    const errorDetails = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { sellerId, title, description, category, price, imageUrl, quantity, status } = body

    if (!sellerId || !title || !price) {
      return NextResponse.json({ error: 'Seller ID, title, and price are required' }, { status: 400 })
    }

    // Validate sellerId is a valid ObjectId
    if (!sellerId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ error: 'Invalid seller ID format' }, { status: 400 })
    }

    const product = new Product({
      sellerId,
      title,
      description,
      category,
      price: parseFloat(price),
      imageUrl,
      quantity: parseInt(quantity) || 1,
      status: status || 'available'
    })

    await product.save()
    const populatedProduct = await Product.findById(product._id).populate('sellerId', 'username displayName')

    // Log activity
    try {
      await Activity.create({
        userId: sellerId,
        type: 'product_add',
        description: 'Added new product to marketplace',
        metadata: { productId: product._id, title, category, price }
      })
    } catch (activityError) {
      // Don't fail the request if activity logging fails
      console.error('Error logging activity:', activityError)
    }

    return NextResponse.json(populatedProduct, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    // Provide more detailed error information
    const errorMessage = error?.message || 'Failed to create product'
    const errorDetails = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 })
  }
}
