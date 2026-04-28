"use client";

import { useState } from 'react';
import MessageClassifier from '@/components/MessageClassifier';
import LogisticsCommander from '@/components/LogisticsCommander';
import BudgetKeeper from '@/components/BudgetKeeper';
import NewsFeedExtractor from '@/components/NewsFeedExtractor';
import { Shield, Map, Activity, FileText, Menu, X } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('classifier');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex-none bg-white border-b border-slate-200 p-4 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-2 text-brand-dark font-bold text-xl">
          <Shield className="w-6 h-6 text-brand" />
          Op Ditwah
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col z-40 transition-transform duration-300 ease-in-out transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center md:block">
          <div>
            <h1 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand" />
              Op Ditwah
            </h1>
            <p className="text-xs text-slate-500 mt-1 hidden md:block">Crisis Intelligence Pipeline</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleTabChange('classifier')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'classifier' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Shield className="w-5 h-5" /> Message Classifier
          </button>
          <button
            onClick={() => handleTabChange('logistics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logistics' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Map className="w-5 h-5" /> Logistics Commander
          </button>
          <button
            onClick={() => handleTabChange('budget')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'budget' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Activity className="w-5 h-5" /> Budget Keeper
          </button>
          <button
            onClick={() => handleTabChange('newsfeed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'newsfeed' ? 'bg-brand-light text-brand-dark font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <FileText className="w-5 h-5" /> News Feed Extractor
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
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
