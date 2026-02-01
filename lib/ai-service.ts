/**
 * AI Service - Groq API Integration
 * Handles resume analysis with Groq LLM
 */

import Groq from "groq-sdk";
import { systemPrompt, buildUserPrompt, validateResponse } from "./prompt-engineering";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY environment variable is required");
}

const client = new Groq({ apiKey });

export interface AnalysisResult {
  ats_score: number;
  strengths: string[];
  missing_keywords: string[];
  improvement_suggestions: string[];
  optimized_bullets: Array<{
    original: string;
    optimized: string;
    reason: string;
  }>;
  final_summary: string;
}

export async function analyzeResume(
  resume: string,
  jobDescription: string
): Promise<AnalysisResult> {
  // Input validation
  if (!resume.trim() || resume.trim().length < 50) {
    throw new Error("Resume must be at least 50 characters");
  }
  if (!jobDescription.trim() || jobDescription.trim().length < 50) {
    throw new Error("Job description must be at least 50 characters");
  }

  try {
    const userPrompt = buildUserPrompt(resume, jobDescription);

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const responseText = response.choices[0]?.message?.content || "";

    if (!responseText) {
      throw new Error("Empty response from Groq API");
    }

    const validation = validateResponse(responseText);

    if (!validation.isValid) {
      throw new Error(validation.error || "Response validation failed");
    }

    return validation.data as unknown as AnalysisResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
    throw new Error("AI Analysis failed with unknown error");
  }
}
