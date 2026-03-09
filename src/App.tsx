import { useState, useEffect, useRef, useCallback } from 'react';
import { Controls } from './components/Controls';
import type { AlgorithmKey, ArrayMode } from './components/Controls';
import { Bar } from './components/Bar';
import { AlgorithmInfo } from './components/AlgorithmInfo';
import { StatsPanel } from './components/StatsPanel';
import { Legend } from './components/Legend';
import { CodePanel } from './components/CodePanel';
import { bubbleSort } from './algorithms/bubbleSort';
import { mergeSort } from './algorithms/mergeSort';
import { quickSort } from './algorithms/quickSort';
import { selectionSort } from './algorithms/selectionSort';
import { insertionSort } from './algorithms/insertionSort';
import { heapSort } from './algorithms/heapSort';
import type { AnimationStep } from './algorithms/bubbleSort';
import { Moon, Sun, Github, Code2 } from 'lucide-react';

type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'overwriting';

const MAX_VALUE = 400;

function generateArrayByMode(size: number, mode: ArrayMode): number[] {
  switch (mode) {
    case 'random':
      return Array.from({ length: size }, () => Math.floor(Math.random() * (MAX_VALUE - 20)) + 20);
    case 'nearly-sorted': {
      const arr = Array.from({ length: size }, (_, i) =>
        Math.floor((i / Math.max(size - 1, 1)) * (MAX_VALUE - 20)) + 20
      );
      const swapCount = Math.max(2, Math.floor(size * 0.08));
      for (let i = 0; i < swapCount; i++) {
        const a = Math.floor(Math.random() * size);
        const b = Math.floor(Math.random() * size);
        [arr[a], arr[b]] = [arr[b], arr[a]];
      }
      return arr;
    }
    case 'reversed':
      return Array.from({ length: size }, (_, i) =>
        Math.floor(((size - 1 - i) / Math.max(size - 1, 1)) * (MAX_VALUE - 20)) + 20
      );
    case 'few-unique': {
      const values = [60, 110, 160, 220, 300, 380];
      return Array.from({ length: size }, () => values[Math.floor(Math.random() * values.length)]);
    }
  }
}

