"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, TrendingUp, Globe, Database } from "lucide-react"

interface Competitor {
  name: string
  description: string
  url?: string
}

interface MarketSize {
  overall: string
  growth?: string
  projection?: string
}

interface MarketSizeSources {
  overall?: string
  growth?: string
  projection?: string
}

interface MarketTrend {
  title: string
  description: string
}

interface MarketResearch {
  competitors: Competitor[]
  market_size: MarketSize
  market_size_sources?: MarketSizeSources
  market_size_source?: string  // For backward compatibility
  trends: MarketTrend[]
  trends_source?: string
  growth_calculation?: string
  summary: string
}

export default function MarketResearchPage() {
  const router = useRouter()
  const [research, setResearch] = useState<MarketResearch | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pitchContext, setPitchContext] = useState<any>(null)

  useEffect(() => {
    // Get the stored evaluation with context
    const storedEvaluation = localStorage.getItem('pitchEvaluation')
    console.log("Stored evaluation:", storedEvaluation ? "found" : "not found");
    
    if (!storedEvaluation) {
      router.push('/upload')
      return
    }

    try {
      const evaluation = JSON.parse(storedEvaluation)
      console.log("Parsed evaluation structure:", Object.keys(evaluation));
      console.log("Has context?", evaluation.evaluation && evaluation.evaluation.context ? "Yes" : "No");
      
      if (!evaluation.evaluation.context) {
        setError("No pitch context available for market research")
        return
      }
      
      console.log("Context data:", evaluation.evaluation.context);
      setPitchContext(evaluation.evaluation.context)
      
      // Check if we have stored research results
      const storedResearch = localStorage.getItem('marketResearch')
      if (storedResearch) {
        setResearch(JSON.parse(storedResearch))
      }
    } catch (err) {
      console.error("Error parsing stored data:", err)
      setError("Failed to load pitch context")
    }
  }, [router])

  const conductResearch = async () => {
    if (!pitchContext) {
      console.error("Cannot conduct research: pitchContext is null or undefined");
      setError("Pitch context is missing");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Log what we're sending to help debug
      console.log("Sending pitch context:", pitchContext);
      
      // Try a different URL format
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8001/api/video/market-research'
        : 'http://0.0.0.0:8001/api/video/market-research';
      
      console.log("Using API URL:", apiUrl);
      
      const requestBody = {
        message: JSON.stringify(pitchContext)
      };
      console.log("Request body:", requestBody);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        // Try to get error details from the response
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.detail || `API error: ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Failed to conduct research: ${response.status} - ${errorText.substring(0, 100)}...`);
        }
      }

      const data = await response.json()
      console.log("Received research data:", data);
      
      // Store the research results
      localStorage.setItem('marketResearch', JSON.stringify(data))
      
      // Update state
      setResearch(data)
    } catch (err) {
      console.error("Error conducting market research:", err)
      setError(err instanceof Error ? err.message : "Failed to conduct market research")
    } finally {
      setLoading(false)
    }
  }

  if (!pitchContext) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">No pitch context found</h2>
          <p className="mt-2 text-muted-foreground">
            You need to evaluate a pitch first before conducting market research.
          </p>
          <Button className="mt-4" onClick={() => router.push('/upload')}>
            Upload a Video
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Market Research</h1>
          <p className="text-muted-foreground">
            Competitive analysis and market sizing for your pitch
          </p>
        </div>

        {/* Pitch Context Summary */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Pitch Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Industry</p>
              <p className="bg-blue-50 p-2 rounded">{pitchContext.industry}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Problem</p>
              <p className="bg-green-50 p-2 rounded">{pitchContext.problem}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium">Verticals</p>
              <div className="flex flex-wrap gap-2">
                {pitchContext.verticals.map((vertical: string, idx: number) => (
                  <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                    {vertical}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Always show research button, regardless of whether research exists or not */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button 
              onClick={conductResearch}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 font-medium px-6 py-2 text-base"
              size="lg"
            >
              {loading ? 'Researching...' : research ? 'Update Research' : 'Conduct Market Research'}
            </Button>
            
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>
        </Card>

        {/* Research Results */}
        {research && (
          <>
            {/* Summary */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold mb-2">Research Summary</h2>
              <p className="text-gray-700">{research.summary}</p>
            </Card>

            {/* Tabbed Content */}
            <Tabs defaultValue="competitors" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="competitors">
                  <Globe className="h-4 w-4 mr-2" />
                  Competitors
                </TabsTrigger>
                <TabsTrigger value="market-size">
                  <Database className="h-4 w-4 mr-2" />
                  Market Size
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="sources">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Sources
                </TabsTrigger>
              </TabsList>
              
              {/* Competitors Tab */}
              <TabsContent value="competitors" className="p-0">
                <Card>
                  <div className="divide-y">
                    {research.competitors.map((competitor, index) => (
                      <div key={index} className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium">{competitor.name}</h3>
                          {competitor.url && (
                            <a 
                              href={competitor.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 text-sm"
                            >
                              Visit Site <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                        <p className="text-gray-600">{competitor.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              {/* Market Size Tab */}
              <TabsContent value="market-size" className="p-0">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500">OVERALL MARKET SIZE</h3>
                      <p className="text-3xl font-bold text-blue-800">{research.market_size.overall}</p>
                      {(research.market_size_sources?.overall || research.market_size_source) && (
                        <a 
                          href={research.market_size_sources?.overall || research.market_size_source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 flex items-center mt-1"
                        >
                          Source <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {research.market_size.growth && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">ANNUAL GROWTH</h3>
                          <p className="text-2xl font-semibold text-green-600">{research.market_size.growth}</p>
                          {(research.market_size_sources?.growth || research.market_size_source) && (
                            <a 
                              href={research.market_size_sources?.growth || research.market_size_source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 flex items-center mt-1"
                            >
                              Source <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      )}
                      
                      {research.market_size.projection && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">FUTURE PROJECTION</h3>
                          <p className="text-2xl font-semibold text-indigo-600">{research.market_size.projection}</p>
                          {(research.market_size_sources?.projection || research.market_size_source) && (
                            <a 
                              href={research.market_size_sources?.projection || research.market_size_source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 flex items-center mt-1"
                            >
                              Source <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {research.growth_calculation && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <h3 className="text-sm font-medium text-gray-600">Growth Calculation Method</h3>
                        <p className="text-sm text-gray-700 mt-1">{research.growth_calculation}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              {/* Trends Tab */}
              <TabsContent value="trends" className="p-0">
                <Card>
                  <div className="divide-y">
                    {research.trends.map((trend, index) => (
                      <div key={index} className="p-4 space-y-2">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                          <h3 className="text-lg font-medium">{trend.title}</h3>
                        </div>
                        <p className="text-gray-600">{trend.description}</p>
                      </div>
                    ))}
                    
                    {research.trends_source && (
                      <div className="p-4 flex justify-between items-center bg-gray-50">
                        <h3 className="text-sm font-medium text-gray-600">Source</h3>
                        <a 
                          href={research.trends_source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 flex items-center"
                        >
                          View Source <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              {/* Sources Tab */}
              <TabsContent value="sources" className="p-0">
                <Card className="p-6">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Research Sources</h2>
                    
                    {/* Market Size Sources */}
                    <div className="space-y-2">
                      <h3 className="text-base font-medium text-blue-700">Market Size Sources</h3>
                      <div className="space-y-2 pl-4">
                        {research.market_size_sources && Object.keys(research.market_size_sources).length > 0 ? (
                          <>
                            {research.market_size_sources.overall && (
                              <div>
                                <h4 className="text-sm font-medium">Overall Market Size</h4>
                                <a 
                                  href={research.market_size_sources.overall}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 flex items-center mt-1"
                                >
                                  {research.market_size_sources.overall} <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                            
                            {research.market_size_sources.growth && (
                              <div>
                                <h4 className="text-sm font-medium">Growth Rate</h4>
                                <a 
                                  href={research.market_size_sources.growth}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 flex items-center mt-1"
                                >
                                  {research.market_size_sources.growth} <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                            
                            {research.market_size_sources.projection && (
                              <div>
                                <h4 className="text-sm font-medium">Future Projection</h4>
                                <a 
                                  href={research.market_size_sources.projection}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 flex items-center mt-1"
                                >
                                  {research.market_size_sources.projection} <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}

                            {/* For backward compatibility, check for market_size_source string */}
                            {!research.market_size_sources.overall && 
                             !research.market_size_sources.growth && 
                             !research.market_size_sources.projection && 
                             research.market_size_source && (
                              <div>
                                <h4 className="text-sm font-medium">Market Size</h4>
                                <a 
                                  href={research.market_size_source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 flex items-center mt-1"
                                >
                                  {research.market_size_source} <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )}
                          </>
                        ) : research.market_size_source ? (
                          <div>
                            <h4 className="text-sm font-medium">Market Size</h4>
                            <a 
                              href={research.market_size_source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 flex items-center mt-1"
                            >
                              {research.market_size_source} <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No source provided for market size</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Trends Sources */}
                    <div className="space-y-2">
                      <h3 className="text-base font-medium text-purple-700">Market Trends Sources</h3>
                      <div className="pl-4">
                        {research.trends_source ? (
                          <a 
                            href={research.trends_source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 flex items-center mt-1"
                          >
                            {research.trends_source} <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500">No source provided for market trends</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Competitor Sources */}
                    <div className="space-y-2">
                      <h3 className="text-base font-medium text-green-700">Competitor Sources</h3>
                      <div className="space-y-2 pl-4">
                        {research.competitors.some(comp => comp.url) ? (
                          research.competitors.map((competitor, index) => (
                            competitor.url && (
                              <div key={`comp-source-${index}`}>
                                <h4 className="text-sm font-medium">{competitor.name}</h4>
                                <a 
                                  href={competitor.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 flex items-center mt-1"
                                >
                                  {competitor.url} <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            )
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No sources provided for competitors</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Growth Calculation */}
                    {research.growth_calculation && (
                      <div className="space-y-2">
                        <h3 className="text-base font-medium text-amber-700">Growth Calculation Methodology</h3>
                        <div className="pl-4 mt-1">
                          <p className="text-sm text-gray-700">{research.growth_calculation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/pitch-evaluation')}>
                Back to Evaluation
              </Button>
              <div className="space-x-2">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => router.push('/pitch-deck')}
                >
                  View Pitch Deck
                </Button>
                <Button 
                  variant="default"
                  className="bg-gradient-to-r from-[#FFB6A3] via-[#FFA088] to-[#FF8A6D] text-white hover:opacity-90"
                  onClick={() => router.push('/upload')}
                >
                  Upload Another Video
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 