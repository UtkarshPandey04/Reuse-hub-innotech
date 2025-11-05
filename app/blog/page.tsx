"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Calendar, User } from "lucide-react"
import { useState, useEffect } from "react"
import { StoryModal } from "@/components/story-modal"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const STORIES = [
  {
    id: 1,
    title: "My Journey to Zero Waste",
    author: "Alex Chen",
    date: "2025-11-01",
    image: "/zero-waste-lifestyle-sustainable.jpg",
    excerpt: "Starting my zero-waste journey was challenging but rewarding. Here are my key learnings and tips...",
    content: `My journey to zero waste started about two years ago when I realized the amount of trash I was generating daily. It was eye-opening and honestly quite depressing at first.

The first step I took was understanding where my waste came from. I started tracking everything I threw away for a month. The results were shocking - over 200 items per week went into the trash! Plastics dominated, followed by food waste and paper products.

I began implementing small changes:
• Switched to reusable shopping bags and produce bags
• Bought bulk items and stored them in glass containers
• Started composting food waste in my apartment
• Reduced single-use plastics by 90%
• Learned to say "no" to unnecessary packaging

The transition wasn't easy. There were moments of frustration when I couldn't find package-free alternatives. But I discovered wonderful zero-waste communities online that provided tips and encouragement.

Six months into my journey, I had reduced my trash to just one bag per month! Now, after two years, I'm proud to say I produce less than 500 grams of trash annually.

The most valuable lesson I learned is that perfection isn't the goal. Every small action counts. Start with one area - maybe it's food waste or shopping - and build from there. The planet needs all of us trying, not a few of us being perfect.`,
    likes: 456,
    comments: 89,
    category: "Lifestyle",
  },
  {
    id: 2,
    title: "How I Save $500/Month with Secondhand Shopping",
    author: "Sarah Martinez",
    date: "2025-10-28",
    image: "/secondhand-shopping-sustainable-savings.jpg",
    excerpt: "Shopping secondhand not only saves money but also saves the planet. Let me share my top tips...",
    content: `When I started tracking my expenses, I was shocked to discover I was spending nearly $800 per month on new clothes. That's when I decided to give secondhand shopping a serious try, and it completely changed my life - both financially and environmentally.

The first few months were experimental. I explored thrift stores, online marketplaces, and vintage shops. I learned what works for my style and body type from secondhand options. Quality vintage pieces are often better made than modern fast fashion!

Here's how I save $500 monthly:
• 90% of my clothing from thrift stores at $5-15 per item
• Designer pieces at 70% off from secondhand apps
• Timeless vintage finds that never go out of style
• Rotating my wardrobe seasonally without buying new

What surprised me most was the quality. Vintage leather jackets, classic denim, and well-made basics from the 90s and 2000s are often superior to what you'll find in regular retail stores today. Plus, there's something special about wearing something with history.

I've also become more intentional about my purchases. When you're shopping secondhand, you naturally slow down and think about what you really need. This has made me a more conscious consumer overall.

The environmental impact is equally impressive. By extending the lifecycle of existing garments, I'm reducing textile waste and the massive water consumption needed for new clothing production.

My advice: Start with basics - jeans, t-shirts, sweaters. Learn your preferences, then explore more unique pieces. Secondhand shopping isn't settling for less; it's accessing better quality at better prices while helping the planet.`,
    likes: 389,
    comments: 76,
    category: "Shopping",
  },
  {
    id: 3,
    title: "Building a Circular Economy Community",
    author: "Jordan Lee",
    date: "2025-10-15",
    image: "/circular-economy-community-sustainable.jpg",
    excerpt: "Creating a sustainable community starts with small actions. Here's what we achieved together...",
    content: `Two years ago, I noticed most of my neighbors didn't know each other, and we were all separately throwing away items that others might need. That's when the idea for our community circular economy project was born.

What started as a simple neighborhood chat group has blossomed into something truly special. We created a local marketplace where residents could trade, buy, and sell secondhand items without any middlemen or fees.

Our community initiatives include:
• Weekly swap meets where neighbors exchange items
• A shared tool library reducing duplication
• Group composting initiatives with shared processing
• Skill-sharing workshops (repair, upcycling, crafting)
• Educational events about sustainable living

The impact has been remarkable. In just two years:
• We've diverted over 50 tons of items from landfills
• Generated $120,000 in local economic activity
• Built genuine connections among 200+ neighbor families
• Reduced individual household waste by an average of 40%

What I love most is how this has changed our community's culture. Neighbors now think of each other first before throwing things away. Kids have learned the value of resources and community cooperation.

The most important lesson: start small and let momentum build naturally. Our first swap meet had just 12 families. Now we regularly have over 50 families participating.

If you're thinking about starting something similar in your community, I encourage you to take that first step. The planet needs community-level solutions, and those solutions are most powerful when neighbors work together.`,
    likes: 312,
    comments: 54,
    category: "Community",
  },
  {
    id: 4,
    title: "Eco-Friendly Home Renovation on Budget",
    author: "Emma Wilson",
    date: "2025-10-08",
    image: "/eco-friendly-home-renovation-budget.jpg",
    excerpt: "Renovating sustainably doesn't mean breaking the bank. Here are my budget-friendly eco choices...",
    content: `When my partner and I decided to renovate our 1970s apartment, we were committed to doing it sustainably without breaking our modest budget. The challenge was finding that sweet spot between eco-conscious and economical.

Our renovation priorities:
• Using salvaged and reclaimed materials
• Choosing low-VOC paints and finishes
• Installing energy-efficient systems
• Maximizing natural light and ventilation
• Using sustainable, locally-sourced materials where possible

The Results & Savings:
• Reclaimed hardwood flooring: Saved 40% vs new ($3,000 saved)
• Salvaged vintage fixtures: Gave character and saved money ($1,500 saved)
• Low-VOC paint: Similar price to conventional ($200 extra)
• LED lighting: Higher upfront, saves 80% on electricity
• Recycled glass countertops: Cost-competitive at $2,500

Total budget: $18,000 (vs $28,000 for conventional renovation)

Here's the secret: sustainable and budget-friendly often go hand-in-hand. Companies selling salvaged materials are cheaper than retail. Energy-efficient upgrades pay for themselves through utility savings. And many sustainable options are timeless in design.

The biggest challenge was finding reliable sources for reclaimed materials. It took research and networking, but it was worth it. Now our apartment is unique, beautiful, and environmentally responsible.

My advice to others: Plan ahead, research alternatives, connect with the sustainability community, and don't be afraid to mix old with new. The most beautiful and sustainable homes are often those that honor the past while looking toward the future.`,
    likes: 278,
    comments: 42,
    category: "Home",
  },
]

