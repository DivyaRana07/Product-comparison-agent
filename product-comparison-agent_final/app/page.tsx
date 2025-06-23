"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, FileText, Play, RotateCcw, Globe, Code, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComparisonResult {
  product1: ProductData
  product2: ProductData
  comparison: string
  readme: string
  logs: LogEntry[]
}

interface ProductData {
  name: string
  price?: string
  rating?: string
  features?: string[]
  description?: string
  availability?: string
  images?: string[]
  specifications?: Record<string, string>
}

interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error"
  message: string
  source: string
}

interface BrowserMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  selected: boolean
}

export default function ProductComparisonAgent() {
  const [product1, setProduct1] = useState("")
  const [product2, setProduct2] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [activeTab, setActiveTab] = useState("setup")

  const [browserMethods, setBrowserMethods] = useState<BrowserMethod[]>([
    {
      id: "scrapybara",
      name: "ScrapybaraBrowser",
      description: "Advanced browser automation with AI-powered element detection",
      icon: <Globe className="h-5 w-5" />,
      selected: true,
    },
    {
      id: "playwright",
      name: "Playwright + Custom Functions",
      description: "Playwright with custom LLM-controlled functions",
      icon: <Code className="h-5 w-5" />,
      selected: true,
    },
    {
      id: "puppeteer",
      name: "Puppeteer + AI Vision",
      description: "Puppeteer with AI vision for element identification",
      icon: <Eye className="h-5 w-5" />,
      selected: true,
    },
  ])

  const toggleBrowserMethod = (id: string) => {
    setBrowserMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, selected: !method.selected } : method)),
    )
  }

  const validateInput = (value: string) => {
    return value.trim().length >= 2 && value.trim().length <= 100
  }

  const handleCompare = async () => {
    if (!product1.trim() || !product2.trim()) {
      alert("Please enter both product names")
      return
    }

    const selectedMethods = browserMethods.filter((method) => method.selected).map((method) => method.id)
    if (selectedMethods.length === 0) {
      alert("Please select at least one browser automation method")
      return
    }

    setIsLoading(true)
    setResult(null)
    setActiveTab("progress")

    try {
      const response = await fetch("/api/compare-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product1: product1.trim(),
          product2: product2.trim(),
          methods: selectedMethods,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.setup) {
          throw new Error(`${data.error}\n\nSetup Instructions:\n${data.setup}`)
        }
        throw new Error(data.error || "Failed to compare products")
      }

      setResult(data)
      setActiveTab("results")
    } catch (error) {
      console.error("Error comparing products:", error)

      let errorMessage = "Unknown error occurred"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      // Check if it's a JSON parsing error (indicates server returned HTML error page)
      if (errorMessage.includes("Unexpected token") || errorMessage.includes("not valid JSON")) {
        errorMessage = "Server error occurred. Please check your OpenAI API key and try again."
      }

      // Show more helpful error message
      if (errorMessage.includes("OpenAI API key")) {
        alert(`Configuration Error:\n\n${errorMessage}\n\nPlease check your .env file and restart the application.`)
      } else {
        alert(`Comparison Error:\n\n${errorMessage}`)
      }
      setActiveTab("setup")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setProduct1("")
    setProduct2("")
    setResult(null)
    setActiveTab("setup")
    setBrowserMethods((prev) => prev.map((method) => ({ ...method, selected: true })))
  }

  const downloadReadme = () => {
    if (!result?.readme) return

    const blob = new Blob([result.readme], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${product1}-vs-${product2}-comparison.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI Product Comparison Agent</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced product comparison using AI-controlled browser automation. Enter two products and let our
            intelligent agents analyze and compare them using multiple data sources.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white">
            <TabsTrigger value="setup" className="data-[state=active]:bg-gray-100">
              Setup
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-gray-100">
              Progress
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-gray-100">
              Results
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-gray-100">
              Logs
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-gray-100">
              Monitoring
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Product Comparison Setup
                </CardTitle>
                <CardDescription>
                  Enter two products to compare. Our AI agents will scrape data from multiple sources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product 1</label>
                    <Input
                      placeholder="e.g., iPhone 15 Pro"
                      value={product1}
                      onChange={(e) => setProduct1(e.target.value)}
                      disabled={isLoading}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product 2</label>
                    <Input
                      placeholder="e.g., Samsung Galaxy S24 Ultra"
                      value={product2}
                      onChange={(e) => setProduct2(e.target.value)}
                      disabled={isLoading}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Browser Automation Methods */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Browser Automation Methods</h3>
                    <p className="text-sm text-gray-600">
                      Select which browser automation methods to use for scraping product data.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {browserMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          method.selected ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => toggleBrowserMethod(method.id)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {method.icon}
                              <span className="font-medium text-gray-900">{method.name}</span>
                            </div>
                            {method.selected && <Badge className="bg-gray-900 text-white text-xs">Selected</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    onClick={handleCompare}
                    disabled={isLoading || !validateInput(product1) || !validateInput(product2)}
                    className="flex-1 h-12 bg-gray-600 hover:bg-gray-700 text-white mr-4"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start AI Product Comparison
                      </>
                    )}
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="h-12 px-6" disabled={isLoading}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="bg-white rounded-lg border min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-gray-600">Initializing browser automation agents...</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-gray-600">Scraping product data from multiple sources...</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-gray-600">Analyzing and comparing products with AI...</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No active sessions. Start a comparison to see progress here.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="bg-white rounded-lg border min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                {result ? (
                  <div className="w-full max-w-4xl mx-auto space-y-6">
                    <Card className="bg-white">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Comparison Results
                          </span>
                          <Button onClick={downloadReadme} variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Download README
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
                            {result.comparison}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProductCard product={result.product1} />
                      <ProductCard product={result.product2} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto" />
                    <p className="text-gray-500">Comparison results will appear here once the analysis is complete.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">System Logs</h2>
                  <p className="text-sm text-gray-600">
                    Detailed logs from all browser automation sessions and AI interactions.
                  </p>
                </div>

                {result && result.logs.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {result.logs.map((log, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${
                          log.level === "error"
                            ? "bg-red-50 text-red-800"
                            : log.level === "warn"
                              ? "bg-yellow-50 text-yellow-800"
                              : "bg-blue-50 text-blue-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {log.source}
                          </Badge>
                          <span className="text-xs opacity-70">{log.timestamp}</span>
                        </div>
                        <p className="mt-1">{log.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-sm">
                      No logs available. Start a comparison to see detailed logs here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="space-y-6">
                {/* Maxim Observation & Logging */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Maxim Observation & Logging</h2>
                  </div>

                  <div className="grid grid-cols-5 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{result ? result.logs.length : 0}</div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {result ? result.logs.filter((log) => log.level === "info").length : 0}
                      </div>
                      <div className="text-sm text-gray-600">Info</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {result ? result.logs.filter((log) => log.message.toLowerCase().includes("success")).length : 0}
                      </div>
                      <div className="text-sm text-gray-600">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">
                        {result ? result.logs.filter((log) => log.level === "warn").length : 0}
                      </div>
                      <div className="text-sm text-gray-600">Warnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {result ? result.logs.filter((log) => log.level === "error").length : 0}
                      </div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Live Activity Feed</h2>
                  </div>

                  {result && result.logs.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {result.logs
                        .slice(-10)
                        .reverse()
                        .map((log, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded text-sm">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                log.level === "error"
                                  ? "bg-red-500"
                                  : log.level === "warn"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}
                            ></div>
                            <span className="text-xs text-gray-500">{log.timestamp.split("T")[1]?.split(".")[0]}</span>
                            <span className="text-gray-700">{log.message}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Start a comparison to see live logs</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: ProductData }) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.price && (
          <div>
            <label className="text-sm font-medium text-gray-700">Price</label>
            <p className="text-lg font-semibold text-green-600">{product.price}</p>
          </div>
        )}

        {product.rating && (
          <div>
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <p>{product.rating}</p>
          </div>
        )}

        {product.description && (
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
        )}

        {product.features && product.features.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700">Key Features</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700">Specifications</label>
            <div className="grid grid-cols-1 gap-2 mt-2 text-sm">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.availability && (
          <div>
            <label className="text-sm font-medium text-gray-700">Availability</label>
            <p className="text-sm">{product.availability}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
