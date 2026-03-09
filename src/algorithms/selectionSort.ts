import type { AnimationStep } from './bubbleSort';

export function selectionSort(array: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ type: 'compare', indices: [minIdx, j] });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      steps.push({ type: 'swap', indices: [i, minIdx] });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    steps.push({ type: 'sorted', indices: [i] });
  }
  steps.push({ type: 'sorted', indices: [n - 1] });
  return steps;
}
