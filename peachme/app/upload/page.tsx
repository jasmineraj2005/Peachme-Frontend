"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"

export default function UploadPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user, isLoading } = useAuth()

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/signup?redirectTo=/upload")
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 300)

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setIsUploading(false)
        setTitle("")
        setDescription("")
        setFile(null)
        setUploadProgress(0)

        // Show success message or redirect
        alert("Video uploaded successfully!")
      }, 500)
    }, 3000)
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Upload Your Pitch Video</h1>
          <p className="text-muted-foreground">Share your pitch with top venture capital firms</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Pitch Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your pitch video"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Pitch Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe your startup and what you're looking for"
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video File</Label>
            <div
              className="flex flex-col items-center justify-center rounded-md border border-dashed border-input p-12 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-2">
                <div className="flex justify-center">
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
                    className="h-10 w-10 text-muted-foreground"
                  >
                    <path d="m21 15-5-5-5 5" />
                    <path d="M16 4v11" />
                    <path d="M8 16H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-8" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {file ? file.name : "Drag and drop your video here or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground">Supports MP4, MOV, AVI up to 1GB</p>
                </div>
              </div>
              <Input
                ref={fileInputRef}
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                required={!file}
              />
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload Pitch Video"}
          </Button>
        </form>
      </div>
    </div>
  )
}

