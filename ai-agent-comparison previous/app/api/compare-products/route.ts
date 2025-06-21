import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { products } = await req.json()

    if (!products || products.length < 2) {
      return NextResponse.json({ error: "At least 2 products are required for comparison" }, { status: 400 })
    }

    const productData = products.map((product: any) => ({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      specifications: product.specifications,
    }))

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are an expert product comparison analyst. You provide comprehensive, unbiased, and detailed product comparisons.

Your analysis should include:
1. Executive Summary - Brief overview of the comparison
2. Detailed Feature Comparison - Side-by-side analysis of key features
3. Pros and Cons - For each product
4. Price-to-Value Analysis - Value proposition assessment
5. Use Case Recommendations - Who should buy what and why
6. Final Recommendation - Clear winner or situational recommendations

Format your response as a structured JSON object with the following structure:
{
  "summary": "Brief executive summary",
  "detailed_comparison": {
    "features": "Detailed feature comparison",
    "performance": "Performance analysis",
    "design": "Design and build quality comparison"
  },
  "products_analysis": [
    {
      "name": "Product name",
      "pros": ["List of pros"],
      "cons": ["List of cons"],
      "best_for": "Who this product is best for",
      "value_score": "Score out of 10"
    }
  ],
  "price_analysis": "Price-to-value comparison",
  "recommendations": {
    "overall_winner": "Product name and reason",
    "best_value": "Best value product and reason",
    "best_premium": "Best premium option and reason",
    "situational": "Situational recommendations"
  },
  "conclusion": "Final thoughts and advice"
}

Be objective, thorough, and helpful. Consider real-world usage scenarios.`,
      prompt: `Please provide a comprehensive comparison analysis of these products:

${JSON.stringify(productData, null, 2)}

Analyze these products thoroughly and provide detailed insights that will help consumers make informed decisions.`,
    })

    // Parse the JSON response
    let parsedComparison
    try {
      parsedComparison = JSON.parse(text)
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      parsedComparison = {
        summary: text.substring(0, 500) + "...",
        detailed_comparison: { features: text },
        products_analysis: products.map((p: any) => ({
          name: p.name,
          pros: ["Analysis provided in detailed comparison"],
          cons: ["Analysis provided in detailed comparison"],
          best_for: "See detailed analysis",
          value_score: "N/A",
        })),
        price_analysis: "See detailed comparison section",
        recommendations: {
          overall_winner: "See detailed analysis",
          best_value: "See detailed analysis",
          best_premium: "See detailed analysis",
          situational: "See detailed analysis",
        },
        conclusion: "See full analysis above",
      }
    }

    return NextResponse.json(parsedComparison)
  } catch (error) {
    console.error("Product comparison API error:", error)
    return NextResponse.json({ error: "Failed to compare products" }, { status: 500 })
  }
}
