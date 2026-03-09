import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('sorting_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { algorithm, array_size, comparisons, swaps, duration_ms, completed } = req.body;
      const { data, error } = await supabase
        .from('sorting_sessions')
        .insert({ algorithm, array_size, comparisons, swaps, duration_ms, completed })
        .select()
        .single();
      if (error) throw error;

      // Update algorithm_stats
      const { data: existing } = await supabase
        .from('algorithm_stats')
        .select('*')
        .eq('algorithm', algorithm)
        .single();

      if (existing) {
        const newRuns = existing.total_runs + 1;
        const newComparisons = Number(existing.total_comparisons) + comparisons;
        const newSwaps = Number(existing.total_swaps) + swaps;
        const newAvgDuration = ((Number(existing.avg_duration_ms) * existing.total_runs) + duration_ms) / newRuns;
        await supabase
          .from('algorithm_stats')
          .update({
            total_runs: newRuns,
            total_comparisons: newComparisons,
            total_swaps: newSwaps,
            avg_duration_ms: Math.round(newAvgDuration),
            updated_at: new Date().toISOString()
          })
          .eq('algorithm', algorithm);
      }

      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
