import { type NextRequest, NextResponse } from "next/server"
import { sessionManager } from "@/lib/session-manager"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    if (!sessionManager.has(sessionId)) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const session = sessionManager.get(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Session data is corrupted" }, { status: 500 })
    }

    const response = {
      sessionId,
      status: session.status,
      progress: session.progress || 0,
      logs: session.logs || [],
      completed: session.status === "completed" || session.status === "failed",
      currentStep: session.logs && session.logs.length > 0 ? session.logs[session.logs.length - 1] : "Processing...",
      result:
        session.status === "completed" && session.results
          ? {
              id: sessionId,
              product1: session.product1,
              product2: session.product2,
              scrapingResults: session.results.scrapingResults,
              comparison: session.results.comparison,
              readme: session.results.readme,
              timestamp: session.endTime || new Date(),
            }
          : null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Status API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get session status",
      },
      { status: 500 },
    )
  }
}
