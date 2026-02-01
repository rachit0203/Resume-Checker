/**
 * ATSScore Component
 * Displays score with visual progress bar and feedback
 */

interface ATSScoreProps {
  score: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 86) return "bg-green-500";
  if (score >= 61) return "bg-blue-500";
  if (score >= 31) return "bg-yellow-500";
  return "bg-red-500";
};

const getScoreLabel = (score: number): string => {
  if (score >= 86) return "Excellent Match";
  if (score >= 61) return "Strong Match";
  if (score >= 31) return "Moderate Match";
  return "Poor Match";
};

export function ATSScore({ score }: ATSScoreProps) {
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">ATS Match Score</h2>
        <span className="text-4xl font-bold text-secondary">{score}</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="text-xs text-gray-500 mt-2">
        {score >= 75
          ? "Your resume is well-aligned with this job. Consider final polish."
          : score >= 50
          ? "Good foundation. Implement suggestions below to improve fit."
          : "Significant gaps detected. Focus on missing keywords and skills."}
      </p>
    </div>
  );
}
