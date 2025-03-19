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
  const [status, setStatus] = useState<string>("")
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
    setStatus("Uploading video...")

    try {
      // Create form data
      const formData = new FormData()
      formData.append('video', file)
      formData.append('title', title)
      formData.append('description', description)

      // Upload progress simulation
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 300)

      // Make API call to transcribe endpoint
      const response = await fetch('http://0.0.0.0:8001/api/video/transcribe', {
        method: 'POST',
        body: formData,
      })

      // Clear interval and set progress to 100%
      clearInterval(interval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error:', errorText)
        throw new Error(`Failed to transcribe video: ${response.status} ${response.statusText}`)
      }

      const responseText = await response.text()
      console.log('Raw response:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse JSON response:', e)
        throw new Error('Invalid response from server: not a valid JSON')
      }
      
      console.log('Parsed response data:', data)
      
      setStatus("Processing transcription...")

      // Check if we have a transcript in the response
      if (data.transcript) {
        // If we have the transcription text directly
        setIsUploading(false)
        setTitle("")
        setDescription("")
        setFile(null)
        setUploadProgress(0)
        setStatus("")
        
        // Store the transcription in localStorage temporarily
        localStorage.setItem('lastTranscription', JSON.stringify({
          title,
          description,
          text: data.transcript,
          timestamp: new Date().toISOString()
        }))
        
        // Redirect to transcription display page
        router.push('/transcription/latest')
        return
      }

      // If no transcript in response, look for an ID to poll
      const transcriptionId = data.id || data.transcription_id || data.conversation_id
      if (!transcriptionId) {
        console.error('Invalid server response:', data)
        throw new Error('No transcription data received from server')
      }

      // Poll for transcription status
      let attempts = 0
      const maxAttempts = 150 // 5 minutes with 2-second intervals
      
      const pollInterval = setInterval(async () => {
        try {
          attempts++
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval)
            throw new Error('Transcription timed out after 5 minutes')
          }

          const statusUrl = `http://0.0.0.0:8001/api/video/transcribe/${transcriptionId}`
          console.log('Polling status:', statusUrl) // Debug log
          
          const statusResponse = await fetch(statusUrl)
          console.log('Status response:', statusResponse.status) // Debug log
          
          if (!statusResponse.ok) {
            const errorText = await statusResponse.text()
            console.error('Status check error:', errorText)
            throw new Error(`Failed to check transcription status: ${statusResponse.status}`)
          }

          const statusData = await statusResponse.json()
          console.log('Status data:', statusData) // Debug log

          if (statusData.status === 'completed') {
            clearInterval(pollInterval)
            // Reset form
            setIsUploading(false)
            setTitle("")
            setDescription("")
            setFile(null)
            setUploadProgress(0)
            setStatus("")
            // Redirect to transcription page
            router.push(`/transcription/${transcriptionId}`)
          } else if (statusData.status === 'failed') {
            clearInterval(pollInterval)
            throw new Error('Transcription failed: ' + (statusData.error || 'Unknown error'))
          } else {
            setStatus(`Processing transcription... (${Math.round((attempts / maxAttempts) * 100)}%)`)
          }
        } catch (error) {
          clearInterval(pollInterval)
          console.error('Polling error:', error)
          throw error
        }
      }, 2000)

    } catch (error) {
      console.error('Error in upload/transcribe process:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload and transcribe video. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
      setStatus("")
    }
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
                <span>{status}</span>
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
            {isUploading ? "Processing..." : "Upload Pitch Video"}
          </Button>
        </form>
      </div>
    </div>
  )
}

