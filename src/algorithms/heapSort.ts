import type { AnimationStep } from './bubbleSort';

export function heapSort(array: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps);
  }

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push({ type: 'swap', indices: [0, i] });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({ type: 'sorted', indices: [i] });
    heapify(arr, i, 0, steps);
  }
  steps.push({ type: 'sorted', indices: [0] });

  return steps;
}

function heapify(arr: number[], n: number, i: number, steps: AnimationStep[]): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    steps.push({ type: 'compare', indices: [left, largest] });
    if (arr[left] > arr[largest]) largest = left;
  }

  if (right < n) {
    steps.push({ type: 'compare', indices: [right, largest] });
    if (arr[right] > arr[largest]) largest = right;
  }

  if (largest !== i) {
    steps.push({ type: 'swap', indices: [i, largest] });
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest, steps);
  }
}
