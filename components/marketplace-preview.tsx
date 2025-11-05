"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    title: "Vintage Leather Backpack",
    price: 35,
    image: "/vintage-leather-backpack-sustainable-secondhand.jpg",
    rating: 4.8,
    seller: "EcoVintage",
    category: "Fashion",
  },
  {
    id: 2,
    title: "Bamboo Kitchen Set",
    price: 45,
    image: "/bamboo-kitchen-utensils-eco-friendly.jpg",
    rating: 4.9,
    seller: "GreenHome",
    category: "Home",
  },
  {
    id: 3,
    title: "Solar Phone Charger",
    price: 28,
    image: "/solar-phone-charger-renewable-energy.jpg",
    rating: 4.7,
    seller: "TechGreen",
    category: "Tech",
  },
  {
    id: 4,
    title: "Organic Cotton Bedding",
    price: 55,
    image: "/organic-cotton-bedding-sustainable.jpg",
    rating: 4.9,
    seller: "NatureRest",
    category: "Bedroom",
  },
]

export function MarketplacePreview() {
  return (
    <section className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">Featured</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-green-purple">Eco-Products</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all-smooth group hover:shadow-xl"
            >
              <div className="relative overflow-hidden h-48 bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
              <div className="p-4">
                <p className="text-xs text-primary font-semibold mb-2">{product.category}</p>
                <h3 className="font-semibold text-sm mb-3 line-clamp-2">{product.title}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-xs text-foreground/60">by {product.seller}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                  <Button size="sm" variant="outline" className="border-primary/30 h-8 w-8 p-0 bg-transparent">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-gradient-green-purple hover:opacity-90">
            <Link href="/marketplace">View Full Marketplace</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
