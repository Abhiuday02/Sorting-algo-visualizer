import React, { useEffect, useState } from 'react';
import { BarChart2, Zap, ArrowLeftRight, Clock } from 'lucide-react';

interface GlobalStats {
  algorithm: string;
  total_runs: number;
  total_comparisons: number;
  total_swaps: number;
  avg_duration_ms: number;
}

interface StatsPanelProps {
  comparisons: number;
  swaps: number;
  steps: number;
  elapsed: number;
  isSorting: boolean;
}

const algoLabels: Record<string, string> = {
  bubble: 'Bubble',
  merge: 'Merge',
  quick: 'Quick',
  selection: 'Selection',
};

export const StatsPanel: React.FC<StatsPanelProps> = ({
  comparisons,
  swaps,
  steps,
  elapsed,
  isSorting,
}) => {
  const [globalStats, setGlobalStats] = useState<GlobalStats[]>([]);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setGlobalStats)
      .catch(console.error);
  }, [isSorting]);

  return (
    <div className="stats-panel">
      {/* Live Stats */}
      <div className="live-stats">
        <h4 className="stats-section-title">Live Stats</h4>
        <div className="live-stats-grid">
          <div className="stat-card">
            <BarChart2 size={18} className="stat-icon comparisons" />
            <div>
              <div className="stat-number">{comparisons.toLocaleString()}</div>
              <div className="stat-label">Comparisons</div>
            </div>
          </div>
          <div className="stat-card">
            <ArrowLeftRight size={18} className="stat-icon swaps" />
            <div>
              <div className="stat-number">{swaps.toLocaleString()}</div>
              <div className="stat-label">Swaps</div>
            </div>
          </div>
          <div className="stat-card">
            <Zap size={18} className="stat-icon steps" />
            <div>
              <div className="stat-number">{steps.toLocaleString()}</div>
              <div className="stat-label">Steps</div>
            </div>
          </div>
          <div className="stat-card">
            <Clock size={18} className="stat-icon time" />
            <div>
              <div className="stat-number">{(elapsed / 1000).toFixed(1)}s</div>
              <div className="stat-label">Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      {globalStats.length > 0 && (
        <div className="global-stats">
          <h4 className="stats-section-title">Global Leaderboard</h4>
          <div className="global-stats-table">
            <div className="global-stats-header">
              <span>Algorithm</span>
              <span>Runs</span>
              <span>Avg Time</span>
            </div>
            {globalStats.map((s) => (
              <div key={s.algorithm} className="global-stats-row">
                <span className="algo-name-cell">{algoLabels[s.algorithm] || s.algorithm}</span>
                <span>{s.total_runs.toLocaleString()}</span>
                <span>{(s.avg_duration_ms / 1000).toFixed(1)}s</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
