/**
 * AI Prompt Engineering for ATS Resume Analysis
 * Crafted to avoid hallucinations and ensure factual integrity
 */

export const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyst and hiring manager. Your task is to objectively evaluate a resume against a job description.

CRITICAL RULES:
1. Use ONLY information explicitly stated in the resume - NO assumptions or inventions
2. Identify actual gaps between resume and job description
3. Preserve factual accuracy - never suggest adding fake experiences
4. Optimize wording, not content; improve phrasing of existing achievements
5. Act like an ATS system would - look for keyword matches, skill alignment, experience relevance
6. Be honest about strengths and weaknesses

OUTPUT MUST be valid JSON with NO additional text, NO markdown code blocks.`;

export const buildUserPrompt = (resume: string, jobDescription: string): string => {
  return `Analyze this resume against the job description. Return ONLY valid JSON (no markdown).

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return this exact JSON structure (valid JSON only, no code blocks):
{
  "ats_score": <number 0-100>,
  "strengths": [<list of 3-5 actual strengths found in resume that match JD>],
  "missing_keywords": [<list of 5-8 important keywords/skills from JD not in resume>],
  "improvement_suggestions": [<list of 3-4 actionable suggestions to improve resume alignment>],
  "optimized_bullets": [
    {
      "original": "<exact bullet from resume>",
      "optimized": "<reworded to be ATS-friendly and align with JD>",
      "reason": "<why this helps ATS matching>"
    }
  ],
  "final_summary": "<2-3 sentence honest assessment of fit>"
}

Guidelines:
- ATS Score: 0-30 (poor match), 31-60 (moderate), 61-85 (strong), 86-100 (excellent)
- missing_keywords: Must be in JD but not clearly in resume
- optimized_bullets: Reword existing bullets to better match JD keywords; don't invent experience
- Preserve all factual claims; only improve phrasing and keyword density
- Be direct and honest about gaps`;
};

export const validateResponse = (response: string): {
  isValid: boolean;
  data?: Record<string, unknown>;
  error?: string;
} => {
  try {
    // Remove any markdown code block formatting
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    
    const data = JSON.parse(cleaned.trim());
    
    // Validate required fields
    const required = ["ats_score", "strengths", "missing_keywords", "improvement_suggestions", "optimized_bullets", "final_summary"];
    for (const field of required) {
      if (!(field in data)) {
        return { isValid: false, error: `Missing required field: ${field}` };
      }
    }
    
    // Validate types
    if (typeof data.ats_score !== "number" || data.ats_score < 0 || data.ats_score > 100) {
      return { isValid: false, error: "ats_score must be a number between 0-100" };
    }
    
    if (!Array.isArray(data.strengths) || !Array.isArray(data.missing_keywords) || 
        !Array.isArray(data.improvement_suggestions) || !Array.isArray(data.optimized_bullets)) {
      return { isValid: false, error: "Arrays are malformed" };
    }
    
    return { isValid: true, data };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid JSON response: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
