"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Trophy, DollarSign, Users, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: string
  description: string
  specifications: string
}

interface ProductComparisonProps {
  comparison: any
  products: Product[]
}

export function ProductComparison({ comparison, products }: ProductComparisonProps) {
  if (!comparison) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            Add products and run a comparison to see AI-powered analysis here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{comparison.summary}</p>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Feature Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comparison.detailed_comparison && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(comparison.detailed_comparison).map(([key, value]) => (
                <div key={key} className="border rounded-lg p-4">
                  <h4 className="font-medium capitalize mb-2">{key.replace("_", " ")}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{value as string}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Analysis */}
      {comparison.products_analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparison.products_analysis.map((productAnalysis: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{productAnalysis.name}</span>
                  {productAnalysis.value_score && (
                    <Badge variant="secondary">Score: {productAnalysis.value_score}/10</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pros */}
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {productAnalysis.pros?.map((pro: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {productAnalysis.cons?.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best For */}
                {productAnalysis.best_for && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Best For
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{productAnalysis.best_for}</p>
                  </div>
                )}

                {/* Value Score Progress */}
                {productAnalysis.value_score && !isNaN(Number.parseFloat(productAnalysis.value_score)) && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Value Score</span>
                      <span className="text-sm text-slate-600">{productAnalysis.value_score}/10</span>
                    </div>
                    <Progress value={Number.parseFloat(productAnalysis.value_score) * 10} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Price Analysis */}
      {comparison.price_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price-to-Value Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{comparison.price_analysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {comparison.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(comparison.recommendations).map(([key, value]) => (
                <div key={key} className="border rounded-lg p-4">
                  <h4 className="font-medium capitalize mb-2 text-blue-700 dark:text-blue-400">
                    {key.replace("_", " ")}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{value as string}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conclusion */}
      {comparison.conclusion && (
        <Card>
          <CardHeader>
            <CardTitle>Final Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{comparison.conclusion}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
