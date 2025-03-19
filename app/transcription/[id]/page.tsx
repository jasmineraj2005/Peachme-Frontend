"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Check, X, Copy, RefreshCw } from "lucide-react"

interface TranscriptionSegment {
  startTime: number
  endTime: number
  text: string
  isEditing?: boolean
  editedText?: string
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
  // Try to parse the transcript as JSON
  try {
    const parsedJson = JSON.parse(transcript);
    
    // Check if this is the OpenAI verbose JSON format with segments
    if (parsedJson.segments && Array.isArray(parsedJson.segments)) {
      console.log('Parsing OpenAI JSON with segments');
      
      // Extract segments with start, end and text fields
      return parsedJson.segments.map((segment: { 
        start: number; 
        end: number; 
        text: string;
      }) => ({
        startTime: segment.start,
        endTime: segment.end,
        text: segment.text.trim()
      }));
    } 
    
    // If there's just a text field but no segments
    if (parsedJson.text) {
      console.log('Found JSON with just text field');
      return [{
        startTime: 0,
        endTime: 0,
        text: parsedJson.text
      }];
    }
  } catch (e) {
    // Not valid JSON, continue with other formats
    console.log('Not valid JSON, trying other formats');
  }

  // Check if transcript has timestamps in [MM:SS.ss - MM:SS.ss] format
  if (transcript.match(/\[\d+:\d+\.\d+\s*-\s*\d+:\d+\.\d+\]/)) {
    console.log('Parsing timestamp format');
    // Handle the format with timestamps
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
  
  // Handle plain text (no timestamps)
  console.log('Treating as plain text');
  return [{
    startTime: 0,
    endTime: 0,
    text: transcript.trim()
  }]
}

export default function TranscriptionPage() {
  const params = useParams()
  const router = useRouter()
  const [transcription, setTranscription] = useState<TranscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [evaluating, setEvaluating] = useState(false)
  const [editedSegments, setEditedSegments] = useState<Map<number, string>>(new Map())
  const [hasEdits, setHasEdits] = useState(false)

  useEffect(() => {
    const fetchTranscription = async () => {
      try {
        if (params.id === 'latest') {
          const stored = localStorage.getItem('lastTranscription')
          if (stored) {
            const data = JSON.parse(stored)
            console.log('Loaded transcription from localStorage:', data)
            
            // Reset edits when loading a new transcript
            setEditedSegments(new Map());
            setHasEdits(false);
            
            const segments = parseTranscript(data.text);
            console.log('Parsed segments:', segments)
            
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
        console.log('Loaded transcription from API:', data)
        
        // Reset edits when loading a new transcript
        setEditedSegments(new Map());
        setHasEdits(false);
        
        // Get transcript text from response
        const transcriptText = data.transcript || data.text || '';
        console.log('Transcript text:', transcriptText)
        
        const segments = parseTranscript(transcriptText);
        console.log('Parsed segments:', segments)
        
        setTranscription({
          title: data.title,
          description: data.description,
          text: transcriptText,
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
  }, [params.id, router])

  const filteredSegments = transcription?.segments?.filter(segment =>
    segment.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEvaluatePitch = async () => {
    if (!transcription?.text) return;
    
    setEvaluating(true);
    try {
      // Extract plain text for analysis
      let analysisText = transcription.text;
      
      // Apply any edits that have been made to segments
      if (hasEdits && transcription.segments) {
        // Start with a deep copy of the original segments
        const workingSegments = JSON.parse(JSON.stringify(transcription.segments));
        
        // Apply all edits from our map
        editedSegments.forEach((editedText, index) => {
          if (index < workingSegments.length) {
            workingSegments[index].text = editedText;
          }
        });
        
        // Handle different formats
        try {
          // Check if this is JSON format with text field
          const jsonData = JSON.parse(transcription.text);
          if (jsonData.text) {
            // Create a modified transcript by joining edited segment texts
            let editedFullText = '';
            if (workingSegments.length === 1 && workingSegments[0].startTime === 0) {
              // Single segment case (full transcript)
              editedFullText = workingSegments[0].text;
            } else {
              // Multiple segments case
              editedFullText = workingSegments.map((s: TranscriptionSegment) => s.text).join(' ');
            }
            
            console.log('Using edited text for analysis');
            analysisText = editedFullText;
          }
        } catch (e) {
          // Not JSON, handle as text with possible timestamps
          if (transcription.text.match(/\[\d+:\d+\.\d+\s*-\s*\d+:\d+\.\d+\]/)) {
            // For timestamp format, join the edited texts without timestamps
            analysisText = workingSegments.map((s: TranscriptionSegment) => s.text).join('\n');
            console.log('Using edited text with timestamps removed');
          } else {
            // For plain text, just use the edited text
            analysisText = workingSegments.map((s: TranscriptionSegment) => s.text).join('\n');
            console.log('Using edited plain text');
          }
        }
      } else {
        // No edits, use original text parsing
        try {
          const jsonData = JSON.parse(transcription.text);
          // If this is an OpenAI response with a text field, use that
          if (jsonData.text) {
            analysisText = jsonData.text;
            console.log('Using text field from OpenAI response');
          }
        } catch (e) {
          // If not JSON, check if it has timestamps
          if (transcription.text.match(/\[\d+:\d+\.\d+\s*-\s*\d+:\d+\.\d+\]/)) {
            // Strip timestamps from the text
            analysisText = transcription.text
              .split('\n')
              .map(line => {
                const match = line.match(/\[\d+:\d+\.\d+\s*-\s*\d+:\d+\.\d+\]\s*(.+)/)
                return match ? match[1].trim() : line
              })
              .join('\n');
            console.log('Stripped timestamps from text for analysis');
          }
        }
      }
      
      const response = await fetch('http://0.0.0.0:8001/api/video/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: analysisText,
          conversation_id: params.id !== 'latest' ? params.id : undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze pitch');
      }

      const data = await response.json();
      
      // Store the evaluation result and transcription data
      localStorage.setItem('pitchEvaluation', JSON.stringify({
        evaluation: data,
        transcription: transcription,
        timestamp: new Date().toISOString()
      }));

      // Navigate to the evaluation page
      router.push('/pitch-evaluation');
    } catch (error) {
      console.error('Error evaluating pitch:', error);
      alert('Failed to evaluate pitch. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  // Function to start editing a segment
  const startEditing = (index: number) => {
    if (!transcription?.segments) return;
    
    const updatedSegments = [...transcription.segments];
    updatedSegments[index] = { 
      ...updatedSegments[index], 
      isEditing: true,
      editedText: editedSegments.get(index) || updatedSegments[index].text
    };
    
    setTranscription({
      ...transcription,
      segments: updatedSegments
    });
  };

  // Function to save edits to a segment
  const saveEdits = (index: number) => {
    if (!transcription?.segments) return;
    
    const updatedSegments = [...transcription.segments];
    const segment = updatedSegments[index];
    
    // Only update if there's an actual change
    if (segment.editedText !== segment.text) {
      // Save to our editedSegments map
      const newEditedSegments = new Map(editedSegments);
      newEditedSegments.set(index, segment.editedText || segment.text);
      setEditedSegments(newEditedSegments);
      setHasEdits(true);
    }
    
    // Exit edit mode
    updatedSegments[index] = { 
      ...segment, 
      isEditing: false 
    };
    
    setTranscription({
      ...transcription,
      segments: updatedSegments
    });
  };

  // Function to cancel edits to a segment
  const cancelEdits = (index: number) => {
    if (!transcription?.segments) return;
    
    const updatedSegments = [...transcription.segments];
    updatedSegments[index] = { 
      ...updatedSegments[index], 
      isEditing: false
    };
    
    setTranscription({
      ...transcription,
      segments: updatedSegments
    });
  };

  // Function to handle changes to the edited text
  const handleEditChange = (index: number, value: string) => {
    if (!transcription?.segments) return;
    
    const updatedSegments = [...transcription.segments];
    updatedSegments[index] = { 
      ...updatedSegments[index], 
      editedText: value
    };
    
    setTranscription({
      ...transcription,
      segments: updatedSegments
    });
  };

  // Function to reset all edits
  const resetAllEdits = () => {
    if (!transcription?.segments) return;
    
    // Clear the edited segments map
    setEditedSegments(new Map());
    setHasEdits(false);
    
    // Reset any segments in edit mode
    const updatedSegments = transcription.segments.map(segment => ({
      ...segment,
      isEditing: false,
      editedText: undefined
    }));
    
    setTranscription({
      ...transcription,
      segments: updatedSegments
    });
  };

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
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
            {hasEdits && (
              <Button 
                variant="outline" 
                onClick={resetAllEdits}
                className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Edits
              </Button>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button 
              variant="default"
              className="bg-gradient-to-r from-[#FFB6A3] via-[#FFA088] to-[#FF8A6D] text-white hover:opacity-90"
              onClick={handleEvaluatePitch}
              disabled={evaluating}
            >
              {evaluating ? 'Evaluating...' : 'Evaluate Pitch'}
            </Button>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Transcription</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Editable
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-64 text-xs">Click the edit button on any segment to correct transcription errors before evaluating your pitch.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredSegments?.length || 0} 
                {filteredSegments?.length === 1 && filteredSegments[0].startTime === 0 ? 
                  ' (full transcript)' : 
                  ` segment${filteredSegments?.length !== 1 ? 's' : ''}`}
                {hasEdits && <span className="ml-2 text-yellow-600">(edited)</span>}
              </span>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {filteredSegments?.map((segment, index) => (
                <div
                  key={index}
                  className="group p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {segment.startTime !== 0 || segment.endTime !== 0 ? (
                      <div className="min-w-[120px] text-sm font-medium text-muted-foreground">
                        {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                      </div>
                    ) : (
                      <div className="min-w-[120px] text-sm font-medium text-muted-foreground">
                        Full Transcript
                      </div>
                    )}
                    <div className="flex-1 text-sm">
                      {segment.isEditing ? (
                        // Editable textarea
                        <Textarea
                          value={segment.editedText || segment.text}
                          onChange={(e) => handleEditChange(index, e.target.value)}
                          className="min-h-[80px] focus:border-blue-400"
                          placeholder="Edit transcript text..."
                        />
                      ) : searchTerm ? (
                        // Search highlighting
                        <span
                          dangerouslySetInnerHTML={{
                            __html: (editedSegments.has(index) ? editedSegments.get(index)! : segment.text).replace(
                              new RegExp(searchTerm, 'gi'),
                              match => `<mark class="bg-yellow-200 rounded">${match}</mark>`
                            )
                          }}
                        />
                      ) : (
                        // Normal display 
                        <div className={`whitespace-pre-line ${editedSegments.has(index) ? 'text-blue-700 font-medium' : ''}`}>
                          {editedSegments.has(index) ? editedSegments.get(index) : segment.text}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {segment.isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600"
                            onClick={() => saveEdits(index)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => cancelEdits(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => startEditing(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                editedSegments.has(index) ? editedSegments.get(index)! : segment.text
                              )
                              alert('Text copied to clipboard!')
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
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