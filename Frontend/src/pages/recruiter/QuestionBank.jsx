import React from 'react';
import MainLayout from '../../components/MainLayout';
import { Plus, HelpCircle } from 'lucide-react';

export default function QuestionBank() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Question Bank</h1>
            <p className="text-slate-400 text-sm mt-1">Manage and assign questions to tests.</p>
          </div>
          <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-sm flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-3">
          {['What is Event Loop in Node.js?', 'Difference between SQL and NoSQL databases?'].map((q, idx) => (
            <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">{q}</span>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg">MCQ</span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}