"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export default function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              🍑
            </span>
            <span className="text-2xl font-bold text-primary-foreground">peachme</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/try-now"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/try-now" ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              Try Now
            </Link>
            <Link
              href="/waitlist"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/waitlist" ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              Waitlist
            </Link>
            <Link
              href="/upload"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/waitlist" ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              Video Upload
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">Hello, {user.name}</span>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

