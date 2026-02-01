/**
 * PastAnalyses Component
 * Display history of past resume analyses
 */

"use client";

import { useState, useEffect } from "react";
import { ResumeAnalysis } from "@/lib/supabase";

interface PastAnalysesProps {
  userId?: string;
  onClose?: () => void;
}

export function PastAnalyses({ userId, onClose }: PastAnalysesProps) {
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, [userId]);

  const fetchAnalyses = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);

      const response = await fetch(`/api/analyses?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading analysis history...</p>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No past analyses yet. Run your first analysis above!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Analysis History</h2>

      <div className="space-y-3">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            onClick={() => setSelectedAnalysis(analysis)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {analysis.ats_score}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      ATS Score
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(analysis.created_at)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                  {analysis.job_description.substring(0, 100)}...
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        ))}
      </div>

      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Analysis Details</h3>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Score</p>
                <p className="text-3xl font-bold text-blue-600">
                  {selectedAnalysis.ats_score}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Summary</p>
                <p className="text-gray-700">{selectedAnalysis.final_summary}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Strengths</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedAnalysis.strengths.map((strength, idx) => (
                    <li key={idx}>• {strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAnalysis.missing_keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Date</p>
                <p className="text-sm text-gray-700">
                  {formatDate(selectedAnalysis.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
