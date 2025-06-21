"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Search,
  Globe,
  Code,
  Eye,
  FileText,
  Download,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ErrorBoundary } from "@/components/error-boundary"

interface ScrapingSession {
  id: string
  productName: string
  method: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  data?: any
  logs: string[]
  startTime: Date
  endTime?: Date
}

interface ComparisonResult {
  id: string
  product1: string
  product2: string
  scrapingResults: {
    product1: any
    product2: any
  }
  comparison: string
  readme: string
  timestamp: Date
}

const browserMethods = [
  {
    id: "scrapybara",
    name: "ScrapybaraBrowser",
    description: "Advanced browser automation with AI-powered element detection",
    icon: Globe,
  },
  {
    id: "playwright",
    name: "Playwright + Custom Functions",
    description: "Playwright with custom LLM-controlled functions",
    icon: Code,
  },
  {
    id: "puppeteer",
    name: "Puppeteer + AI Vision",
    description: "Puppeteer with AI vision for element identification",
    icon: Eye,
  },
]

export default function ProductComparisonAgent() {
  const [product1, setProduct1] = useState("")
  const [product2, setProduct2] = useState("")
  const [selectedMethods, setSelectedMethods] = useState<string[]>(["scrapybara", "playwright"])
  const [sessions, setSessions] = useState<ScrapingSession[]>([])
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState("")

  const startComparison = async () => {
    if (!product1.trim() || !product2.trim()) {
      alert("Please enter both product names")
      return
    }

    setIsRunning(true)
    setCurrentStep("Initializing browser sessions...")
    setSessions([])
    setComparisonResult(null)

    try {
      // Create scraping sessions for each product and method
      const newSessions: ScrapingSession[] = []

      for (const product of [product1, product2]) {
        for (const method of selectedMethods) {
          const session: ScrapingSession = {
            id: `${product}-${method}-${Date.now()}`,
            productName: product,
            method,
            status: "pending",
            progress: 0,
            logs: [],
            startTime: new Date(),
          }
          newSessions.push(session)
        }
      }

      setSessions(newSessions)

      // Start scraping process
      const response = await fetch("/api/scrape-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product1,
          product2,
          methods: selectedMethods,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to start scraping process")
      }

      // Start polling for updates
      let pollInterval: NodeJS.Timeout
      pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/scraping-status?sessionId=${newSessions[0].id}`)
          if (!statusResponse.ok) {
            throw new Error("Failed to fetch status")
          }
          const statusData = await statusResponse.json()

          if (statusData.completed) {
            clearInterval(pollInterval)
            setComparisonResult(statusData.result)
            setIsRunning(false)
            setCurrentStep("Comparison completed!")
          } else {
            // Update sessions with progress
            setSessions((prev) =>
              prev.map((session) => ({
                ...session,
                status: statusData.sessions?.[session.id]?.status || session.status,
                progress: statusData.sessions?.[session.id]?.progress || session.progress,
                logs: statusData.sessions?.[session.id]?.logs || session.logs,
              })),
            )
            setCurrentStep(statusData.currentStep || currentStep)
          }
        } catch (error) {
          console.error("Polling error:", error)
          clearInterval(pollInterval)
          setIsRunning(false)
          setCurrentStep("Error occurred during polling")
        }
      }, 2000)

      // Cleanup interval after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (isRunning) {
          setIsRunning(false)
          setCurrentStep("Process timed out")
        }
      }, 300000)
    } catch (error) {
      console.error("Comparison error:", error)
      setIsRunning(false)
      setCurrentStep("Error occurred during comparison")
    }
  }

  const downloadReadme = () => {
    if (!comparisonResult?.readme) return

    const blob = new Blob([comparisonResult.readme], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${product1}-vs-${product2}-comparison.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getMethodIcon = (methodId: string) => {
    const method = browserMethods.find((m) => m.id === methodId)
    const IconComponent = method?.icon || Globe
    return <IconComponent className="h-4 w-4" />
  }

  useEffect(() => {
    return () => {
      // Cleanup any active intervals when component unmounts
      if (typeof window !== "undefined") {
        const highestId = window.setTimeout(() => {}, 0)
        for (let i = 0; i < highestId; i++) {
          window.clearTimeout(i)
          window.clearInterval(i)
        }
      }
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">AI Product Comparison Agent</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Advanced product comparison using AI-controlled browser automation. Enter two products and let our AI
              agents scrape the web to provide comprehensive comparisons.
            </p>
          </div>

          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-6">
              {/* Product Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Product Comparison Setup
                  </CardTitle>
                  <CardDescription>
                    Enter two products to compare. Our AI agents will scrape data from multiple sources.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product1">Product 1</Label>
                      <Input
                        id="product1"
                        placeholder="e.g., iPhone 15 Pro"
                        value={product1}
                        onChange={(e) => setProduct1(e.target.value)}
                        disabled={isRunning}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product2">Product 2</Label>
                      <Input
                        id="product2"
                        placeholder="e.g., Samsung Galaxy S24 Ultra"
                        value={product2}
                        onChange={(e) => setProduct2(e.target.value)}
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Browser Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Browser Automation Methods</CardTitle>
                  <CardDescription>
                    Select which browser automation methods to use for scraping product data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {browserMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedMethods.includes(method.id)
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          if (isRunning) return
                          setSelectedMethods((prev) =>
                            prev.includes(method.id) ? prev.filter((id) => id !== method.id) : [...prev, method.id],
                          )
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <method.icon className="h-5 w-5" />
                          <h3 className="font-medium">{method.name}</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{method.description}</p>
                        {selectedMethods.includes(method.id) && <Badge className="mt-2">Selected</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Start Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={startComparison}
                    disabled={!product1.trim() || !product2.trim() || selectedMethods.length === 0 || isRunning}
                    className="w-full"
                    size="lg"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Running Comparison...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start AI Product Comparison
                      </>
                    )}
                  </Button>
                  {isRunning && (
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">{currentStep}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">
                      No active sessions. Start a comparison to see progress here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <Card key={session.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getMethodIcon(session.method)}
                            <div>
                              <CardTitle className="text-lg">{session.productName}</CardTitle>
                              <CardDescription>
                                {browserMethods.find((m) => m.id === session.method)?.name}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(session.status)}
                            <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                              {session.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{session.progress}%</span>
                            </div>
                            <Progress value={session.progress} className="h-2" />
                          </div>

                          {session.logs.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                              <div className="bg-slate-100 dark:bg-slate-800 rounded p-3 text-xs font-mono max-h-32 overflow-y-auto">
                                {session.logs.slice(-5).map((log, index) => (
                                  <div key={index} className="text-slate-600 dark:text-slate-400">
                                    {log}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {!comparisonResult ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Comparison results will appear here once the analysis is complete.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Comparison Results
                        </CardTitle>
                        <Button onClick={downloadReadme} variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download README
                        </Button>
                      </div>
                      <CardDescription>
                        AI-generated comparison between {comparisonResult.product1} and {comparisonResult.product2}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">{comparisonResult.product1}</h3>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Data sources: {selectedMethods.length} methods
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">{comparisonResult.product2}</h3>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Data sources: {selectedMethods.length} methods
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* README Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>README Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-mono">{comparisonResult.readme}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>
                    Detailed logs from all browser automation sessions and AI interactions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="text-xs font-mono space-y-1">
                      {sessions.flatMap((session) =>
                        session.logs.map((log, index) => (
                          <div key={`${session.id}-${index}`} className="text-slate-600 dark:text-slate-400">
                            <span className="text-blue-600 dark:text-blue-400">[{session.method}]</span>{" "}
                            <span className="text-green-600 dark:text-green-400">[{session.productName}]</span> {log}
                          </div>
                        )),
                      )}
                      {sessions.length === 0 && (
                        <div className="text-slate-500 dark:text-slate-500">
                          No logs available. Start a comparison to see detailed logs here.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  )
}
