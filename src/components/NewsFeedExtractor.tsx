"use client";

import { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';

export default function NewsFeedExtractor() {
  const [feed, setFeed] = useState(
`BREAKING: Water levels in Kelani River (Colombo) have reached 9.5 meters. Critical flood warning issued.
SOS: 5 people trapped on a roof in Ja-Ela (Gampaha). Water rising fast. Need boat immediately.
Update: Kandy road cleared near Peradeniya. Traffic moving slowly. No victims reported.
URGENT: Landslide in Kalutara. 12 people missing. Rescue team needed.
Gampaha town center is fully underwater. Flood level est 2.0 meters. 500 people displaced to temple. Need dry rations.`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExtract = async () => {
    if (!feed) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsfeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feed })
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">News Feed Extractor</h2>
      <p className="text-slate-600 mb-6">
        Convert a raw text feed of mixed items into structured JSON data utilizing strict schemas.
      </p>

      <div className="space-y-4">
        <textarea
          value={feed}
          onChange={(e) => setFeed(e.target.value)}
          className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none font-mono text-sm"
        />
        
        <button
          onClick={handleExtract}
          disabled={loading || !feed}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
          Extract Data
        </button>
      </div>

      {result && result.results && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">District</th>
                <th className="p-4 font-semibold text-slate-600">Flood Level (m)</th>
                <th className="p-4 font-semibold text-slate-600">Victims</th>
                <th className="p-4 font-semibold text-slate-600">Main Need</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.results.map((item: any, idx: number) => (
                item.success ? (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-800 font-medium">{item.extracted.district}</td>
                    <td className="p-4 text-slate-600">{item.extracted.flood_level_meters ?? 'None'}</td>
                    <td className="p-4 text-slate-600">{item.extracted.victim_count}</td>
                    <td className="p-4 text-slate-600">{item.extracted.main_need}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        item.extracted.status === 'Critical' ? 'bg-red-100 text-red-600' :
                        item.extracted.status === 'Warning' ? 'bg-amber-100 text-amber-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {item.extracted.status}
                      </span>
                    </td>
                  </tr>
                ) : (
                  <tr key={idx} className="bg-red-50/50">
                    <td colSpan={5} className="p-4 text-red-500">Failed to extract: {item.error}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
