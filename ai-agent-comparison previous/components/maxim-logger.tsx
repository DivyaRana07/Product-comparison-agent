"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Eye, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error" | "success"
  source: string
  message: string
  metadata?: any
}

interface MaximLoggerProps {
  sessionId?: string
  isActive: boolean
}

export function MaximLogger({ sessionId, isActive }: MaximLoggerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState({
    total: 0,
    info: 0,
    warning: 0,
    error: 0,
    success: 0,
  })

  useEffect(() => {
    if (!isActive || !sessionId) {
      setLogs([])
      setStats({ total: 0, info: 0, warning: 0, error: 0, success: 0 })
      return
    }

    let intervalId: NodeJS.Timeout

    const startLogging = () => {
      intervalId = setInterval(
        () => {
          try {
            const newLog: LogEntry = {
              id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date(),
              level: (["info", "warning", "error", "success"] as const)[Math.floor(Math.random() * 4)],
              source: ["ScrapybaraBrowser", "Playwright", "PuppeteerAI", "GPT-4o-mini"][Math.floor(Math.random() * 4)],
              message: [
                "Browser session initialized",
                "Element detection completed",
                "Data extraction in progress",
                "AI analysis running",
                "Page navigation successful",
                "Screenshot captured",
                "Text content parsed",
                "Product information extracted",
              ][Math.floor(Math.random() * 8)],
              metadata: {
                sessionId,
                duration: Math.floor(Math.random() * 5000) + 100,
                success: Math.random() > 0.2,
              },
            }

            setLogs((prev) => [newLog, ...prev.slice(0, 99)]) // Keep last 100 logs

            setStats((prev) => ({
              total: prev.total + 1,
              info: newLog.level === "info" ? prev.info + 1 : prev.info,
              warning: newLog.level === "warning" ? prev.warning + 1 : prev.warning,
              error: newLog.level === "error" ? prev.error + 1 : prev.error,
              success: newLog.level === "success" ? prev.success + 1 : prev.success,
            }))
          } catch (error) {
            console.error("Error in logging simulation:", error)
          }
        },
        2000 + Math.random() * 3000,
      ) // Random interval between 2-5 seconds
    }

    startLogging()

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isActive, sessionId])

  const getLogIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Maxim Observation & Logging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Info</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.error}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  {isActive ? "Waiting for activity..." : "Start a comparison to see live logs"}
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getLogIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getLogBadgeVariant(log.level)} className="text-xs">
                          {log.level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {log.source}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{log.message}</p>
                      {log.metadata && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Duration: {log.metadata.duration}ms | Success: {log.metadata.success ? "✓" : "✗"}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
