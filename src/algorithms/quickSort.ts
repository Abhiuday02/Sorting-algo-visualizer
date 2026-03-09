import type { AnimationStep } from './bubbleSort';

export function quickSort(array: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  quickSortHelper(arr, 0, arr.length - 1, steps);
  return steps;
}

function quickSortHelper(
  arr: number[],
  low: number,
  high: number,
  steps: AnimationStep[]
) {
  if (low < high) {
    const pi = partition(arr, low, high, steps);
    steps.push({ type: 'sorted', indices: [pi] });
    quickSortHelper(arr, low, pi - 1, steps);
    quickSortHelper(arr, pi + 1, high, steps);
  } else if (low === high) {
    steps.push({ type: 'sorted', indices: [low] });
  }
}

function partition(
  arr: number[],
  low: number,
  high: number,
  steps: AnimationStep[]
): number {
  const pivot = arr[high];
  steps.push({ type: 'pivot', indices: [high] });
  let i = low - 1;

  for (let j = low; j < high; j++) {
    steps.push({ type: 'compare', indices: [j, high] });
    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        steps.push({ type: 'swap', indices: [i, j] });
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  if (i + 1 !== high) {
    steps.push({ type: 'swap', indices: [i + 1, high] });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  }
  return i + 1;
}
