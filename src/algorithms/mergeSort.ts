import type { AnimationStep } from './bubbleSort';

export function mergeSort(array: number[]): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...array];
  const aux = [...array];
  mergeSortHelper(arr, aux, 0, arr.length - 1, steps);
  return steps;
}

function mergeSortHelper(
  arr: number[],
  aux: number[],
  left: number,
  right: number,
  steps: AnimationStep[]
) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  mergeSortHelper(aux, arr, left, mid, steps);
  mergeSortHelper(aux, arr, mid + 1, right, steps);
  merge(arr, aux, left, mid, right, steps);
}

function merge(
  arr: number[],
  aux: number[],
  left: number,
  mid: number,
  right: number,
  steps: AnimationStep[]
) {
  let i = left;
  let j = mid + 1;
  let k = left;

  while (i <= mid && j <= right) {
    steps.push({ type: 'compare', indices: [i, j] });
    if (aux[i] <= aux[j]) {
      steps.push({ type: 'overwrite', indices: [k], values: [aux[i]] });
      arr[k++] = aux[i++];
    } else {
      steps.push({ type: 'overwrite', indices: [k], values: [aux[j]] });
      arr[k++] = aux[j++];
    }
  }
  while (i <= mid) {
    steps.push({ type: 'compare', indices: [i, i] });
    steps.push({ type: 'overwrite', indices: [k], values: [aux[i]] });
    arr[k++] = aux[i++];
  }
  while (j <= right) {
    steps.push({ type: 'compare', indices: [j, j] });
    steps.push({ type: 'overwrite', indices: [k], values: [aux[j]] });
    arr[k++] = aux[j++];
  }
}
