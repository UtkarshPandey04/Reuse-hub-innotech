require('dotenv').config()
const mongoose = require('mongoose')

// Import models using relative paths from root
const User = require('../lib/models/User.ts').default
const Product = require('../lib/models/Product.ts').default
const Challenge = require('../lib/models/Challenge.ts').default
const Badge = require('../lib/models/Badge.ts').default
const Story = require('../lib/models/Story.ts').default
const Cart = require('../lib/models/Cart.ts').default
const Activity = require('../lib/models/Activity.ts').default

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    await Challenge.deleteMany({})
    await Badge.deleteMany({})
    await Story.deleteMany({})
    await Cart.deleteMany({})
    await Activity.deleteMany({})

    // Seed users
    const users = await User.insertMany([
      {
        email: 'alex@example.com',
        password: '$2a$10$hashedpassword1', // bcrypt hash for 'password'
        username: 'alex_eco',
        displayName: 'Alex Chen',
        bio: 'Passionate about sustainable living',
        greenPoints: 5240,
        co2Saved: 380,
        wasteDiverted: 156,
        badgesEarned: 8,
      },
      {
        email: 'sarah@example.com',
        password: '$2a$10$hashedpassword2',
        username: 'sarah_green',
        displayName: 'Sarah Martinez',
        bio: 'Zero waste enthusiast',
        greenPoints: 4890,
        co2Saved: 320,
        wasteDiverted: 142,
        badgesEarned: 7,
      },
      {
        email: 'jordan@example.com',
        password: '$2a$10$hashedpassword3',
        username: 'jordan_reuse',
        displayName: 'Jordan Lee',
        bio: 'Supporting circular economy',
        greenPoints: 4650,
        co2Saved: 298,
        wasteDiverted: 128,
        badgesEarned: 6,
      },
      {
        email: 'emma@example.com',
        password: '$2a$10$hashedpassword4',
        username: 'emma_sustain',
        displayName: 'Emma Wilson',
        bio: 'Eco-friendly lifestyle blogger',
        greenPoints: 3920,
        co2Saved: 245,
        wasteDiverted: 98,
        badgesEarned: 5,
      },
      {
        email: 'mike@example.com',
        password: '$2a$10$hashedpassword5',
        username: 'mike_green',
        displayName: 'Mike Johnson',
        bio: 'Environmental advocate',
        greenPoints: 3450,
        co2Saved: 200,
        wasteDiverted: 87,
        badgesEarned: 4,
      },
    ])

    console.log('Users seeded')

    // Seed challenges
    const challenges = await Challenge.insertMany([
      {
        title: 'Zero Waste Week',
        description: 'Live a complete zero-waste lifestyle for 7 days',
        durationDays: 7,
        rewardPoints: 500,
        difficulty: 'Hard',
        category: 'Lifestyle',
      },
      {
        title: 'Plastic Free July',
        description: 'Avoid all single-use plastics for 30 days',
        durationDays: 30,
        rewardPoints: 1000,
        difficulty: 'Medium',
        category: 'Plastic',
      },
      {
        title: 'Secondhand September',
        description: 'Buy only secondhand items for a month',
        durationDays: 30,
        rewardPoints: 800,
        difficulty: 'Easy',
        category: 'Shopping',
      },
      {
        title: 'Water Conservation',
        description: 'Reduce water usage by 50% for 14 days',
        durationDays: 14,
        rewardPoints: 300,
        difficulty: 'Medium',
        category: 'Conservation',
      },
      {
        title: 'Plant Based Pledge',
        description: 'Go vegetarian for 7 days',
        durationDays: 7,
        rewardPoints: 400,
        difficulty: 'Medium',
        category: 'Diet',
      },
    ])

    console.log('Challenges seeded')

    // Seed badges
    const badges = await Badge.insertMany([
      {
        title: 'Eco Warrior',
        description: 'Complete 5 challenges',
      },
      {
        title: 'Zero Waste Hero',
        description: 'Divert 100kg of waste',
      },
      {
        title: 'Green Shopper',
        description: 'Make 10 secondhand purchases',
      },
      {
        title: 'Community Champion',
        description: 'Earn 1000 green points',
      },
      {
        title: 'Sustainability Leader',
        description: 'Share 5 eco-stories',
      },
      {
        title: 'Carbon Cutter',
        description: 'Save 50kg of CO2',
      },
      {
        title: 'Reuse Master',
        description: 'Sell 20 items on marketplace',
      },
      {
        title: 'Green Guardian',
        description: 'Earn all badges',
      },
    ])

    console.log('Badges seeded')

    // Seed products
    await Product.insertMany([
      {
        sellerId: users[0]._id,
        title: 'Vintage Leather Backpack',
        description: 'Gently used leather backpack',
        category: 'Fashion',
        price: 35.00,
        imageUrl: '/placeholder.svg?height=300&width=300',
        rating: 4.8,
        reviewsCount: 142,
      },
      {
        sellerId: users[1]._id,
        title: 'Bamboo Kitchen Set',
        description: 'Complete bamboo utensil set',
        category: 'Home',
        price: 45.00,
        imageUrl: '/placeholder.svg?height=300&width=300',
        rating: 4.9,
        reviewsCount: 89,
      },
      {
        sellerId: users[2]._id,
        title: 'Solar Phone Charger',
        description: 'Portable solar charger',
        category: 'Tech',
        price: 28.00,
        imageUrl: '/placeholder.svg?height=300&width=300',
        rating: 4.7,
        reviewsCount: 156,
      },
      {
        sellerId: users[3]._id,
        title: 'Organic Cotton Bedding',
        description: 'Sustainable cotton sheets',
        category: 'Bedroom',
        price: 55.00,
        imageUrl: '/placeholder.svg?height=300&width=300',
        rating: 4.9,
        reviewsCount: 67,
      },
      {
        sellerId: users[4]._id,
        title: 'Eco Water Bottle',
        description: 'Reusable bamboo water bottle',
        category: 'Lifestyle',
        price: 32.00,
        imageUrl: '/placeholder.svg?height=300&width=300',
        rating: 4.6,
        reviewsCount: 203,
      },
    ])

    console.log('Products seeded')

    // Seed stories
    await Story.insertMany([
      {
        authorId: users[0]._id,
        title: 'My Journey to Zero Waste',
        content: 'Starting my zero-waste journey was challenging but rewarding. Here are my key learnings...',
        imageUrl: '/placeholder.svg?height=400&width=600',
        likes: 456,
        views: 2340,
      },
      {
        authorId: users[1]._id,
        title: 'How I Save $500/Month with Secondhand Shopping',
        content: 'Shopping secondhand not only saves money but also saves the planet. Let me share my tips...',
        imageUrl: '/placeholder.svg?height=400&width=600',
        likes: 389,
        views: 1890,
      },
      {
        authorId: users[2]._id,
        title: 'Building a Circular Economy Community',
        content: 'Creating a sustainable community starts with small actions. Here\'s what we achieved...',
        imageUrl: '/placeholder.svg?height=400&width=600',
        likes: 312,
        views: 1567,
      },
    ])

    console.log('Stories seeded')
    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
  }
}

seedDatabase()
