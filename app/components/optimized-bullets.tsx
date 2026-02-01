/**
 * OptimizedBullets Component
 * Shows before/after resume bullet optimization
 */

interface OptimizedBullet {
  original: string;
  optimized: string;
  reason: string;
}

interface OptimizedBulletsProps {
  bullets: OptimizedBullet[];
}

export function OptimizedBullets({ bullets }: OptimizedBulletsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="text-purple-500 mr-2">✨</span>
        Resume Bullet Optimization
      </h3>

      <div className="space-y-6">
        {bullets.map((bullet, idx) => (
          <div
            key={idx}
            className="border-l-4 border-purple-300 pl-4 py-3 bg-purple-50 rounded-r"
          >
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Original
              </p>
              <p className="text-sm text-gray-700 line-through opacity-60">
                {bullet.original}
              </p>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Optimized
              </p>
              <p className="text-sm font-semibold text-gray-900 bg-white p-2 rounded border border-purple-200">
                {bullet.optimized}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-purple-600 mb-1">
                Why this helps:
              </p>
              <p className="text-xs text-purple-700">{bullet.reason}</p>
            </div>
          </div>
        ))}
      </div>

      {bullets.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No bullet points to optimize yet.
        </p>
      )}
    </div>
  );
}
