import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchAssessmentDetails, submitCandidateAssessment } from '../api/candidateApi';
import { Clock } from 'lucide-react';

export default function ExamScreen() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  const { data: assessment, isLoading, isError } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => fetchAssessmentDetails(assessmentId),
  });

  const submitMutation = useMutation({
    mutationFn: submitCandidateAssessment,
    onSuccess: (res) => {
      navigate('/result', { state: { result: res.result } });
    },
    onError: (err) => alert(err.response?.data?.message || 'Submission failed'),
  });

  useEffect(() => {
    if (assessment && timeLeft === null) {
      setTimeLeft(assessment.durationMinutes * 60);
    }
  }, [assessment, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectAnswer = (questionId, option) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleFinalSubmit = () => {
    const formattedAnswers = Object.keys(userAnswers).map((qId) => ({
      questionId: qId,
      selectedAnswer: userAnswers[qId],
    }));
    submitMutation.mutate({ id: assessmentId, answers: formattedAnswers });
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600">Loading Exam...</div>;
  if (isError) return <div className="h-screen flex items-center justify-center text-rose-500">Error loading test instructions!</div>;

  const currentQ = assessment.questions[currentIdx];
  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = (timeLeft || 0) % 60;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-800">{assessment.title}</h1>
        <div className="flex items-center space-x-2 font-mono font-bold px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg border">
          <Clock className="w-5 h-5" />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 bg-white p-6 rounded-xl border flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Question {currentIdx + 1} of {assessment.questions.length}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-6">{currentQ.question}</h2>
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ._id] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQ._id, opt)}
                    className={`w-full text-left p-4 rounded-lg border font-medium transition ${isSelected ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/20' : 'border-slate-200 bg-white'}`}
                  >
                    <span className="mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span> {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-4 border-t">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className="px-5 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40"
            >
              Previous
            </button>
            {currentIdx === assessment.questions.length - 1 ? (
              <button
                onClick={handleFinalSubmit}
                disabled={submitMutation.isPending}
                className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Test'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border h-fit">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Questions Palette</h3>
          <div className="grid grid-cols-4 gap-2">
            {assessment.questions.map((q, idx) => (
              <button
                key={q._id}
                onClick={() => setCurrentIdx(idx)}
                className={`h-10 rounded-lg font-semibold text-sm ${idx === currentIdx ? 'ring-2 ring-indigo-600' : ''} ${userAnswers[q._id] ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}