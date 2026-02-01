"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnalysisForm } from "@/app/components/analysis-form";
import { ATSScore } from "@/app/components/ats-score";
import { AnalysisResults } from "@/app/components/analysis-results";
import { OptimizedBullets } from "@/app/components/optimized-bullets";
import { PastAnalyses } from "@/app/components/past-analyses";
import { AnalysisResult } from "@/lib/ai-service";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
        if (!data.user) {
          router.push("/auth/login");
        }
      })
      .catch(() => {
        setLoading(false);
        router.push("/auth/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-3">
                🎯 ATS Resume Optimizer
              </h1>
              <p className="text-lg text-gray-100">
                AI-powered resume analysis for better ATS compatibility and job fit
              </p>
              <p className="text-sm text-gray-300 mt-3">
                Get instant feedback on how your resume aligns with specific job descriptions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                📊 History
              </button>
              <div className="text-sm text-white/90">
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Left: Form */}
        <div className="mb-12">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Enter Your Details
            </h2>
            <AnalysisForm onAnalyze={setResult} />
          </div>
        </div>

        {/* Right: Results */}
        {result && (
          <div id="results" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Your Analysis Results
              </h2>
              <p className="text-gray-600 mt-2">
                Review your ATS match score and actionable improvements below
              </p>
            </div>

            {/* ATS Score Card */}
            <ATSScore score={result.ats_score} />

            {/* Summary */}
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Summary</h3>
              <p className="text-gray-700">{result.final_summary}</p>
            </div>

            {/* Analysis Results */}
            <AnalysisResults
              strengths={result.strengths}
              missingKeywords={result.missing_keywords}
              suggestions={result.improvement_suggestions}
            />

            {/* Optimized Bullets */}
            <OptimizedBullets bullets={result.optimized_bullets} />

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-lg transition-colors"
              >
                ← Analyze Another
              </button>
              <button
                onClick={() => {
                  const text = `
ATS Score: ${result.ats_score}/100

Strengths:
${result.strengths.map((s) => `- ${s}`).join("\n")}

Missing Keywords:
${result.missing_keywords.map((k) => `- ${k}`).join("\n")}

Suggestions:
${result.improvement_suggestions.map((s) => `- ${s}`).join("\n")}

Summary:
${result.final_summary}
                  `;
                  navigator.clipboard.writeText(text);
                  alert("Results copied to clipboard!");
                }}
                className="px-6 py-3 bg-secondary hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors"
              >
                📋 Copy Results
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {!result && (
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">ATS Scoring</h3>
              <p className="text-sm text-gray-600">
                Get scored 0-100 on keyword density, skill alignment, and format compatibility
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-900 mb-2">Gap Analysis</h3>
              <p className="text-sm text-gray-600">
                Identify missing skills and keywords from the job description
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Rewrites</h3>
              <p className="text-sm text-gray-600">
                Get AI-powered suggestions to optimize your resume bullets
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Past Analyses Modal */}
      {showHistory && (
        <PastAnalyses onClose={() => setShowHistory(false)} />
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">
            Made with Love for job seekers • Powered by Groq LLaMA-3.3-70B
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Your data is stored securely in your personal account
          </p>
        </div>
      </footer>
    </main>
  );
}
