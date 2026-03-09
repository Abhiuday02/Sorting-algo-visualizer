import React from 'react';
import type { AlgorithmKey } from './Controls';
import { Clock, TrendingUp, Info } from 'lucide-react';

interface AlgoInfo {
  name: string;
  description: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  color: string;
}

const algoData: Record<AlgorithmKey, AlgoInfo> = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    color: '#ef4444',
  },
  merge: {
    name: 'Merge Sort',
    description: 'Divides the array into halves, recursively sorts them, then merges the sorted halves. It is a divide-and-conquer algorithm that guarantees O(n log n) performance.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    color: '#8b5cf6',
  },
  quick: {
    name: 'Quick Sort',
    description: 'Selects a pivot element and partitions the array into two sub-arrays around the pivot. Elements less than pivot go left, greater go right. Recursively sorts sub-arrays.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    color: '#f59e0b',
  },
  selection: {
    name: 'Selection Sort',
    description: 'Divides the array into a sorted and unsorted region. Repeatedly finds the minimum element from the unsorted region and places it at the beginning of the sorted region.',
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    color: '#10b981',
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Builds a sorted array one element at a time by inserting each element into its correct position. Highly efficient for small or nearly-sorted arrays.',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    color: '#06b6d4',
  },
  heap: {
    name: 'Heap Sort',
    description: 'Converts the array into a max-heap, then repeatedly extracts the maximum to build the sorted result in-place. Guarantees O(n log n) in all cases.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    color: '#f97316',
  },
};

interface AlgorithmInfoProps {
  algorithm: AlgorithmKey;
}

export const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
  const info = algoData[algorithm];

  return (
    <div className="algo-info-card" style={{ borderColor: info.color + '44' }}>
      <div className="algo-info-header" style={{ borderLeftColor: info.color }}>
        <div className="algo-info-title-row">
          <Info size={16} style={{ color: info.color }} />
          <h3 className="algo-info-title">{info.name}</h3>
          <span className={`stable-badge ${info.stable ? 'stable' : 'unstable'}`}>
            {info.stable ? 'Stable' : 'Unstable'}
          </span>
        </div>
        <p className="algo-info-desc">{info.description}</p>
      </div>

      <div className="complexity-grid">
        <div className="complexity-item">
          <Clock size={12} />
          <span className="complexity-label">Best</span>
          <span className="complexity-value best">{info.best}</span>
        </div>
        <div className="complexity-item">
          <TrendingUp size={12} />
          <span className="complexity-label">Average</span>
          <span className="complexity-value avg">{info.average}</span>
        </div>
        <div className="complexity-item">
          <TrendingUp size={12} />
          <span className="complexity-label">Worst</span>
          <span className="complexity-value worst">{info.worst}</span>
        </div>
        <div className="complexity-item">
          <span className="complexity-label">Space</span>
          <span className="complexity-value space">{info.space}</span>
        </div>
      </div>
    </div>
  );
};
