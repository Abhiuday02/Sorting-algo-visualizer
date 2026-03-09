import React from 'react';
import { Play, RotateCcw, Shuffle, Settings2, Volume2, VolumeX, SkipForward, Gauge } from 'lucide-react';

export type AlgorithmKey = 'bubble' | 'merge' | 'quick' | 'selection' | 'insertion' | 'heap';
export type ArrayMode = 'random' | 'nearly-sorted' | 'reversed' | 'few-unique';

interface ControlsProps {
  algorithm: AlgorithmKey;
  onAlgorithmChange: (a: AlgorithmKey) => void;
  arraySize: number;
  onArraySizeChange: (n: number) => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  arrayMode: ArrayMode;
  onArrayModeChange: (m: ArrayMode) => void;
  isStepMode: boolean;
  onToggleStepMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onGenerate: () => void;
  onStart: () => void;
  onReset: () => void;
  onNextStep: () => void;
  isSorting: boolean;
  isSorted: boolean;
  isWaitingForStep: boolean;
}

const algorithms: { key: AlgorithmKey; label: string }[] = [
  { key: 'bubble', label: 'Bubble Sort' },
  { key: 'merge', label: 'Merge Sort' },
  { key: 'quick', label: 'Quick Sort' },
  { key: 'selection', label: 'Selection Sort' },
  { key: 'insertion', label: 'Insertion Sort' },
  { key: 'heap', label: 'Heap Sort' },
];

const arrayModes: { key: ArrayMode; label: string }[] = [
  { key: 'random', label: 'Random' },
  { key: 'nearly-sorted', label: 'Nearly Sorted' },
  { key: 'reversed', label: 'Reversed' },
  { key: 'few-unique', label: 'Few Unique' },
];

export const Controls: React.FC<ControlsProps> = ({
  algorithm,
  onAlgorithmChange,
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  arrayMode,
  onArrayModeChange,
  isStepMode,
  onToggleStepMode,
  soundEnabled,
  onToggleSound,
  onGenerate,
  onStart,
  onReset,
  onNextStep,
  isSorting,
  isSorted,
  isWaitingForStep,
}) => {
  return (
    <div className="controls-panel">
      <div className="controls-grid">
        {/* Algorithm Selector */}
        <div className="control-group">
          <label className="control-label">
            <Settings2 size={14} />
            Algorithm
          </label>
          <div className="algo-buttons">
            {algorithms.map((a) => (
              <button
                key={a.key}
                className={`algo-btn ${algorithm === a.key ? 'active' : ''}`}
                onClick={() => onAlgorithmChange(a.key)}
                disabled={isSorting}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Array Pattern Selector */}
        <div className="control-group">
          <label className="control-label">
            <Shuffle size={14} />
            Array Pattern
          </label>
          <div className="algo-buttons">
            {arrayModes.map((m) => (
              <button
                key={m.key}
                className={`algo-btn ${arrayMode === m.key ? 'active' : ''}`}
                onClick={() => onArrayModeChange(m.key)}
                disabled={isSorting}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="sliders-row">
          <div className="control-group">
            <label className="control-label">
              Array Size: <span className="slider-value">{arraySize}</span>
            </label>
            <input
              type="range"
              min={10}
              max={150}
              value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))}
              disabled={isSorting}
              className="slider"
            />
            <div className="slider-ticks">
              <span>10</span>
              <span>80</span>
              <span>150</span>
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">
              Speed: <span className="slider-value">{speed}x</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-ticks">
              <span>Slow</span>
              <span>Medium</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="action-btn generate-btn"
            onClick={onGenerate}
            disabled={isSorting}
          >
            <Shuffle size={16} />
            New Array
          </button>
          <button
            className="action-btn start-btn"
            onClick={onStart}
            disabled={isSorting || isSorted}
          >
            <Play size={16} />
            {isSorting
              ? (isStepMode ? 'Stepping...' : 'Sorting...')
              : (isStepMode ? 'Start Stepping' : 'Start Sorting')}
          </button>
          {isStepMode && isSorting && (
            <button
              className="action-btn step-btn"
              onClick={onNextStep}
              disabled={!isWaitingForStep}
              title="Advance one step (Space)"
            >
              <SkipForward size={16} />
              Next Step
            </button>
          )}
          <button
            className="action-btn reset-btn"
            onClick={onReset}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <div className="toggle-group">
            <button
              className={`toggle-btn ${isStepMode ? 'active' : ''}`}
              onClick={onToggleStepMode}
              disabled={isSorting}
              title="Step Mode — advance one step at a time (Space)"
            >
              <Gauge size={15} />
              Step Mode
            </button>
            <button
              className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
              onClick={onToggleSound}
              title="Toggle sound effects"
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              Sound
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
