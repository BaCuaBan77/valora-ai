import { OverallPerformanceIndex } from '../types';

interface PerformanceIndexGraphProps {
  performanceIndex: OverallPerformanceIndex;
}

export default function PerformanceIndexGraph({ performanceIndex }: PerformanceIndexGraphProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Overall Score Display */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Overall Performance Index</div>
            <div className="text-3xl font-bold text-primary-700">{performanceIndex.overallScore.toFixed(1)}</div>
            <div className="text-xs text-gray-600 mt-1">/ 100</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700 mb-1">Value Multiplier</div>
            <div className="text-2xl font-bold text-primary-700">{performanceIndex.valueMultiplier.toFixed(3)}x</div>
            <div className={`text-xs font-semibold mt-1 ${
              performanceIndex.overallScore >= 80 ? 'text-green-700' :
              performanceIndex.overallScore >= 65 ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {getScoreLabel(performanceIndex.overallScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Bars */}
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-700 mb-2">Performance Dimensions</div>
        {performanceIndex.metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-gray-700">{metric.name}</span>
              <span className="text-gray-600">
                {metric.score.toFixed(1)} / 100
                <span className="ml-2 text-gray-400">({(metric.weight * 100).toFixed(0)}% weight)</span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getScoreColor(metric.score)}`}
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart Visualization */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm font-semibold text-gray-700 mb-3">Performance Radar</div>
        <div className="relative w-full h-64 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background circles */}
            {[20, 40, 60, 80, 100].map((radius) => (
              <circle
                key={radius}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Axis lines */}
            {performanceIndex.metrics.map((_, index) => {
              const angle = (index * 2 * Math.PI) / performanceIndex.metrics.length - Math.PI / 2;
              const x = 100 + 100 * Math.cos(angle);
              const y = 100 + 100 * Math.sin(angle);
              return (
                <line
                  key={`axis-${index}`}
                  x1="100"
                  y1="100"
                  x2={x}
                  y2={y}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Performance polygon */}
            <polygon
              points={performanceIndex.metrics.map((metric, index) => {
                const angle = (index * 2 * Math.PI) / performanceIndex.metrics.length - Math.PI / 2;
                const radius = metric.score;
                const x = 100 + radius * Math.cos(angle);
                const y = 100 + radius * Math.sin(angle);
                return `${x},${y}`;
              }).join(' ')}
              fill="rgba(14, 165, 233, 0.2)"
              stroke="rgb(14, 165, 233)"
              strokeWidth="2"
            />
            
            {/* Labels */}
            {performanceIndex.metrics.map((metric, index) => {
              const angle = (index * 2 * Math.PI) / performanceIndex.metrics.length - Math.PI / 2;
              const radius = 110;
              const x = 100 + radius * Math.cos(angle);
              const y = 100 + radius * Math.sin(angle);
              return (
                <text
                  key={`label-${index}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-700 font-medium"
                  transform={`rotate(${(angle * 180) / Math.PI + 90}, ${x}, ${y})`}
                >
                  {metric.name.split(' ')[0]}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
