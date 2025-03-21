"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, PresentationIcon, LightbulbIcon, BarChart4, Puzzle, Users, LineChart, Target, Edit, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

interface PitchContext {
  industry: string;
  verticals: string[];
  problem: string;
  summary: string;
  productName?: string;
}

interface EditableField {
  key: string;
  value: string;
  isEditing: boolean;
}

export default function PitchDeckPage() {
  const router = useRouter()
  const [pitchContext, setPitchContext] = useState<PitchContext | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Placeholder for the generated pitch deck content
  const [pitchDeck, setPitchDeck] = useState({
    productName: "Your Product",
    missionStatement: "A compelling mission statement will appear here.",
    overview: "An overview of your product and market will be displayed in this section.",
    problemStatement: "A detailed description of the problem your product solves.",
    marketSize: "$44B",
    growthRate: "XX% annual growth",
    targetMarket: "$2.2B",
    marketShare: "$120M",
    solution: "An explanation of how your product solves the identified problem."
  })
  
  const [editableFields, setEditableFields] = useState<Record<string, EditableField>>({})
  
  // Add state for API-loaded content
  const [apiLoadedContent, setApiLoadedContent] = useState({
    problem: {
      title: "",
      painPoints: "",
      currentSolutions: "",
      marketGap: ""
    },
    // Other slide sections can be added here later
  })
  
  // Add loading state for API calls
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  
  // Helper function to get editable field or original value if not being edited
  const getFieldContent = (key: string, defaultValue: string) => {
    if (editableFields[key]?.isEditing) {
      return editableFields[key].value
    }
    return defaultValue
  }
  
  // Helper function to start editing a field
  const startEditing = (key: string, initialValue: string) => {
    setEditableFields(prev => ({
      ...prev,
      [key]: {
        key,
        value: initialValue,
        isEditing: true
      }
    }))
  }
  
  // Helper function to save an edited field
  const saveField = (key: string) => {
    if (editableFields[key]) {
      const newValue = editableFields[key].value
      
      // Update the pitch deck with the new value
      setPitchDeck(prev => ({
        ...prev,
        [key]: newValue
      }))
      
      // Reset the editing state
      setEditableFields(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          isEditing: false
        }
      }))
    }
  }
  
  // Helper function to handle input changes
  const handleFieldChange = (key: string, value: string) => {
    setEditableFields(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value
      }
    }))
  }
  
  const slides = [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "The Problem" },
    { id: "whynow", title: "Why Now?" },
    { id: "solution", title: "Solution" },
    { id: "market", title: "Market Opportunity" }
  ]

  const [teamMembers, setTeamMembers] = useState([
    { name: "Elana Lee", role: "CEO + FOUNDER", image: "/placeholder-avatar.jpg" },
    { name: "Jacob Mac", role: "CEO", image: "/placeholder-avatar.jpg" },
    { name: "Erica Johnson", role: "HEAD OF PRODUCT", image: "/placeholder-avatar.jpg" },
    { name: "Elizabeth Jef", role: "SENIOR DEVELOPER", image: "/placeholder-avatar.jpg" }
  ])

  const [features, setFeatures] = useState([
    { title: "Feature One", description: "This product section shows what your customers gain from using your product.", image: "/placeholder-feature.jpg" },
    { title: "Feature Two", description: "Use lots of visuals and focus on unique features and innovative technology.", image: "/placeholder-feature.jpg" },
    { title: "Feature Three", description: "If you have a single product, highlighting its three core offerings also works here.", image: "/placeholder-feature.jpg" }
  ])

  // Function to fetch content from AI agent API
  const fetchSlideContent = useCallback(async (slideId: string = 'all') => {
    setIsLoadingContent(true)
    try {
      // This is where you would call your API with the slide ID and any context needed
      // const response = await fetch(`/api/slide-content/${slideId}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ pitchContext })
      // })
      // const data = await response.json()
      
      // For now we'll simulate a response with the existing content
      // This would be replaced with actual API call later
      const mockData = {
        problem: {
          title: pitchDeck.problemStatement ? "Why is your target customer frustrated with current solutions?" : "",
          painPoints: pitchDeck.problemStatement || "Loading content from AI...",
          currentSolutions: "Describe how existing solutions are inadequate and why customers are dissatisfied with the current alternatives in the market.",
          marketGap: "Explain the specific gap your solution addresses and why it represents a significant opportunity in the market. Quantify the problem if possible with relevant metrics and data points."
        },
        overview: {
          title: "A succinct summary of your business — a dense slide that is skipped when presenting.",
          highlights: "If someone only read these bullet points, they should still be able to walk away with some understanding of your company and product.",
          industryMarket: "Overview of who your (potential) customers are."
        },
        whynow: {
          title: "What makes this the right moment for you and your company?",
          description: "This is your opportunity to showcase why now is the perfect time for your product to enter the market. Highlight changing consumer behaviors, technological shifts, or industry trends that make your solution timely."
        },
        solution: {
          title: "This sets up your product features and should answer the problem.",
          features: features.map(feature => ({
            title: feature.title,
            description: feature.description
          }))
        },
        market: {
          title: "Market Opportunity",
          tam: {
            title: "Total Addressable Market (TAM)",
            description: "What is the total global opportunity for this product? The sky's the limit.",
            value: pitchDeck.marketSize
          },
          sam: {
            title: "Serviceable Addressable Market (SAM)",
            description: "What is the TAM that you can actually serve?",
            value: pitchDeck.targetMarket
          },
          target: {
            title: "Target Market",
            description: "Describe who you'll market to, and the people who will buy what you're selling.",
            value: pitchDeck.targetMarket
          },
          share: {
            title: "Market Share",
            description: "Estimate your market share with a percentage or in dollars.",
            value: pitchDeck.marketShare
          }
        }
      }
      
      // Simulate API delay
      setTimeout(() => {
        if (slideId === 'all') {
          // Update all slides
          setApiLoadedContent(mockData);
        } else {
          // Update just the specified slide
          setApiLoadedContent(prevContent => ({
            ...prevContent,
            [slideId]: mockData[slideId as keyof typeof mockData]
          }))
        }
        setIsLoadingContent(false)
      }, 1000)
      
    } catch (error) {
      console.error("Error fetching slide content:", error)
      setIsLoadingContent(false)
    }
  }, [pitchDeck.problemStatement, pitchDeck.marketSize, pitchDeck.targetMarket, pitchDeck.marketShare, features])
  
  // Call the API when the component mounts
  useEffect(() => {
    if (pitchContext) {
      fetchSlideContent('all')
    }
  }, [pitchContext, fetchSlideContent])

  useEffect(() => {
    // Get the stored evaluation with context
    const storedEvaluation = localStorage.getItem('pitchEvaluation')
    
    if (!storedEvaluation) {
      router.push('/upload')
      return
    }

    try {
      const evaluation = JSON.parse(storedEvaluation)
      
      if (!evaluation.evaluation.context) {
        console.error("No pitch context available for pitch deck")
        return
      }
      
      setPitchContext(evaluation.evaluation.context)
      
      // In the future, this is where we would trigger the AI agent
      // to generate the pitch deck content based on the context
      
      // For now, we'll just use the context to populate some of our placeholders
      setPitchDeck(prev => ({
        ...prev,
        productName: evaluation.evaluation.context.productName || "Your Product",
        missionStatement: `We're solving ${evaluation.evaluation.context.problem} in the ${evaluation.evaluation.context.industry} industry.`,
        overview: evaluation.evaluation.context.summary || "An overview of your product and market will be displayed in this section.",
        problemStatement: evaluation.evaluation.context.problem || "A detailed description of the problem your product solves."
      }))
    } catch (err) {
      console.error("Error parsing stored data:", err)
    }
  }, [router])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Editable text component for small/medium text
  const EditableText = ({ fieldKey, text, className = "" }: { fieldKey: string, text: string, className?: string }) => {
    const isEditing = editableFields[fieldKey]?.isEditing || false
    
    return (
      <div className="group relative">
        {isEditing ? (
          <div className="flex items-start gap-2">
            <Input 
              value={getFieldContent(fieldKey, text)}
              onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              className={`w-full ${className}`}
              autoFocus
            />
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => saveField(fieldKey)}
              className="flex-shrink-0 h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <span className={className}>{text}</span>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => startEditing(fieldKey, text)}
              className="opacity-0 group-hover:opacity-100 absolute -right-8 top-0 h-6 w-6"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    )
  }
  
  // Editable area component for larger text blocks
  const EditableArea = ({ fieldKey, text, className = "" }: { fieldKey: string, text: string, className?: string }) => {
    const isEditing = editableFields[fieldKey]?.isEditing || false
    
    return (
      <div className="group relative">
        {isEditing ? (
          <div className="flex items-start gap-2">
            <Textarea 
              value={getFieldContent(fieldKey, text)}
              onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              className={`w-full ${className}`}
              rows={4}
              autoFocus
            />
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => saveField(fieldKey)}
              className="flex-shrink-0 h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className={className}>{text}</div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => startEditing(fieldKey, text)}
              className="opacity-0 group-hover:opacity-100 absolute -right-8 top-0 h-6 w-6"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    )
  }

  if (!pitchContext) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold">Loading Pitch Deck...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">Your Pitch Deck</h1>
          
          <div className="space-x-2 flex items-center">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => fetchSlideContent('all')}
              disabled={isLoadingContent}
              className="flex items-center gap-2"
            >
              {isLoadingContent ? (
                <>
                  <div className="h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Refreshing content...</span>
                </>
              ) : (
                <>
                  <span>Refresh All Content</span>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/market-research')}
            >
              Back to Market Research
            </Button>
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-sm text-gray-500">
            Slide {currentSlide + 1} of {slides.length}
          </div>
          
          <Button
            variant="ghost"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Overview Slide */}
        {currentSlide === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 rounded-xl overflow-hidden">
            <div className="p-12 bg-pink-50 flex flex-col justify-center">
              <div className="text-sm uppercase font-semibold text-orange-600 mb-2">OVERVIEW / ONE-PAGER</div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                <EditableText 
                  fieldKey="overviewTitle" 
                  text="A succinct summary of your business — a dense slide that is skipped when presenting." 
                />
              </h2>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-pink-100 overflow-hidden">
                      {/* Replace with actual images later */}
                      <div className="h-full w-full bg-pink-200 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        <EditableText fieldKey={`teamName${index}`} text={member.name} />
                      </div>
                      <div className="text-xs text-slate-500">
                        <EditableText fieldKey={`teamRole${index}`} text={member.role} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-12 bg-white">
              <div className="text-sm uppercase font-semibold text-orange-600 mb-6">HIGHLIGHTS</div>
              <p className="text-slate-700 mb-8">
                <EditableText 
                  fieldKey="highlightsIntro" 
                  text="If someone only read these bullet points, they should still be able to walk away with some understanding of your company and product."
                />
              </p>
              
              <div className="mb-8">
                <div className="text-sm uppercase font-semibold text-orange-600 mb-2">INDUSTRY & MARKET</div>
                <p className="text-slate-700">
                  <EditableText 
                    fieldKey="industryMarketText" 
                    text="Overview of who your (potential) customers are." 
                  />
                </p>
              </div>
              
              <div className="mb-8">
                <div className="text-sm uppercase font-semibold text-orange-600 mb-2">REVENUE PROJECTIONS</div>
                <div className="h-48 bg-slate-100 rounded-lg p-4 flex items-end justify-between">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-12 bg-pink-300 rounded-t-sm"></div>
                    <div className="text-xs mt-2">Q1 2017</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-12 bg-pink-400 rounded-t-sm"></div>
                    <div className="text-xs mt-2">Q2</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-12 bg-pink-500 rounded-t-sm"></div>
                    <div className="text-xs mt-2">Q3</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-12 bg-orange-400 rounded-t-sm"></div>
                    <div className="text-xs mt-2">Q4</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-40 w-12 bg-orange-500 rounded-t-sm"></div>
                    <div className="text-xs mt-2">Q1 2018</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Problem Slide */}
        {currentSlide === 1 && (
          <div className="bg-pink-50 rounded-xl overflow-hidden">
            <div className="p-12 flex flex-col justify-center">
              <div className="text-sm uppercase font-semibold text-orange-600 mb-2">THE PROBLEM</div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                <EditableText 
                  fieldKey="problemTitle" 
                  text={apiLoadedContent.problem?.title || "Why is your target customer frustrated with current solutions?"} 
                />
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-orange-700">
                    <EditableText 
                      fieldKey="problemPointsTitle" 
                      text="Customer Pain Points" 
                      className="text-orange-700"
                    />
                  </h3>
                  <div className="text-slate-700">
                    <EditableArea 
                      fieldKey="problemStatement" 
                      text={apiLoadedContent.problem?.painPoints || pitchDeck.problemStatement} 
                    />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold text-lg mb-4 text-orange-700">
                    <EditableText 
                      fieldKey="currentSolutionsTitle" 
                      text="Current Solutions Fall Short" 
                      className="text-orange-700"
                    />
                  </h3>
                  <div className="text-slate-700">
                    <EditableArea 
                      fieldKey="currentSolutionsText" 
                      text={apiLoadedContent.problem?.currentSolutions || "Describe how existing solutions are inadequate and why customers are dissatisfied with the current alternatives in the market."} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-orange-700">
                  <EditableText 
                    fieldKey="marketGapTitle" 
                    text="The Gap in the Market" 
                    className="text-orange-700"
                  />
                </h3>
                <div className="text-slate-700">
                  <EditableArea 
                    fieldKey="marketGapText" 
                    text={apiLoadedContent.problem?.marketGap || "Explain the specific gap your solution addresses and why it represents a significant opportunity in the market. Quantify the problem if possible with relevant metrics and data points."} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Why Now Slide */}
        {currentSlide === 2 && (
          <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl p-12 text-white flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-5xl font-bold text-center mb-8">
              <EditableText 
                fieldKey="whyNowDetailTitle" 
                text="What makes this the right moment for you and your company?" 
                className="text-white"
              />
            </h2>
            <div className="text-xl text-center max-w-2xl text-orange-50">
              <EditableArea 
                fieldKey="whyNowDetailText" 
                text="This is your opportunity to showcase why now is the perfect time for your product to enter the market. Highlight changing consumer behaviors, technological shifts, or industry trends that make your solution timely." 
                className="text-orange-50"
              />
            </div>
          </div>
        )}
        
        {/* Solution Slide */}
        {currentSlide === 3 && (
          <div className="bg-pink-50 rounded-xl p-12">
            <div className="text-sm uppercase font-semibold text-orange-600 mb-2">SOLUTION</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">
              <EditableText 
                fieldKey="solutionTitle" 
                text="This sets up your product features and should answer the problem." 
              />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="h-40 bg-gradient-to-r from-pink-100 to-orange-100"></div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-orange-700">
                      <EditableText 
                        fieldKey={`featureTitle${index}`}
                        text={feature.title}
                        className="text-orange-700"
                      />
                    </h3>
                    <p className="text-slate-600 text-sm">
                      <EditableArea 
                        fieldKey={`featureDesc${index}`}
                        text={feature.description}
                        className="text-slate-600 text-sm"
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Market Opportunity Slide */}
        {currentSlide === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-pink-50 rounded-xl overflow-hidden">
            <div className="p-12 bg-white">
              <div className="text-sm uppercase font-semibold text-orange-600 mb-6">MARKET OPPORTUNITY</div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-1 text-orange-700">
                    <EditableText 
                      fieldKey="tamTitle"
                      text="Total Addressable Market (TAM)"
                      className="text-orange-700"
                    />
                  </h3>
                  <p className="text-sm text-slate-600">
                    <EditableText 
                      fieldKey="tamDescription"
                      text="What is the total global opportunity for this product? The sky's the limit."
                    />
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-1 text-orange-700">
                    <EditableText 
                      fieldKey="samTitle"
                      text="Serviceable Addressable Market (SAM)"
                      className="text-orange-700"
                    />
                  </h3>
                  <p className="text-sm text-slate-600">
                    <EditableText 
                      fieldKey="samDescription"
                      text="What is the TAM that you can actually serve?"
                    />
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-1 text-orange-700">
                    <EditableText 
                      fieldKey="targetTitle"
                      text="Target Market"
                      className="text-orange-700"
                    />
                  </h3>
                  <p className="text-sm text-slate-600">
                    <EditableText 
                      fieldKey="targetDescription"
                      text="Describe who you'll market to, and the people who will buy what you're selling."
                    />
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-1 text-orange-700">
                    <EditableText 
                      fieldKey="shareTitle"
                      text="Market Share"
                      className="text-orange-700"
                    />
                  </h3>
                  <p className="text-sm text-slate-600">
                    <EditableText 
                      fieldKey="shareDescription"
                      text="Estimate your market share with a percentage or in dollars."
                    />
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-12 bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center">
              <div className="w-full h-64">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-center mb-8">
                    <h3 className="font-bold text-lg text-orange-700">
                      <EditableText 
                        fieldKey="marketChartTitle"
                        text="Market Size Breakdown"
                        className="text-orange-700"
                      />
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-24 text-sm font-medium text-slate-600">TAM</div>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-300 rounded-full" style={{width: '100%'}}></div>
                      </div>
                      <div className="w-16 text-right font-bold text-orange-700">
                        <EditableText 
                          fieldKey="marketSize"
                          text={pitchDeck.marketSize}
                          className="text-orange-700"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm font-medium text-slate-600">SAM</div>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-400 rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <div className="w-16 text-right font-bold text-orange-700">
                        <EditableText 
                          fieldKey="samValue"
                          text={pitchDeck.targetMarket}
                          className="text-orange-700"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm font-medium text-slate-600">Target</div>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{width: '40%'}}></div>
                      </div>
                      <div className="w-16 text-right font-bold text-orange-700">
                        <EditableText 
                          fieldKey="targetValue"
                          text={pitchDeck.targetMarket}
                          className="text-orange-700"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-sm font-medium text-slate-600">Share</div>
                      <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <div className="w-16 text-right font-bold text-orange-700">
                        <EditableText 
                          fieldKey="shareValue"
                          text={pitchDeck.marketShare}
                          className="text-orange-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 