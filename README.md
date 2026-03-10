# Sorting Algorithm Visualizer

An interactive, real-time sorting algorithm visualizer built with React, TypeScript, and Tailwind CSS. Watch classic sorting algorithms come to life with smooth animations, live performance stats, and step-by-step execution mode.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## Features

- **6 Sorting Algorithms** — Bubble, Merge, Quick, Selection, Insertion, and Heap Sort
- **Real-time Animation** — Smooth bar-chart visualization with color-coded states (comparing, swapping, sorted, pivot)
- **Step-by-Step Mode** — Pause and manually advance through each operation to deeply understand the algorithm
- **Speed Control** — Adjust animation speed from slow (educational) to blazing fast
- **Array Input Modes** — Generate arrays as Random, Nearly Sorted, Reversed, or Few Unique values
- **Variable Array Size** — Resize the array on the fly to observe how algorithms scale
- **Live Stats** — Track comparisons, swaps, steps taken, and elapsed time in real time
- **Global Leaderboard** — Aggregated stats across all users powered by a Supabase backend
- **Algorithm Info Panel** — Time/space complexity reference and description for each algorithm
- **Code Panel** — View the algorithm's implementation alongside the visualization
- **Sound Effects** — Optional audio feedback tied to bar comparisons
- **Dark / Light Mode** — System-friendly theme toggle

---

## Algorithms at a Glance

| Algorithm      | Best       | Average    | Worst      | Space    | Stable |
|----------------|------------|------------|------------|----------|--------|
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)     | ✅     |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)     | ✅     |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n) | ❌     |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)     | ❌     |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)     | ✅     |
| Heap Sort      | O(n log n) | O(n log n) | O(n log n) | O(1)     | ❌     |

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Framework  | React 19 + TypeScript              |
| Build Tool | Vite 7                             |
| Styling    | Tailwind CSS 4                     |
| Icons      | Lucide React                       |
| Backend    | Supabase (PostgreSQL + REST API)   |
| Deployment | Vercel (Serverless Functions)      |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (for global stats — optional for local development)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abhiuday02/sorting-algo-visualizer.git
cd sorting-algo-visualizer

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Fill in your Supabase credentials (see below)

# 4. Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root with the following keys:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> The app runs fully without these — the stats panel will simply not fetch global data.

### Available Scripts

```bash
npm run dev       # Start local dev server
npm run build     # Type-check and build for production
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── algorithms/         # Pure sorting algorithm implementations
│   ├── bubbleSort.ts
│   ├── mergeSort.ts
│   ├── quickSort.ts
│   ├── selectionSort.ts
│   ├── insertionSort.ts
│   └── heapSort.ts
├── components/
│   ├── AlgorithmInfo.tsx   # Complexity info panel
│   ├── Bar.tsx             # Individual bar element
│   ├── CodePanel.tsx       # Algorithm code viewer
│   ├── Controls.tsx        # All user controls
│   ├── Legend.tsx          # Color state legend
│   └── StatsPanel.tsx      # Live + global stats
└── App.tsx                 # Main application state & animation loop

api/
├── _supabase.js        # Supabase client
├── sessions.js         # POST/GET sorting session records
└── stats.js            # GET aggregated algorithm stats
```

---

## Deployment

The project is configured for zero-config deployment on **Vercel**. The `api/` directory is automatically treated as Vercel Serverless Functions.

```bash
# Deploy with the Vercel CLI
vercel deploy
```

Remember to add your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as environment variables in the Vercel project settings.

---

## License

This project is licensed under the [MIT License](LICENSE).