function getSpeedDelay(speed: number): number {
  // speed 1 = 500ms, speed 10 = 5ms
  return Math.round(500 / (speed * speed * 0.5 + speed * 0.5));
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>('bubble');
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(5);
  const [arrayMode, setArrayMode] = useState<ArrayMode>('random');
  const [array, setArray] = useState<number[]>(() => generateArrayByMode(50, 'random'));
  const [barStates, setBarStates] = useState<BarState[]>(() => new Array(50).fill('default'));
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [isWaitingForStep, setIsWaitingForStep] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Animation control refs
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSortingRef = useRef(false);

  // Step execution state refs (avoid stale closures inside animation loop)
  const stepsRef = useRef<AnimationStep[]>([]);
  const stepIndexRef = useRef(0);
  const currentArrayRef = useRef<number[]>([]);
  const sortedIndicesRef = useRef(new Set<number>());
  const localComparisonsRef = useRef(0);
  const localSwapsRef = useRef(0);

  // Live setting refs — read inside animation without capturing stale state
  const isStepModeRef = useRef(false);
  const speedRef = useRef(5);
  const soundEnabledRef = useRef(false);
  const algorithmRef = useRef<AlgorithmKey>('bubble');
  const isSortedRef = useRef(false);
  const isWaitingForStepRef = useRef(false);
  const executeNextStepRef = useRef<() => void>(() => {});

  // Audio
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sync state → refs
  useEffect(() => { isStepModeRef.current = isStepMode; }, [isStepMode]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);
  useEffect(() => { algorithmRef.current = algorithm; }, [algorithm]);
  useEffect(() => { isSortedRef.current = isSorted; }, [isSorted]);
  useEffect(() => { isWaitingForStepRef.current = isWaitingForStep; }, [isWaitingForStep]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const playTone = (value: number, type: 'compare' | 'swap' | 'overwrite') => {
    if (!soundEnabledRef.current) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      const freq = 150 + (value / MAX_VALUE) * 900;
      osc.frequency.value = freq;
      osc.type = type === 'swap' ? 'sawtooth' : 'sine';
      gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // AudioContext unavailable or blocked — silently ignore
    }
  };

  const generateNewArray = useCallback(() => {
    if (isSortingRef.current) return;
    const newArr = generateArrayByMode(arraySize, arrayMode);
    setArray(newArr);
    setBarStates(new Array(arraySize).fill('default'));
    setIsSorted(false);
    setComparisons(0);
    setSwaps(0);
    setStepCount(0);
    setElapsed(0);
  }, [arraySize, arrayMode]);

  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  const handleReset = useCallback(() => {
    if (animationRef.current) clearTimeout(animationRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    isSortingRef.current = false;
    setIsSorting(false);
    setIsWaitingForStep(false);
    generateNewArray();
  }, [generateNewArray]);

  // Core step executor — all mutable state via refs, no stale closure risk
  const executeNextStep = useCallback(() => {
    if (!isSortingRef.current) return;

    const steps = stepsRef.current;
    const stepIndex = stepIndexRef.current;
    const currentArray = currentArrayRef.current;
    const sortedIndices = sortedIndicesRef.current;

    if (stepIndex >= steps.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      const finalElapsed = Date.now() - startTimeRef.current;
      setElapsed(finalElapsed);
      setBarStates(new Array(currentArray.length).fill('sorted'));
      setIsSorting(false);
      setIsSorted(true);
      setIsWaitingForStep(false);
      isSortingRef.current = false;

      fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm: algorithmRef.current,
          array_size: currentArray.length,
          comparisons: localComparisonsRef.current,
          swaps: localSwapsRef.current,
          duration_ms: finalElapsed,
          completed: true,
        }),
      }).catch(console.error);
      return;
    }

    const step = steps[stepIndex];
    const newStates: BarState[] = new Array(currentArray.length).fill('default');
    sortedIndices.forEach((i) => (newStates[i] = 'sorted'));

    let toneValue: number | null = null;
    let toneType: 'compare' | 'swap' | 'overwrite' = 'compare';

    if (step.type === 'compare') {
      localComparisonsRef.current++;
      setComparisons(localComparisonsRef.current);
      step.indices.forEach((i) => (newStates[i] = 'comparing'));
      toneValue = currentArray[step.indices[0]];
      toneType = 'compare';
    } else if (step.type === 'swap') {
      localSwapsRef.current++;
      setSwaps(localSwapsRef.current);
      const [a, b] = step.indices;
      [currentArray[a], currentArray[b]] = [currentArray[b], currentArray[a]];
      setArray([...currentArray]);
      newStates[a] = 'swapping';
      newStates[b] = 'swapping';
      toneValue = currentArray[a];
      toneType = 'swap';
    } else if (step.type === 'sorted') {
      step.indices.forEach((i) => { sortedIndices.add(i); newStates[i] = 'sorted'; });
    } else if (step.type === 'pivot') {
      step.indices.forEach((i) => (newStates[i] = 'pivot'));
    } else if (step.type === 'overwrite') {
      localSwapsRef.current++;
      setSwaps(localSwapsRef.current);
      if (step.values) {
        step.indices.forEach((idx, i) => { currentArray[idx] = step.values![i]; });
        setArray([...currentArray]);
      }
      step.indices.forEach((i) => (newStates[i] = 'overwriting'));
      toneValue = step.values ? step.values[0] : currentArray[step.indices[0]];
      toneType = 'overwrite';
    }

    setBarStates([...newStates]);
    setStepCount((s) => s + 1);
    stepIndexRef.current = stepIndex + 1;

    if (toneValue !== null) playTone(toneValue, toneType);

    if (isStepModeRef.current) {
      setElapsed(Date.now() - startTimeRef.current);
      isWaitingForStepRef.current = true;
      setIsWaitingForStep(true);
    } else {
      animationRef.current = setTimeout(
        () => executeNextStepRef.current(),
        getSpeedDelay(speedRef.current)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — everything read via refs

  useEffect(() => {
    executeNextStepRef.current = executeNextStep;
  }, [executeNextStep]);

  const handleStart = useCallback(() => {
    if (isSortingRef.current || isSortedRef.current) return;

    let steps: AnimationStep[];
    if (algorithm === 'bubble') steps = bubbleSort(array);
    else if (algorithm === 'merge') steps = mergeSort(array);
    else if (algorithm === 'quick') steps = quickSort(array);
    else if (algorithm === 'insertion') steps = insertionSort(array);
    else if (algorithm === 'heap') steps = heapSort(array);
    else steps = selectionSort(array);

    stepsRef.current = steps;
    stepIndexRef.current = 0;
    currentArrayRef.current = [...array];
    sortedIndicesRef.current = new Set<number>();
    localComparisonsRef.current = 0;
    localSwapsRef.current = 0;

    isSortingRef.current = true;
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    setStepCount(0);
    setElapsed(0);
    startTimeRef.current = Date.now();

    if (isStepModeRef.current) {
      isWaitingForStepRef.current = true;
      setIsWaitingForStep(true);
    } else {
      timerRef.current = setInterval(() => setElapsed(Date.now() - startTimeRef.current), 100);
      executeNextStep();
    }
  }, [algorithm, array, executeNextStep]);

  const handleNextStep = useCallback(() => {
    if (!isSortingRef.current || !isStepModeRef.current || !isWaitingForStepRef.current) return;
    isWaitingForStepRef.current = false;
    setIsWaitingForStep(false);
    executeNextStep();
  }, [executeNextStep]);

  const handleToggleStepMode = useCallback(() => {
    if (isSortingRef.current) return;
    setIsStepMode((prev) => !prev);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // Keyboard shortcuts: Space = Start / Next Step, R = Reset
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element;
      if (target.closest('input, select, textarea')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isSortingRef.current && isStepModeRef.current) {
          handleNextStep();
        } else if (!isSortingRef.current && !isSortedRef.current) {
          handleStart();
        }
      } else if (e.code === 'KeyR') {
        handleReset();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNextStep, handleStart, handleReset]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <Code2 size={28} className="logo-icon" />
              <div>
                <h1 className="site-title">Sorting Visualizer</h1>
                <p className="site-subtitle">Watch algorithms come to life</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="View on GitHub"
              aria-label="View on GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Controls */}
        <Controls
          algorithm={algorithm}
          onAlgorithmChange={(a) => { setAlgorithm(a); handleReset(); }}
          arraySize={arraySize}
          onArraySizeChange={setArraySize}
          speed={speed}
          onSpeedChange={setSpeed}
          arrayMode={arrayMode}
          onArrayModeChange={setArrayMode}
          isStepMode={isStepMode}
          onToggleStepMode={handleToggleStepMode}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onGenerate={generateNewArray}
          onStart={handleStart}
          onReset={handleReset}
          onNextStep={handleNextStep}
          isSorting={isSorting}
          isSorted={isSorted}
          isWaitingForStep={isWaitingForStep}
        />

        {/* Visualization + Sidebar */}
        <div className="content-area">
          {/* Visualization */}
          <div className="viz-section">
            <Legend />
            <div className="viz-container">
              {array.map((value, index) => (
                <Bar
                  key={index}
                  value={value}
                  maxValue={MAX_VALUE}
                  state={barStates[index] || 'default'}
                  index={index}
                  total={array.length}
                />
              ))}
            </div>
            {isSorted && (
              <div className="sorted-banner">
                ✓ Array sorted! {comparisons} comparisons · {swaps} operations · {(elapsed / 1000).toFixed(2)}s
              </div>
            )}
            {isStepMode && isSorting && (
              <div className="step-mode-banner">
                Step {stepCount} of {stepsRef.current.length} — press <kbd>Space</kbd> or click Next Step
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            <AlgorithmInfo algorithm={algorithm} />
            <StatsPanel
              comparisons={comparisons}
              swaps={swaps}
              steps={stepCount}
              elapsed={elapsed}
              isSorting={isSorting}
            />
          </aside>
        </div>

        {/* Code & Intuition Panel */}
        <CodePanel algorithm={algorithm} />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-algos">
            <span className="footer-algo-tag">Bubble Sort O(n²)</span>
            <span className="footer-algo-tag">Merge Sort O(n log n)</span>
            <span className="footer-algo-tag">Quick Sort O(n log n)</span>
            <span className="footer-algo-tag">Selection Sort O(n²)</span>
            <span className="footer-algo-tag">Insertion Sort O(n²)</span>
            <span className="footer-algo-tag">Heap Sort O(n log n)</span>
          </div>
          <p className="footer-credit">
            Built with React + TypeScript · Sorting Algorithm Visualizer
          </p>
        </div>
      </footer>
    </div>
  );
}
