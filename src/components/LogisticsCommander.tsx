"use client";

import { useState } from 'react';
import { Route, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LogisticsCommander() {
  const [incidents, setIncidents] = useState(
`ID | Time    | Area    | People | Ages   | Main Need | Message
1  | 08:00 AM| Gampaha | 4      | 20-40  | Water     | "Thirsty but safe on roof. Water level stable." 
2  | 08:15 AM| Ja-Ela  | 1      | 75     | Insulin   | "Diabetic, missed dose yesterday. Feeling faint."
3  | 08:20 AM| Ragama  | 2      | 10, 35 | Rescue    | "Water approaching neck level. Child is crying."`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async () => {
    if (!incidents) return;
    setLoading(true);
    try {
      const res = await fetch('/api/logistics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents_text: incidents })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Logistics Commander (CoT & ToT)</h2>
      <p className="text-slate-600 mb-6">
        Evaluate critical incidents, assign priority scores based on reasoning, and calculate the optimal rescue route.
      </p>

      <div className="space-y-4">
        <textarea
          value={incidents}
          onChange={(e) => setIncidents(e.target.value)}
          className="w-full h-40 p-4 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none"
        />
        
        <button
          onClick={handleCalculate}
          disabled={loading || !incidents}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Route className="w-5 h-5" />}
          Calculate Optimal Route
        </button>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Step 1: Priority Scores (CoT)</h3>
            <div className="prose prose-sm prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.priority_scores_analysis}</ReactMarkdown>
            </div>
          </div>
          
          <div className="p-6 bg-brand-light border border-brand/20 rounded-xl">
            <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider mb-4">Step 2: Optimal Route (ToT)</h3>
            <div className="prose prose-sm max-w-none text-slate-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.optimal_route_analysis}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
