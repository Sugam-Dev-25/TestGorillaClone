import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function ResultsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 80, pass = true } = location.state || {};

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          {pass ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8 text-rose-400" />}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            {pass ? 'Congratulations! Passed' : 'Test Failed'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Assessment Performance Summary</p>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex justify-around">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Your Score</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{score}%</p>
          </div>
          <div className="border-r border-slate-800" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Passing Mark</p>
            <p className="text-2xl font-bold text-slate-300 mt-1">60%</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </MainLayout>
  );
}