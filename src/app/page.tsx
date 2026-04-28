"use client";

import { useState } from 'react';
import MessageClassifier from '@/components/MessageClassifier';
import LogisticsCommander from '@/components/LogisticsCommander';
import BudgetKeeper from '@/components/BudgetKeeper';
import NewsFeedExtractor from '@/components/NewsFeedExtractor';
import { Shield, Map, Activity, FileText } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('classifier');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-brand-dark flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand" />
            Op Ditwah
          </h1>
          <p className="text-xs text-slate-500 mt-1">Crisis Intelligence Pipeline</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('classifier')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'classifier' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Shield className="w-5 h-5" /> Message Classifier
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logistics' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Map className="w-5 h-5" /> Logistics Commander
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'budget' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Activity className="w-5 h-5" /> Budget Keeper
          </button>
          <button
            onClick={() => setActiveTab('newsfeed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'newsfeed' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <FileText className="w-5 h-5" /> News Feed Extractor
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'classifier' && <MessageClassifier />}
          {activeTab === 'logistics' && <LogisticsCommander />}
          {activeTab === 'budget' && <BudgetKeeper />}
          {activeTab === 'newsfeed' && <NewsFeedExtractor />}
        </div>
      </main>
    </div>
  );
}
