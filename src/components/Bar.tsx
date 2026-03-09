import React from 'react';

type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'overwriting';

interface BarProps {
  value: number;
  maxValue: number;
  state: BarState;
  index: number;
  total: number;
}

const stateColors: Record<BarState, string> = {
  default: 'bar-default',
  comparing: 'bar-comparing',
  swapping: 'bar-swapping',
  sorted: 'bar-sorted',
  pivot: 'bar-pivot',
  overwriting: 'bar-overwriting',
};

export const Bar: React.FC<BarProps> = ({ value, maxValue, state, total }) => {
  const heightPercent = (value / maxValue) * 100;
  const showLabel = total <= 30;

  return (
    <div className="bar-wrapper" style={{ flex: `0 0 calc(${100 / total}% - 2px)` }}>
      <div
        className={`bar ${stateColors[state]}`}
        style={{ height: `${heightPercent}%` }}
      >
        {showLabel && (
          <span className="bar-label">{value}</span>
        )}
      </div>
    </div>
  );
};
