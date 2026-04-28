"use client";

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function MessageClassifier() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleClassify = async () => {
    if (!message) return;
    setLoading(true);
    try {
      const res = await fetch('/api/classifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Few-Shot Message Classifier</h2>
      <p className="text-slate-600 mb-6">
        Classify incoming distress signals by extracting the district, determining intent, and assigning a priority.
      </p>

      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none"
          placeholder='e.g., "SOS: 5 people trapped on a roof in Ja-Ela (Gampaha). Water rising fast. Need boat immediately."'
        />
        
        <button
          onClick={handleClassify}
          disabled={loading || !message}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Classify Message
        </button>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Classification Result</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">District</p>
              <p className="font-semibold text-lg">{result.district}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Intent</p>
              <p className="font-semibold text-lg">{result.intent}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Priority</p>
              <p className={`font-semibold text-lg ${result.priority === 'High' ? 'text-red-500' : 'text-amber-500'}`}>
                {result.priority}
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white text-slate-600 text-sm rounded border border-slate-100 font-mono">
            {result.output}
          </div>
        </div>
      )}
    </div>
  );
}
