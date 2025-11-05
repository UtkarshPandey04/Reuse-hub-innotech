import Link from "next/link"
import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg">ReuseHub</span>
            </div>
            <p className="text-sm text-foreground/60">Making sustainability accessible and rewarding for everyone.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-foreground/60 hover:text-primary transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/challenges" className="text-foreground/60 hover:text-primary transition-colors">
                  Challenges
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-foreground/60 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-foreground/60 hover:text-primary transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/60">© 2025 ReuseHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
              Instagram
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
