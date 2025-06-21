"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, Lightbulb, Target } from "lucide-react"

interface AIAgent {
  id: string
  name: string
  description: string
  category: string
  pricing: string
  capabilities: string[]
  useCase: string
  rating: number
  website: string
  features: {
    browserControl: boolean
    codeGeneration: boolean
    apiIntegration: boolean
    multiModal: boolean
  }
}

interface AIAnalysisProps {
  agents: AIAgent[]
  selectedAgents: string[]
}

export function AIAnalysis({ agents, selectedAgents }: AIAnalysisProps) {
  const [query, setQuery] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const selectedAgentData = agents.filter((agent) => selectedAgents.includes(agent.id))

  const handleAnalysis = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          agents: selectedAgentData.length > 0 ? selectedAgentData : agents,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get analysis")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysis("Sorry, there was an error generating the analysis. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQueries = [
    "Which AI agent is best for web automation tasks?",
    "Compare the pricing models of these AI agents",
    "What are the key differences between browser automation agents?",
    "Which agent would be best for a startup with limited budget?",
    "Analyze the pros and cons of open source vs commercial agents",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Ask about AI agents (
              {selectedAgentData.length > 0
                ? `analyzing ${selectedAgentData.length} selected`
                : `analyzing all ${agents.length}`}{" "}
              agents)
            </label>
            <Textarea
              placeholder="e.g., Which AI agent would be best for my e-commerce automation needs?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Quick suggestions:</span>
            {suggestedQueries.map((suggestion, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => setQuery(suggestion)} className="text-xs">
                {suggestion}
              </Button>
            ))}
          </div>

          <Button onClick={handleAnalysis} disabled={!query.trim() || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Get AI Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{analysis}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedAgentData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Selected Agents for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedAgentData.map((agent) => (
                <div key={agent.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{agent.name}</h4>
                    <Badge variant="secondary">{agent.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{agent.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((capability) => (
                      <Badge key={capability} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
