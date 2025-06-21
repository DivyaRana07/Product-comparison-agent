import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { query, agents } = await req.json()

    const agentData = agents.map((agent: any) => ({
      name: agent.name,
      description: agent.description,
      category: agent.category,
      pricing: agent.pricing,
      capabilities: agent.capabilities,
      useCase: agent.useCase,
      rating: agent.rating,
      features: agent.features,
    }))

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are an AI expert specializing in AI agent platforms and tools. You provide detailed, accurate, and helpful analysis of AI agents based on their capabilities, use cases, pricing, and features. 

Your responses should be:
- Comprehensive and well-structured
- Include specific recommendations
- Compare and contrast different options
- Consider practical implementation aspects
- Mention potential limitations or considerations
- Use clear, professional language

Format your response with clear sections and bullet points where appropriate.`,
      prompt: `Based on the following AI agents data, please analyze and answer this question: "${query}"

AI Agents Data:
${JSON.stringify(agentData, null, 2)}

Please provide a detailed analysis that helps the user make an informed decision.`,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Analysis API error:", error)
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 })
  }
}
