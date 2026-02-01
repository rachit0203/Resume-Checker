/**
 * AnalysisResults Component
 * Displays comprehensive analysis including strengths, gaps, and suggestions
 */

interface AnalysisResultsProps {
  strengths: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export function AnalysisResults({
  strengths,
  missingKeywords,
  suggestions,
}: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Strengths */}
      <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          Resume Strengths
        </h3>
        <ul className="space-y-2">
          {strengths.map((strength, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Keywords */}
      <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-red-500 mr-2">⚠</span>
          Missing Keywords & Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword, idx) => (
            <span
              key={idx}
              className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          These keywords appear in the job description but not in your resume. Consider adding them where relevant.
        </p>
      </div>

      {/* Improvement Suggestions */}
      <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-blue-500 mr-2">💡</span>
          Improvement Suggestions
        </h3>
        <ol className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start">
              <span className="font-bold text-blue-500 mr-3">{idx + 1}</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
