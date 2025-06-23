interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error"
  message: string
  source: string
  metadata?: Record<string, any>
}

export class MaximLogger {
  private logs: LogEntry[] = []
  private source: string

  constructor(source = "ProductComparisonAgent") {
    this.source = source
  }

  info(message: string, metadata?: Record<string, any>) {
    this.addLog("info", message, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.addLog("warn", message, metadata)
  }

  error(message: string, metadata?: Record<string, any>) {
    this.addLog("error", message, metadata)
  }

  private addLog(level: "info" | "warn" | "error", message: string, metadata?: Record<string, any>) {
    try {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message: String(message), // Ensure message is always a string
        source: this.source,
        metadata,
      }

      this.logs.push(logEntry)

      // Also log to console for development
      const consoleMessage = `[${logEntry.timestamp}] ${level.toUpperCase()} (${this.source}): ${message}`

      switch (level) {
        case "error":
          console.error(consoleMessage, metadata)
          break
        case "warn":
          console.warn(consoleMessage, metadata)
          break
        default:
          console.log(consoleMessage, metadata)
      }
    } catch (error) {
      console.error("Logger error:", error)
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  getLogsByLevel(level: "info" | "warn" | "error"): LogEntry[] {
    return this.logs.filter((log) => log.level === level)
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  getLogsSummary() {
    const summary = {
      total: this.logs.length,
      info: this.logs.filter((log) => log.level === "info").length,
      warn: this.logs.filter((log) => log.level === "warn").length,
      error: this.logs.filter((log) => log.level === "error").length,
      timeRange: {
        start: this.logs[0]?.timestamp || null,
        end: this.logs[this.logs.length - 1]?.timestamp || null,
      },
    }

    return summary
  }

  getRecentLogs(limit = 100): LogEntry[] {
    return this.logs.slice(-limit)
  }
}
