"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PitchEvaluation {
  evaluation: {
    clarity: number;
    clarity_feedback: string;
    content: number;
    content_feedback: string;
    structure: number;
    structure_feedback: string;
    delivery: number;
    delivery_feedback: string;
    feedback: string;
    conversation_id?: string;
  };
  transcription: {
    title?: string;
    description?: string;
    text: string;
    timestamp?: string;
  };
  timestamp: string;
}

export default function PitchEvaluationPage() {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<PitchEvaluation | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const storedEvaluation = localStorage.getItem('pitchEvaluation')
    if (!storedEvaluation) {
      router.push('/upload')
      return
    }
    setEvaluation(JSON.parse(storedEvaluation))
  }, [router])

  if (!evaluation) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Loading evaluation...</h2>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full animate-pulse bg-primary" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    )
  }

  // Calculate overall score (average of all ratings)
  const overallScore = 
    (evaluation.evaluation.clarity + 
     evaluation.evaluation.content + 
     evaluation.evaluation.structure + 
     evaluation.evaluation.delivery) / 4;

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "from-emerald-500 to-emerald-400";
    if (score >= 3.5) return "from-green-500 to-green-400";
    if (score >= 2.5) return "from-yellow-500 to-yellow-400";
    if (score >= 1.5) return "from-orange-500 to-orange-400";
    return "from-red-500 to-red-400";
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'clarity': return '🔍';
      case 'content': return '📝';
      case 'structure': return '🏗️';
      case 'delivery': return '🎤';
      default: return '📊';
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Pitch Evaluation</h1>
          <p className="text-muted-foreground">
            Analysis completed on {new Date(evaluation.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Overall Score */}
        <Card className="p-6 space-y-4 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-r from-[#FFB6A3] to-[#FF8A6D] opacity-10"></div>
          <h2 className="text-xl font-semibold">Overall Performance</h2>
          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32 rounded-full flex items-center justify-center bg-muted">
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#FFB6A3] to-[#FF8A6D] opacity-20"></div>
              <div className="text-4xl font-bold">{overallScore.toFixed(1)}</div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Clarity {getCategoryIcon('clarity')}</span>
                  <span className="font-medium">{evaluation.evaluation.clarity}/5</span>
                </div>
                <Progress value={evaluation.evaluation.clarity * 20} className={`h-2 bg-gray-100 bg-opacity-50`}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(evaluation.evaluation.clarity)}`} />
                </Progress>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Content {getCategoryIcon('content')}</span>
                  <span className="font-medium">{evaluation.evaluation.content}/5</span>
                </div>
                <Progress value={evaluation.evaluation.content * 20} className={`h-2 bg-gray-100 bg-opacity-50`}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(evaluation.evaluation.content)}`} />
                </Progress>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Structure {getCategoryIcon('structure')}</span>
                  <span className="font-medium">{evaluation.evaluation.structure}/5</span>
                </div>
                <Progress value={evaluation.evaluation.structure * 20} className={`h-2 bg-gray-100 bg-opacity-50`}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(evaluation.evaluation.structure)}`} />
                </Progress>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Delivery {getCategoryIcon('delivery')}</span>
                  <span className="font-medium">{evaluation.evaluation.delivery}/5</span>
                </div>
                <Progress value={evaluation.evaluation.delivery * 20} className={`h-2 bg-gray-100 bg-opacity-50`}>
                  <div className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(evaluation.evaluation.delivery)}`} />
                </Progress>
              </div>
            </div>
          </div>
        </Card>

        {/* Pitch Details */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Pitch Details</h2>
            <div className="space-y-1 text-muted-foreground">
              {evaluation.transcription.title && (
                <p><span className="font-medium">Title:</span> {evaluation.transcription.title}</p>
              )}
              {evaluation.transcription.description && (
                <p><span className="font-medium">Description:</span> {evaluation.transcription.description}</p>
              )}
              {evaluation.transcription.timestamp && (
                <p><span className="font-medium">Recorded on:</span> {new Date(evaluation.transcription.timestamp).toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* Tabbed Feedback Sections */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="clarity">Clarity</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="p-0">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-[#FFB6A3] to-[#FF8A6D] rounded-full flex items-center justify-center text-white font-bold">
                  💡
                </div>
                <h3 className="text-lg font-medium mb-2">Overall Feedback</h3>
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: evaluation.evaluation.feedback.replace(/\n/g, '<br/>') }} />
              </div>
            </TabsContent>
            
            <TabsContent value="clarity" className="p-0">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  🔍
                </div>
                <h3 className="text-lg font-medium mb-2">Clarity Feedback</h3>
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: evaluation.evaluation.clarity_feedback.replace(/\n/g, '<br/>') }} />
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="p-0">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold">
                  📝
                </div>
                <h3 className="text-lg font-medium mb-2">Content Feedback</h3>
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: evaluation.evaluation.content_feedback.replace(/\n/g, '<br/>') }} />
              </div>
            </TabsContent>
            
            <TabsContent value="structure" className="p-0">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  🏗️
                </div>
                <h3 className="text-lg font-medium mb-2">Structure Feedback</h3>
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: evaluation.evaluation.structure_feedback.replace(/\n/g, '<br/>') }} />
              </div>
            </TabsContent>
            
            <TabsContent value="delivery" className="p-0">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                  🎤
                </div>
                <h3 className="text-lg font-medium mb-2">Delivery Feedback</h3>
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: evaluation.evaluation.delivery_feedback.replace(/\n/g, '<br/>') }} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Transcription
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
    </div>
  )
} 