import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Activity from '@/lib/models/Activity'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const product = await Product.findById(params.id).populate('sellerId', 'username displayName')
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { title, description, category, price, imageUrl, quantity, status } = body

    const product = await Product.findById(params.id)
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
    const updatedProduct = await Product.findById(params.id).populate('sellerId', 'username displayName')

    // Log activity
    await Activity.create({
      userId: product.sellerId,
      type: 'product_update',
      description: 'Updated product in marketplace',
      metadata: { productId: params.id, title: product.title }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    await Product.findByIdAndDelete(params.id)

    // Log activity
    await Activity.create({
      userId: product.sellerId,
      type: 'product_delete',
      description: 'Removed product from marketplace',
      metadata: { productId: params.id, title: product.title }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
