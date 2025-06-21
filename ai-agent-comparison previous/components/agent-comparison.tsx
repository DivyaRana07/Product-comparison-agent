"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Check, X, ExternalLink } from "lucide-react"

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

interface AgentComparisonProps {
  agents: AIAgent[]
}

export function AgentComparison({ agents }: AgentComparisonProps) {
  if (agents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            Select AI agents from the grid view to compare them here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const allCapabilities = Array.from(new Set(agents.flatMap((agent) => agent.capabilities))).sort()

  const featureKeys = [
    { key: "browserControl", label: "Browser Control" },
    { key: "codeGeneration", label: "Code Generation" },
    { key: "apiIntegration", label: "API Integration" },
    { key: "multiModal", label: "Multi-modal Support" },
  ] as const

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Feature</th>
                  {agents.map((agent) => (
                    <th key={agent.id} className="text-center p-4 font-medium min-w-[200px]">
                      <div className="space-y-2">
                        <div className="font-semibold">{agent.name}</div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{agent.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {agent.category}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4 font-medium">Pricing</td>
                  {agents.map((agent) => (
                    <td key={agent.id} className="text-center p-4">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {agent.pricing}
                      </Badge>
                    </td>
                  ))}
                </tr>

                <tr className="border-b">
                  <td className="p-4 font-medium">Primary Use Case</td>
                  {agents.map((agent) => (
                    <td key={agent.id} className="text-center p-4 text-sm">
                      {agent.useCase}
                    </td>
                  ))}
                </tr>

                {featureKeys.map(({ key, label }) => (
                  <tr key={key} className="border-b">
                    <td className="p-4 font-medium">{label}</td>
                    {agents.map((agent) => (
                      <td key={agent.id} className="text-center p-4">
                        {agent.features[key] ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4 font-medium">Key Capabilities</td>
                  {agents.map((agent) => (
                    <td key={agent.id} className="p-4">
                      <div className="space-y-1">
                        {agent.capabilities.map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs mr-1 mb-1">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-medium">Learn More</td>
                  {agents.map((agent) => (
                    <td key={agent.id} className="text-center p-4">
                      <Button variant="outline" size="sm" onClick={() => window.open(agent.website, "_blank")}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Capability Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Capability Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Capability</th>
                  {agents.map((agent) => (
                    <th key={agent.id} className="text-center p-3 font-medium">
                      {agent.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCapabilities.map((capability) => (
                  <tr key={capability} className="border-b">
                    <td className="p-3 font-medium">{capability}</td>
                    {agents.map((agent) => (
                      <td key={agent.id} className="text-center p-3">
                        {agent.capabilities.includes(capability) ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
