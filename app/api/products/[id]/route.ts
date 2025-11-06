import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Activity from '@/lib/models/Activity'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const product = await Product.findById(id).populate('sellerId', 'username displayName')
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    const errorMessage = error?.message || 'Failed to fetch product'
    const errorDetails = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const body = await request.json()
    const { title, description, category, price, imageUrl, quantity, status } = body

    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update fields
    if (title !== undefined) product.title = title
    if (description !== undefined) product.description = description
    if (category !== undefined) product.category = category
    if (price !== undefined) product.price = parseFloat(price)
    if (imageUrl !== undefined) product.imageUrl = imageUrl
    if (quantity !== undefined) product.quantity = parseInt(quantity)
    if (status !== undefined) product.status = status

    await product.save()
    const updatedProduct = await Product.findById(id).populate('sellerId', 'username displayName')

    // Log activity
    try {
      await Activity.create({
        userId: product.sellerId,
        type: 'product_update',
        description: 'Updated product in marketplace',
        metadata: { productId: id, title: product.title }
      })
    } catch (activityError) {
      // Don't fail the request if activity logging fails
      console.error('Error logging activity:', activityError)
    }

    return NextResponse.json(updatedProduct)
  } catch (error: any) {
    console.error('Error updating product:', error)
    const errorMessage = error?.message || 'Failed to update product'
    const errorDetails = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await Product.findByIdAndDelete(id)

    // Log activity
    try {
      await Activity.create({
        userId: product.sellerId,
        type: 'product_delete',
        description: 'Removed product from marketplace',
        metadata: { productId: id, title: product.title }
      })
    } catch (activityError) {
      // Don't fail the request if activity logging fails
      console.error('Error logging activity:', activityError)
    }

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    const errorMessage = error?.message || 'Failed to delete product'
    const errorDetails = process.env.NODE_ENV === 'development' ? error?.stack : undefined
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 })
  }
}
