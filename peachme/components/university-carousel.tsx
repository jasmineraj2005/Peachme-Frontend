"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const universities = [
  {
    name: "Deakin University",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deakin-university-logo-png_seeklogo-491551-opKqCUxa0kA6tRamI9WoY4Z1wue32T.png",
    width: 300,
    height: 120,
  },
  {
    name: "Swinburne University of Technology",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Swinburne-300x300-Qspzx6KzpgaHHpwxh1hixJY5RDcpLV.png",
    width: 350,
    height: 120,
  },
  {
    name: "University of Melbourne",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Edalex-Credentialate-Use-Case-Uni-of-Melbourne-1536x877-2-lb8PYHq1oro7zrtnQ3ZHcUMjkh6ZyC.png",
    width: 300,
    height: 120,
  },
]

export function UniversityCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % universities.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full bg-white py-12 mt-12">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-[#FFB6A3] to-[#FF8A6D] text-transparent bg-clip-text">
          Trusted by Leading Universities
        </h2>
        <div className="relative h-[200px] overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out absolute w-full h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {universities.map((uni, index) => (
              <div key={uni.name} className="w-full flex-shrink-0 flex items-center justify-center px-4">
                <div className="relative w-[350px] h-[150px]">
                  <Image src={uni.logo || "/placeholder.svg"} alt={uni.name} fill className="object-contain" priority />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

