export interface AnimationStep {
  type: 'compare' | 'swap' | 'sorted' | 'pivot' | 'overwrite';
  indices: number[];
  values?: number[];
}

export function bubbleSort(array: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: 'compare', indices: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        steps.push({ type: 'swap', indices: [j, j + 1] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    steps.push({ type: 'sorted', indices: [n - 1 - i] });
  }
  steps.push({ type: 'sorted', indices: [0] });
  return steps;
}
