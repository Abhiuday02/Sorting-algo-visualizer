import type { AnimationStep } from './bubbleSort';

export function insertionSort(array: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({ type: 'sorted', indices: [0] });

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      steps.push({ type: 'compare', indices: [j - 1, j] });
      if (arr[j - 1] > arr[j]) {
        steps.push({ type: 'swap', indices: [j - 1, j] });
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        j--;
      } else {
        break;
      }
    }
    // Mark only the newly placed element — the Set accumulates previous ones
    steps.push({ type: 'sorted', indices: [j] });
  }

  return steps;
}
