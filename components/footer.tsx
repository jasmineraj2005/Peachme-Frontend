import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">
                🍑
              </span>
              <span className="text-xl font-bold text-primary-foreground">peachme</span>
            </div>
            <div className="text-muted-foreground">
              <p>Melbourne, Victoria 3000</p>
              <p>Australia</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/try-now" className="text-muted-foreground hover:text-primary transition-colors">
                Try Now
              </Link>
              <Link href="/waitlist" className="text-muted-foreground hover:text-primary transition-colors">
                Join Waitlist
              </Link>
              <Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                Sign Up
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFE5E5] to-[#FFD5D5] flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFE5E5] to-[#FFD5D5] flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFE5E5] to-[#FFD5D5] flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFE5E5] to-[#FFD5D5] flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PeachMe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

