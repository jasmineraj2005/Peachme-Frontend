"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  prefix: string
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}

export default function Typewriter({
  prefix,
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
}: TypewriterProps) {
  const [text, setText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]

    const handleTyping = () => {
      if (isWaiting) return

      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1))

        if (text.length === 0) {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      } else {
        setText(currentWord.substring(0, text.length + 1))

        if (text.length === currentWord.length) {
          setIsWaiting(true)
          setTimeout(() => {
            setIsWaiting(false)
            setIsDeleting(true)
          }, pauseTime)
        }
      }
    }

    const typingInterval = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(typingInterval)
  }, [text, isDeleting, isWaiting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return (
    <div className="flex flex-col items-center gap-8 h-[200px]">
      <div className="text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground">{prefix}</div>
      <div className="relative min-h-[60px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFB6A3] via-[#FFA088] to-[#FF8A6D] rounded-lg -z-10" />
        <div className="px-8 py-4 text-4xl md:text-5xl lg:text-6xl font-bold text-white min-w-[400px]">
          {text}
          <span className="inline-block w-[2px] h-[1em] bg-white ml-1 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

