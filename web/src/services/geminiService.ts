import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";

const API_KEY = "AIzaSyAj4S7bn0EF6ZmdeOQ39SpMtihWLjSSAdI";

export async function analyzeVideo(frames: string[]): Promise<AnalysisResult> {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set GOOGLE_AI_API_KEY.");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
  You are an expert esports coach and gameplay analyst. Analyze the following video frames from a gaming session.
  
  Provide a detailed coaching report in the following JSON format:
  {
    "gameplayMetrics": {
      "reactionTimeScore": "A rating like 9/10 or 'Elite'",
      "strategicDepth": "A rating or description like 'High'",
      "executionAccuracy": "A rating like '95%'"
    },
    "title": "A catchy title for the analysis session like 'Aggressive Push Analysis'",
    "summary": "A comprehensive summary of the gameplay shown.",
    "tacticalInsights": ["Insight 1", "Insight 2", "Insight 3"],
    "proSuggestions": ["Tip 1", "Tip 2"],
    "performanceOptimization": "Advice on hardware, settings, or mental state.",
    "keyMoments": [
      { "timestamp": "0:05", "description": "Key event description" },
      { "timestamp": "0:12", "description": "Key event description" }
    ]
  }
  
  Ensure the response is valid JSON and strictly follows this schema. Do not include markdown code blocks.
  `;

  // Prepare standard image parts for Gemini
  // The frames passed in are expected to be base64 strings (without the data:image/jpeg;base64, prefix if coming from some sources, but typically we handle that).
  // Assuming frames are raw base64 strings as extracted by the frontend Code provided by user.

  const imageParts = frames.map((frameData) => ({
    inlineData: {
      data: frameData,
      mimeType: "image/jpeg",
    },
  }));

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Raw Response:", text);

    // Clean up markdown if present
    let jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Attempt to parse
    const analysis: AnalysisResult = JSON.parse(jsonStr);
    return analysis;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze video.");
  }
}
