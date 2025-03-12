"use client"
import { motion } from "framer-motion"

interface Testimonial {
  id: number
  name: string
  country: string
  flag: string
  achievement: string
  background: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah",
    country: "USA",
    flag: "🇺🇸",
    achievement: "Raised $2M seed round after perfecting pitch with PeachMe",
    background: "bg-[#fff4e3]",
  },
  {
    id: 2,
    name: "Marcus",
    country: "Germany",
    flag: "🇩🇪",
    achievement: "Got into Y Combinator with our AI startup",
    background: "bg-[#ffe5e5]",
  },
  {
    id: 3,
    name: "Priya",
    country: "India",
    flag: "🇮🇳",
    achievement: "Secured partnership with Sequoia Capital",
    background: "bg-[#e5f6ff]",
  },
  {
    id: 4,
    name: "Alex",
    country: "UK",
    flag: "🇬🇧",
    achievement: "Successfully pitched to Andreessen Horowitz",
    background: "bg-[#fff4e3]",
  },
  {
    id: 5,
    name: "Chen",
    country: "Singapore",
    flag: "🇸🇬",
    achievement: "Closed $5M Series A after pitch training",
    background: "bg-[#ffe5e5]",
  },
  {
    id: 6,
    name: "Maria",
    country: "Spain",
    flag: "🇪🇸",
    achievement: "Featured in TechCrunch after pitch went viral",
    background: "bg-[#e5f6ff]",
  },
]

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div
    className={`p-6 rounded-xl ${testimonial.background} relative overflow-hidden w-[300px] h-[150px] flex flex-col justify-between`}
  >
    <div className="absolute top-2 right-2 text-2xl">🍑</div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">{testimonial.flag}</div>
      <div className="font-semibold">{testimonial.name}</div>
    </div>
    <p className="text-sm text-gray-700 mt-2">{testimonial.achievement}</p>
  </div>
)

const ScrollingRow = ({
  testimonials,
  direction = "left",
  speed = 20,
}: {
  testimonials: Testimonial[]
  direction?: "left" | "right"
  speed?: number
}) => {
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="flex gap-6 absolute"
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  )
}

export function ScrollingTestimonials() {
  return (
    <div className="relative w-full overflow-hidden py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F5] via-[#FFF0F0] to-[#FFE8E8] opacity-70" />

      {/* Multiple scrolling rows */}
      <div className="relative space-y-8">
        <ScrollingRow testimonials={testimonials.slice(0, 3)} direction="left" speed={30} />
        <ScrollingRow testimonials={testimonials.slice(3, 6)} direction="right" speed={25} />
        <ScrollingRow testimonials={testimonials.slice(0, 3).reverse()} direction="left" speed={20} />
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent" />
    </div>
  )
}

