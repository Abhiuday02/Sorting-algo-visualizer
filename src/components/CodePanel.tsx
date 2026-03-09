import React, { useState } from 'react';
import { Copy, Check, Lightbulb } from 'lucide-react';
import type { AlgorithmKey } from './Controls';

type Tab = 'intuition' | 'cpp' | 'java' | 'python';

interface AlgoCode {
  intuition: string;
  cpp: string;
  java: string;
  python: string;
}

const codeData: Record<AlgorithmKey, AlgoCode> = {
  bubble: {
    intuition: `Imagine bubbles rising in water — heavier elements sink, lighter ones float up. In each pass, adjacent elements are compared and swapped if out of order. After each pass, the largest unsorted element "bubbles" to its correct position at the end.

• After i passes, the last i elements are in their final sorted positions.
• Best case O(n): use an early-exit flag — if no swap occurs in a full pass, the array is already sorted.
• Always O(n²) in average/worst case — inefficient for large datasets.
• Stable sort: equal elements preserve their original relative order.`,

    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // already sorted
    }
}`,

    java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,

    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break`,
  },

  merge: {
    intuition: `Divide and conquer: split the array in half recursively until you reach individual elements (trivially sorted), then merge pairs back together in sorted order.

• Splitting takes O(log n) levels of recursion.
• Each merge level processes all n elements → O(n) per level.
• Total: O(n log n) guaranteed in all cases — best, average, and worst.
• Requires O(n) extra space for the auxiliary array used during merging.
• Stable sort: equal elements maintain their original relative order.
• Preferred for linked lists and external sorting (disk-based).`,

    cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < (int)left.size() && j < (int)right.size())
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < (int)left.size())  arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,

    java: `void merge(int[] arr, int l, int m, int r) {
    int[] left  = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length)
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.length)  arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}

void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,

    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]; i += 1
        else:
            arr[k] = right[j]; j += 1
        k += 1
    while i < len(left):  arr[k] = left[i];  i += 1; k += 1
    while j < len(right): arr[k] = right[j]; j += 1; k += 1
    return arr`,
  },

  quick: {
    intuition: `Pick a pivot element and partition the array so all elements smaller than the pivot go left and all larger go right — the pivot is now in its final sorted position. Recursively sort the two sub-arrays.

• Partition step is O(n); with a balanced pivot it runs O(log n) times → O(n log n) average.
• Worst case O(n²): occurs when the pivot is always the min/max (e.g. sorted input with last-element pivot). Randomizing the pivot avoids this.
• In practice often faster than Merge Sort due to better cache locality and lower constant factors.
• Not stable: equal elements may change relative order during partitioning.
• Space: O(log n) average for the recursion call stack.`,

    cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot)
            swap(arr[++i], arr[j]);
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,

    java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            int t = arr[++i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = t;
    return i + 1;
}

void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,

    python: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
  },

  selection: {
    intuition: `In each pass, scan the entire unsorted region to find the minimum element, then place it at the start of the unsorted region by swapping.

• After i passes, the first i elements are in their final sorted positions.
• Always O(n²) regardless of input — no early exit possible since you must scan the full unsorted region to confirm the minimum.
• Makes the fewest writes: exactly n−1 swaps in total. Useful when write cost is high (e.g. flash memory).
• Not stable: the long-distance swap can move equal elements out of their original order.`,

    cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx])
                minIdx = j;
        if (minIdx != i)
            swap(arr[i], arr[minIdx]);
    }
}`,

    java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        if (minIdx != i) {
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}`,

    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
  },

  insertion: {
    intuition: `Like sorting a hand of playing cards: pick up each new card and slide it left into the correct position among your already-sorted cards.

• The left portion is always sorted; each new element is shifted left until its correct position is found.
• Best case O(n): nearly-sorted or already-sorted arrays need very few shifts.
• Excellent for small arrays (< 20 elements) — low overhead, simple inner loop.
• Online algorithm: can sort data as it arrives, one element at a time.
• Stable sort: equal elements preserve their original relative order.
• Forms the base case for Tim Sort (used in Python's sorted() and Java's Arrays.sort()).`,

    cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key)
            arr[j + 1] = arr[j--];
        arr[j + 1] = key;
    }
}`,

    java: `void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key)
            arr[j + 1] = arr[j--];
        arr[j + 1] = key;
    }
}`,

    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
  },

  heap: {
    intuition: `Uses a binary max-heap where the parent is always ≥ its children. First build the max-heap in O(n), then repeatedly extract the maximum (root) and place it at the end.

• Build max-heap: start from the last non-leaf and heapify downward — O(n) total (not O(n log n) — each level does less work).
• Each extraction swaps root with last element, reduces heap size by 1, then re-heapifies root — O(log n).
• n extractions × O(log n) = O(n log n) total, guaranteed in all cases.
• In-place: only O(1) extra space needed (better than Merge Sort's O(n)).
• Not stable: heapify can change relative order of equal elements.`,

    cpp: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i, l = 2*i + 1, r = 2*i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,

    java: `void heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i + 1, r = 2*i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;
        heapify(arr, n, largest);
    }
}

void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
        heapify(arr, i, 0);
    }
}`,

    python: `def heapify(arr, n, i):
    largest = i
    l, r = 2 * i + 1, 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)`,
  },
};

const tabs: { key: Tab; label: string }[] = [
  { key: 'intuition', label: 'Intuition' },
  { key: 'cpp',       label: 'C++'       },
  { key: 'java',      label: 'Java'      },
  { key: 'python',    label: 'Python'    },
];

interface CodePanelProps {
  algorithm: AlgorithmKey;
}

export const CodePanel: React.FC<CodePanelProps> = ({ algorithm }) => {
  const [activeTab, setActiveTab] = useState<Tab>('intuition');
  const [copied, setCopied] = useState(false);

  const content = codeData[algorithm][activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="code-panel">
      <div className="code-panel-header">
        <div className="code-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`code-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.key === 'intuition' && <Lightbulb size={13} />}
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab !== 'intuition' && (
          <button className="code-copy-btn" onClick={handleCopy} title="Copy code">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <div className="code-content">
        {activeTab === 'intuition' ? (
          <div className="intuition-content">{content}</div>
        ) : (
          <pre className="code-block"><code>{content}</code></pre>
        )}
      </div>
    </div>
  );
};
