/**
 * API Route: /api/analyses
 * GET endpoint for fetching past analyses
 */

import { NextRequest, NextResponse } from "next/server";
import { getAnalysisHistory } from "@/lib/supabase";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Only fetch analyses for the authenticated user
    const analyses = await getAnalysisHistory(user.id, limit);

    return NextResponse.json(analyses, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
