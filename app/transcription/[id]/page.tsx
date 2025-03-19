"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface TranscriptionSegment {
  startTime: number
  endTime: number
  text: string
}

interface TranscriptionData {
  title?: string
  description?: string
  text: string
  timestamp?: string
  segments?: TranscriptionSegment[]
}

function parseTimestamp(timestamp: string): number {
  const [minutes, seconds] = timestamp.split(':').map(Number)
  return minutes * 60 + seconds
}

function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  const milliseconds = Math.floor((timeInSeconds % 1) * 100)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
}

function parseTranscript(transcript: string): TranscriptionSegment[] {
  const segments: TranscriptionSegment[] = []
  const lines = transcript.split('\n')

  for (const line of lines) {
    const match = line.match(/\[(\d+:\d+\.\d+)\s*-\s*(\d+:\d+\.\d+)\]\s*(.+)/)
    if (match) {
      const [, startStr, endStr, text] = match
      const startTime = parseTimestamp(startStr)
      const endTime = parseTimestamp(endStr)
      segments.push({ startTime, endTime, text: text.trim() })
    }
  }

  return segments
}

export default function TranscriptionPage() {
  const params = useParams()
  const router = useRouter()
  const [transcription, setTranscription] = useState<TranscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTranscription = async () => {
      try {
        if (params.id === 'latest') {
          const stored = localStorage.getItem('lastTranscription')
          if (stored) {
            const data = JSON.parse(stored)
            const segments = parseTranscript(data.text)
            setTranscription({ ...data, segments })
            setLoading(false)
            return
          }
          throw new Error('No transcription found')
        }

        const response = await fetch(`http://0.0.0.0:8001/api/video/transcribe/${params.id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch transcription: ${response.status}`)
        }
        const data = await response.json()
        const segments = parseTranscript(data.transcript || data.text)
        setTranscription({
          title: data.title,
          description: data.description,
          text: data.transcript || data.text,
          timestamp: data.timestamp,
          segments
        })
      } catch (error) {
        console.error('Error fetching transcription:', error)
        setError(error instanceof Error ? error.message : 'Failed to load transcription')
      } finally {
        setLoading(false)
      }
    }

    fetchTranscription()
  }, [params.id])

  const filteredSegments = transcription?.segments?.filter(segment =>
    segment.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Loading transcription...</h2>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full animate-pulse bg-primary" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!transcription || !transcription.segments) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">No transcription found</h2>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{transcription.title || 'Video Transcription'}</h1>
          {transcription.description && (
            <p className="text-muted-foreground">{transcription.description}</p>
          )}
          {transcription.timestamp && (
            <p className="text-sm text-muted-foreground">
              Transcribed on {new Date(transcription.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search in transcription..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                const text = filteredSegments?.map(s => s.text).join('\n') || ''
                navigator.clipboard.writeText(text)
                alert('Transcription copied to clipboard!')
              }}
            >
              Copy All
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold">Transcription</h2>
              <span className="text-sm text-muted-foreground">
                {filteredSegments?.length || 0} segments
              </span>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredSegments?.map((segment, index) => (
                <div
                  key={index}
                  className="group p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="min-w-[120px] text-sm font-medium text-muted-foreground">
                      {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                    </div>
                    <div className="flex-1 text-sm">
                      {searchTerm ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: segment.text.replace(
                              new RegExp(searchTerm, 'gi'),
                              match => `<mark class="bg-yellow-200 rounded">${match}</mark>`
                            )
                          }}
                        />
                      ) : (
                        segment.text
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        navigator.clipboard.writeText(segment.text)
                        alert('Segment copied to clipboard!')
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 