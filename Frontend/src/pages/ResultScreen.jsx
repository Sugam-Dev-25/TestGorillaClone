import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { downloadCandidateCertificate } from '../api/candidateApi';
import { Award, Download, ArrowRight, XCircle } from 'lucide-react';

export default function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (result?.isPassed) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }, [result]);

  const downloadMutation = useMutation({
    mutationFn: downloadCandidateCertificate,
    onSuccess: (data) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate_${result.attemptId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    onError: () => alert('Failed to download certificate!'),
  });

  if (!result) return <div className="p-8 text-center">No Result Found!</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8 text-center">
        {result.isPassed ? (
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10" />
          </div>
        )}

        <h1 className="text-2xl font-bold text-slate-800">
          {result.isPassed ? 'Congratulations! You Passed 🎉' : 'Assessment Completed'}
        </h1>

        <div className="my-6 p-4 bg-slate-50 rounded-xl border flex justify-around">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Your Score</span>
            <p className="text-2xl font-black text-indigo-600">{result.score}</p>
          </div>
          <div className="border-r"></div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Marks</span>
            <p className="text-2xl font-black text-slate-700">{result.totalMarks}</p>
          </div>
        </div>

        <div className="space-y-3">
          {result.isPassed && (
            <button
              onClick={() => downloadMutation.mutate(result.attemptId)}
              disabled={downloadMutation.isPending}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>{downloadMutation.isPending ? 'Downloading...' : 'Download Certificate'}</span>
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 flex items-center justify-center space-x-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}