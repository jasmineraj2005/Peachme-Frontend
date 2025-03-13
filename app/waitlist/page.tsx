"use client"

import { BeehiveWaitlist } from "@/components/beehive-waitlist"

export default function WaitlistPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Waitlist</h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Be the first to know when we launch new features. Sign up for early access.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p>Early access to new features</p>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <polyline points="9 11 12 14 22 4" />
              </svg>
              <p>Exclusive content and tutorials</p>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <p>Priority support when we launch</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="mx-auto w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Join the Waitlist</h3>
              <p className="text-sm text-muted-foreground">Enter your details below to join our waitlist</p>
            </div>
            <BeehiveWaitlist className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

