"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

interface BeehiveWaitlistProps {
  className?: string
}

export function BeehiveWaitlist({ className }: BeehiveWaitlistProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Only initialize once
    if (initialized.current) return

    // Check if Beehive is loaded
    if (window.Beehive && containerRef.current) {
      window.Beehive.init({
        selector: containerRef.current,
        publicationId: process.env.NEXT_PUBLIC_BEEHIVE_PUB_ID,
        onSuccess: () => {
          console.log("Beehive waitlist form submitted successfully")
        },
        onError: (error: any) => {
          console.error("Beehive waitlist form error:", error)
        },
      })
      initialized.current = true
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdn.beehiiv.com/v1/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (containerRef.current && window.Beehive) {
            window.Beehive.init({
              selector: containerRef.current,
              publicationId: process.env.NEXT_PUBLIC_BEEHIVE_PUB_ID,
              onSuccess: () => {
                console.log("Beehive waitlist form submitted successfully")
              },
              onError: (error: any) => {
                console.error("Beehive waitlist form error:", error)
              },
            })
            initialized.current = true
          }
        }}
      />
      <div ref={containerRef} className={className} data-beehive-waitlist-form />
    </>
  )
}

// Add TypeScript declaration for Beehive
declare global {
  interface Window {
    Beehive: {
      init: (config: {
        selector: HTMLElement
        publicationId: string
        onSuccess?: () => void
        onError?: (error: any) => void
      }) => void
    }
  }
}

