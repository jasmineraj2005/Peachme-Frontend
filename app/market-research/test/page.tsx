"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setTestResults("Testing API connection...")
    
    try {
      // Test basic connectivity
      const response = await fetch('http://localhost:8001/api/video/test-connection')
      
      if (!response.ok) {
        throw new Error(`Failed to connect: ${response.status}`)
      }
      
      const data = await response.json()
      setTestResults(`Connection successful! Response: ${JSON.stringify(data)}`)
    } catch (error) {
      setTestResults(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testMarketResearch = async () => {
    setLoading(true)
    setTestResults("Testing market research API...")
    
    try {
      // Test with minimal data
      const testData = {
        industry: "Technology",
        verticals: ["Software"],
        problem: "Test problem",
        summary: "Test summary"
      }
      
      const response = await fetch('http://localhost:8001/api/video/market-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: JSON.stringify(testData)
        }),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed: ${response.status} - ${errorText}`)
      }
      
      setTestResults("Market research API call successful! This may take some time to complete.")
    } catch (error) {
      setTestResults(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold">API Test Page</h1>
        
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Test API Connectivity</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={testConnection}
                disabled={loading}
                className="bg-blue-500 text-white"
              >
                Test Basic Connection
              </Button>
              
              <Button 
                onClick={testMarketResearch}
                disabled={loading}
                className="bg-green-500 text-white"
              >
                Test Market Research API
              </Button>
            </div>
            
            {testResults && (
              <div className={`p-4 rounded border ${testResults.includes('Error') ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
                <pre className="whitespace-pre-wrap">{testResults}</pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
} 