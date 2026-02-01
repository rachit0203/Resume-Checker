/**
 * API Route: /api/analyze
 * POST endpoint for resume analysis with Supabase persistence
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeResume, AnalysisResult } from "@/lib/ai-service";
import { saveAnalysis } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get("auth-token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { resume, jobDescription } = await request.json();

    // Input validation
    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    // Call AI service for analysis
    const result: AnalysisResult = await analyzeResume(resume, jobDescription);

    // Save to Supabase database with authenticated user ID
    try {
      const savedAnalysis = await saveAnalysis(
        {
          user_id: user.id,
          resume_text: resume,
          job_description: jobDescription,
          ats_score: result.ats_score,
          strengths: result.strengths,
          missing_keywords: result.missing_keywords,
          improvement_suggestions: result.improvement_suggestions,
          optimized_bullets: result.optimized_bullets,
          final_summary: result.final_summary,
        },
        user.id
      );

      return NextResponse.json(
        {
          ...result,
          analysisId: savedAnalysis.id,
        },
        { status: 200 }
      );
    } catch (dbError) {
      // If DB save fails, still return the analysis result
      console.error("Database save failed:", dbError);
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.error("API Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
