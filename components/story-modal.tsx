"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Calendar, User } from "lucide-react"
import { useState } from "react"

interface Story {
  id: number
  title: string
  author: string
  date: string
  image: string
  excerpt: string
  content: string
  likes: number
  comments: number
  category: string
}

interface StoryModalProps {
  story: Story | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StoryModal({ story, open, onOpenChange }: StoryModalProps) {
  const [hasLiked, setHasLiked] = useState(false)

  if (!story) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-primary/20">
        <DialogHeader className="pb-4 border-b border-primary/20">
          <DialogTitle className="text-2xl font-bold">{story.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-lg h-96">
            <img src={story.image || "/placeholder.svg"} alt={story.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-primary/20">
            <div className="flex items-center gap-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(story.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {story.author}
              </div>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-semibold">{story.category}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{story.content}</p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-primary/20">
            <Button
              variant="outline"
              className={`border-primary/20 gap-2 ${hasLiked ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setHasLiked(!hasLiked)}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? "fill-primary" : ""}`} />
              {hasLiked ? story.likes + 1 : story.likes}
            </Button>
            <Button variant="outline" className="border-primary/20 gap-2 bg-transparent">
              <MessageCircle className="w-4 h-4" />
              {story.comments}
            </Button>
            <Button variant="outline" className="border-primary/20 gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
