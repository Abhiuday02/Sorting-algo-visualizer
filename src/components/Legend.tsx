import React from 'react';

export const Legend: React.FC = () => {
  const items = [
    { color: 'var(--bar-default)', label: 'Default' },
    { color: 'var(--bar-comparing)', label: 'Comparing' },
    { color: 'var(--bar-swapping)', label: 'Swapping' },
    { color: 'var(--bar-sorted)', label: 'Sorted' },
    { color: 'var(--bar-pivot)', label: 'Pivot' },
    { color: 'var(--bar-overwriting)', label: 'Overwriting' },
  ];

  return (
    <div className="legend">
      {items.map((item) => (
        <div key={item.label} className="legend-item">
          <div className="legend-dot" style={{ background: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
