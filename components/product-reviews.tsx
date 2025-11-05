"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Review {
  _id: string
  rating: number
  comment?: string
  userId: {
    _id: string
    username: string
    displayName: string
  }
  createdAt: string
}

interface ProductReviewsProps {
  productId: string
  user: any
}

export function ProductReviews({ productId, user }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to leave a review",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user._id,
          rating: newRating,
          comment: newComment.trim() || undefined
        })
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews(prev => [newReview, ...prev.filter(r => r.userId._id !== user._id)])
        setNewComment("")
        setNewRating(5)
        setShowReviewDialog(false)
        toast({
          title: "Review submitted",
          description: "Thank you for your review!"
        })
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(star)}
            className={`w-5 h-5 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            title={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const hasUserReviewed = reviews.some(review => review.userId._id === user?._id)

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
        {user && (
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                {hasUserReviewed ? 'Update Review' : 'Write Review'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{hasUserReviewed ? 'Update Your Review' : 'Write a Review'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  {renderStars(newRating, true, setNewRating)}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Comment (optional)</label>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitReview} disabled={submitting}>
                    {submitting ? 'Submitting...' : hasUserReviewed ? 'Update Review' : 'Submit Review'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-foreground/60">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-sm font-medium">
                    {review.userId.displayName || review.userId.username}
                  </span>
                </div>
                <span className="text-xs text-foreground/60">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-foreground/80">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
