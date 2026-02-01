/**
 * AnalysisForm Component
 * Form for resume and job description input
 */

"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/ai-service";

interface AnalysisFormProps {
  onAnalyze: (result: AnalysisResult) => void;
  isLoading?: boolean;
}

export function AnalysisForm({ onAnalyze, isLoading = false }: AnalysisFormProps) {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please fill in both resume and job description");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const result: AnalysisResult = await response.json();
      onAnalyze(result);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resume Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Resume (paste text)
        </label>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume text here. Include job titles, companies, responsibilities, and achievements..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
          disabled={isSubmitting || isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum 50 characters required
        </p>
      </div>

      {/* Job Description Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here. Include required skills, responsibilities, and qualifications..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
          disabled={isSubmitting || isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum 50 characters required
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-secondary hover:bg-indigo-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        {isSubmitting || isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing Resume...
          </span>
        ) : (
          "🚀 Analyze Resume"
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        ⚡ Powered by Groq AI • Results are instant
      </p>
    </form>
  );
}
