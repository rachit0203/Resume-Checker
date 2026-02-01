/**
 * Supabase Client Configuration
 * Initialize Supabase for database operations
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Type definitions for Supabase tables
 */
export interface ResumeAnalysis {
  id: string;
  user_id: string | null;
  resume_text: string;
  job_description: string;
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
  created_at: string;
  updated_at: string;
}

/**
 * Save analysis results to Supabase
 */
export async function saveAnalysis(
  analysis: Omit<ResumeAnalysis, "id" | "created_at" | "updated_at">,
  userId?: string
) {
  try {
    const { data, error } = await supabase
      .from("resume_analyses")
      .insert([
        {
          user_id: userId || null,
          resume_text: analysis.resume_text,
          job_description: analysis.job_description,
          ats_score: analysis.ats_score,
          strengths: analysis.strengths,
          missing_keywords: analysis.missing_keywords,
          improvement_suggestions: analysis.improvement_suggestions,
          optimized_bullets: analysis.optimized_bullets,
          final_summary: analysis.final_summary,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save analysis: ${error.message}`);
    }

    return data as ResumeAnalysis;
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
}

/**
 * Fetch analysis history (past analyses) for a specific user
 */
export async function getAnalysisHistory(
  userId: string,
  limit: number = 10
) {
  try {
    // Always filter by user_id for data isolation
    const { data, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch history: ${error.message}`);
    }

    return (data || []) as ResumeAnalysis[];
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    throw error;
  }
}

/**
 * Get single analysis by ID
 */
export async function getAnalysisById(analysisId: string) {
  try {
    const { data, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch analysis: ${error.message}`);
    }

    return data as ResumeAnalysis;
  } catch (error) {
    console.error("Error fetching analysis:", error);
    throw error;
  }
}

/**
 * Delete analysis
 */
export async function deleteAnalysis(analysisId: string) {
  try {
    const { error } = await supabase
      .from("resume_analyses")
      .delete()
      .eq("id", analysisId);

    if (error) {
      throw new Error(`Failed to delete analysis: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting analysis:", error);
    throw error;
  }
}
