"use client";

import { useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function BudgetKeeper() {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!context) return;
    setLoading(true);
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context })
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Budget Keeper (Token Economics)</h2>
      <p className="text-slate-600 mb-6">
        Prevent token exhaustion and spam forwarding by summarizing long texts and outright blocking chain spam.
      </p>

      <div className="space-y-4">
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none"
          placeholder="Paste a long context message or chain-spam here..."
        />
        
        <button
          onClick={handleAnalyze}
          disabled={loading || !context}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
          Analyze Content
        </button>
      </div>

      {result && (
        <div className={`mt-8 p-6 border rounded-xl ${result.status === 'BLOCKED/TRUNCATED' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Analysis Result</h3>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              result.status === 'BLOCKED/TRUNCATED' ? 'bg-red-100 text-red-600' : 
              result.status === 'Summarized' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
            }`}>
              {result.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded shadow-sm border border-slate-100 text-center">
              <p className="text-xs text-slate-500 mb-1">Original Tokens</p>
              <p className="font-semibold text-lg">{result.original_token_count}</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm border border-slate-100 text-center">
              <p className="text-xs text-slate-500 mb-1">Final Tokens</p>
              <p className="font-semibold text-lg">{result.summarized_token_count || result.original_token_count}</p>
            </div>
          </div>

          {result.summarized && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Summarized Content:</p>
              <p className="text-slate-800 text-sm whitespace-pre-wrap bg-white p-4 rounded border border-slate-100">
                {result.summarized}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
