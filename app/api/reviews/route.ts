import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Review from '@/lib/models/Review'
import Product from '@/lib/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const reviews = await Review.find({ productId })
      .populate('userId', 'username displayName')
      .sort({ createdAt: -1 })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { productId, userId, rating, comment } = body

    if (!productId || !userId || !rating) {
      return NextResponse.json({ error: 'Product ID, User ID, and rating are required' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId })

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating
      existingReview.comment = comment
      await existingReview.save()
      await updateProductRating(productId)
      return NextResponse.json(existingReview)
    } else {
      // Create new review
      const review = new Review({
        productId,
        userId,
        rating,
        comment
      })

      await review.save()
      await updateProductRating(productId)

      const populatedReview = await Review.findById(review._id).populate('userId', 'username displayName')
      return NextResponse.json(populatedReview, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating/updating review:', error)
    return NextResponse.json({ error: 'Failed to create/update review' }, { status: 500 })
  }
}

async function updateProductRating(productId: string) {
  try {
    const reviews = await Review.find({ productId })
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewsCount: reviews.length
      })
    }
  } catch (error) {
    console.error('Error updating product rating:', error)
  }
}
