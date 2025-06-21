"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye, Trash2 } from "lucide-react"

interface ComparisonHistoryProps {
  history: any[]
}

export function ComparisonHistory({ history }: ComparisonHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            No comparison history yet. Start comparing products to see your history here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Comparison History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Your recent product comparisons are saved here for easy reference.
          </p>
        </CardContent>
      </Card>

      {history.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{formatDate(item.timestamp)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.products.map((product: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {product.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{item.summary}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
