"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function PitchDeckPage() {
  const router = useRouter()
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const callApi = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get stored data from localStorage
      const storedEvaluation = localStorage.getItem('pitchEvaluation')
      const storedMarketResearch = localStorage.getItem('marketResearch')
      
      let payload: any = {}
      
      if (storedEvaluation) {
        try {
          const evaluation = JSON.parse(storedEvaluation)
          payload = {
            context: evaluation.evaluation.context,
            evaluation: evaluation.evaluation
          }
        } catch (error) {
          console.error('Error parsing evaluation data:', error)
          setError('Failed to parse evaluation data')
        }
      }
      
      if (storedMarketResearch) {
        try {
          payload = {
            ...payload,
            market_research: JSON.parse(storedMarketResearch)
          }
        } catch (error) {
          console.error('Error parsing market research data:', error)
        }
      }
      
      console.log('Sending request to API with payload:', payload)
      
      // IMPORTANT: Making direct call to FastAPI server, NOT the Next.js API route
      // This bypasses the mock data in app/api/video/pitch-deck-content/route.ts
      const response = await fetch('http://localhost:8001/api/video/pitch-deck-content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: JSON.stringify(payload)
        })
      })
      
      if (!response.ok) {
        // Get the response as text first
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }
      
      // Get the raw text response
      const rawText = await response.text()
      console.log('Raw API response:', rawText)
      
      let data
      try {
        // Try to parse the response as JSON
        data = JSON.parse(rawText)
        console.log('Parsed API response:', data)
      } catch (parseError) {
        console.error('Error parsing API response as JSON:', parseError)
        // Just use the raw text if JSON parsing fails
        data = { rawResponse: rawText }
      }
      
      setApiResponse(data)
      
    } catch (error) {
      console.error('Error calling API:', error)
      setError(`${error}`)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pitch Deck API Test</h1>
          
          <div className="space-x-4">
            <Button 
              variant="outline"
              onClick={() => router.push('/market-research')}
            >
              Back to Market Research
            </Button>
            
            <Button 
              onClick={callApi}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Call Pitch Deck API'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white border rounded shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">API Response:</h2>
          {!apiResponse ? (
            <p className="text-gray-500">No data yet. Click the button to call the API.</p>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px] text-xs">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          )}
        </div>
        
        <div className="bg-white border rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">API Payload:</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const storedEvaluation = localStorage.getItem('pitchEvaluation')
              const storedMarketResearch = localStorage.getItem('marketResearch')
              
              let payload: any = {}
              
              if (storedEvaluation) {
                try {
                  const evaluation = JSON.parse(storedEvaluation)
                  payload = {
                    context: evaluation.evaluation.context,
                    evaluation: evaluation.evaluation
                  }
                } catch (error) {
                  console.error('Error parsing evaluation data:', error)
                }
              }
              
              if (storedMarketResearch) {
                try {
                  payload = {
                    ...payload,
                    market_research: JSON.parse(storedMarketResearch)
                  }
                } catch (error) {
                  console.error('Error parsing market research data:', error)
                }
              }
              
              // Show the payload that would be sent
              const requestBody = { message: JSON.stringify(payload) }
              console.log('API payload:', requestBody)
              
              const payloadDisplay = document.getElementById('payload-display')
              if (payloadDisplay) {
                payloadDisplay.textContent = JSON.stringify(requestBody, null, 2)
              }
            }}
            className="mb-2"
          >
            Show API Payload
          </Button>
          <pre id="payload-display" className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] text-xs">
            Click "Show API Payload" to see what will be sent to the API
          </pre>
        </div>
      </div>
    </div>
  )
} 