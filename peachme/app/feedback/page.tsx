"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function FeedbackPage() {
  const [rating, setRating] = useState<string>("")
  const [improvement, setImprovement] = useState<string>("")
  const [generalFeedback, setGeneralFeedback] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="container py-12 md:py-24 lg:py-32">
        <Card className="max-w-2xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-primary/20 p-3">
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
                className="h-6 w-6 text-primary"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Thank you for your feedback!</h3>
            <p className="text-muted-foreground">Your feedback helps us improve our service for everyone.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Your Feedback Matters</h1>
          <p className="text-xl text-muted-foreground">Help us improve PeachMe by sharing your experience</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Rating */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">How would you rate our service?</Label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value.toString())}
                    className={`p-2 rounded-full transition-colors ${
                      rating === value.toString() ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Star className={`h-8 w-8 ${rating === value.toString() ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">What could we improve?</Label>
              <RadioGroup value={improvement} onValueChange={setImprovement} className="flex flex-col space-y-2">
                {["Video upload experience", "Editing tools", "User interface", "Customer support", "Other"].map(
                  (option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ),
                )}
              </RadioGroup>
            </div>

            {/* General Feedback */}
            <div className="space-y-4">
              <Label className="text-lg font-medium" htmlFor="feedback">
                Any additional feedback?
              </Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts with us..."
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                className="min-h-[150px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FFB6A3] via-[#FFA088] to-[#FF8A6D]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