export default function BlogPage() {
  const [selectedStory, setSelectedStory] = useState<(typeof STORIES)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userStories, setUserStories] = useState<(typeof STORIES)[0][]>([])
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    excerpt: "",
    content: "",
    category: "Lifestyle",
  })
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories')
        if (response.ok) {
          const data = await response.json()
          setStories(data)
        }
      } catch (error) {
        console.error('Error fetching stories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  const handleStoryClick = (story: (typeof STORIES)[0]) => {
    setSelectedStory(story)
    setIsModalOpen(true)
  }

  const handleSubmitStory = async () => {
    if (formData.title && formData.excerpt && formData.content) {
      try {
        const response = await fetch('/api/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
          },
          body: JSON.stringify({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            image: "/eco-friendly-story.jpg"
          })
        })

        if (response.ok) {
          const newStory = await response.json()
          setStories(prev => [newStory, ...(prev || [])])
          setFormData({ title: "", author: "", excerpt: "", content: "", category: "Lifestyle" })
          setShowSubmitForm(false)
          toast({
            title: "Story published!",
            description: "Your sustainability story has been shared with the community."
          })
        } else {
          const error = await response.json()
          toast({
            title: "Error",
            description: error.error || "Failed to publish story",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error submitting story:', error)
        toast({
          title: "Error",
          description: "Failed to publish story",
          variant: "destructive"
        })
      }
    }
  }

  const allStories = [...(stories.length > 0 ? stories : STORIES)]

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Sustainability Stories</h1>
            <p className="text-foreground/60 max-w-2xl">
              Inspiring stories from our community. Learn how others are making a positive impact on the planet.
            </p>
          </div>
          {/* Button to submit user stories */}
          <Button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:from-green-600 hover:to-emerald-600 whitespace-nowrap"
          >
            {showSubmitForm ? "Cancel" : "+ Share Your Story"}
          </Button>
        </div>

        {/* User story submission form */}
        {showSubmitForm && (
          <Card className="mb-8 p-6 border-green-500/30 bg-slate-900 space-y-4">
            <h3 className="text-lg font-semibold text-white">Share Your Sustainability Story</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Title</label>
                <Input
                  placeholder="Your story title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Your Name</label>
                <Input
                  placeholder="Your name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                >
                  <option>Lifestyle</option>
                  <option>Shopping</option>
                  <option>Community</option>
                  <option>Home</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Excerpt (Brief Summary)</label>
                <Input
                  placeholder="A short summary of your story"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Full Story</label>
                <textarea
                  placeholder="Tell us your full sustainability story..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleSubmitStory}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:from-green-600 hover:to-emerald-600 w-full"
              >
                Publish Story
              </Button>
            </div>
          </Card>
        )}

        {/* Featured Story */}
        {allStories.length > 0 && (
          <Card
            className="overflow-hidden border-primary/20 mb-12 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleStoryClick(allStories[0])}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="overflow-hidden h-96 md:h-full">
                <img
                  src={allStories[0].image || "/placeholder.svg"}
                  alt={allStories[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-foreground/60">
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-semibold">
                      {allStories[0].category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(allStories[0].date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">{allStories[0].title}</h2>
                  <p className="text-foreground/70 leading-relaxed">{allStories[0].excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <User className="w-4 h-4" />
                    <span>By {allStories[0].author}</span>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button className="bg-gradient-green-purple hover:opacity-90">Read Story</Button>
                    <Button variant="outline" className="border-primary/20 bg-transparent">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Other Stories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {allStories.slice(1).map((story) => (
            <Card
              key={String(story._id || story.id)}
              className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all-smooth group hover:shadow-xl cursor-pointer"
              onClick={() => handleStoryClick(story)}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-5">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-primary/10 rounded text-primary font-semibold">{story.category}</span>
                    <span className="text-foreground/60">{new Date(story.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold leading-tight line-clamp-2">{story.title}</h3>
                  <p className="text-sm text-foreground/60 line-clamp-2">{story.excerpt}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-foreground/60 mb-4">
                  <User className="w-4 h-4" />
                  <span>{story.author}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                  <div className="flex items-center gap-4 text-xs text-foreground/60">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      {story.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {story.comments}
                    </button>
                  </div>
                  <button className="hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <StoryModal story={selectedStory} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
