import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, PlayCircle, LogOut, Download } from 'lucide-react';

const fetchDashboardData = async () => {
  const { data } = await API.get('/candidate/dashboard');
  return data.data;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Role Validation Logic: Admin বা Recruiter ঢুকলে অটোমেটিক তাদের নির্দিষ্ট ড্যাশবোর্ডে পাঠাবে
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (user?.role === 'recruiter') {
      navigate('/recruiter/create', { replace: true });
    }
  }, [user, navigate]);

  // Candidate API Fetch (Admin/Recruiter হলে query run করা বন্ধ রাখবে enabled property এর মাধ্যমে)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidateDashboard'],
    queryFn: fetchDashboardData,
    enabled: !user?.role || user?.role === 'candidate', 
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center font-bold text-indigo-600">Loading Dashboard...</div>;
  if (isError) return <div className="h-screen flex items-center justify-center text-rose-500 font-medium">Failed to load dashboard data!</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center">
            {user?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="font-bold text-slate-800">{user?.name}</h1>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-slate-500 hover:text-rose-600 font-medium text-sm transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Main Dashboard Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Available Tests Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">Available Assessments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.availableAssessments?.map((test) => (
              <div key={test._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{test.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{test.description}</p>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 border-t pt-3">
                    <span>Duration: {test.durationMinutes} mins</span>
                    <span>Total Marks: {test.totalMarks}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/assessment/start/${test._id}`)}
                  className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 text-sm transition"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Exam</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Completed Tests & Certificates Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">My Exam History & Certificates</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-400 uppercase border-b">
                  <th className="p-4">Assessment Title</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {data?.completedAttempts?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-400">No exams taken yet.</td>
                  </tr>
                ) : (
                  data?.completedAttempts?.map((attempt) => (
                    <tr key={attempt._id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold text-slate-800">{attempt.assessmentId?.title}</td>
                      <td className="p-4 font-mono font-bold text-slate-700">{attempt.score} / {attempt.totalMarks}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${attempt.isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {attempt.isPassed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {attempt.isPassed ? (
                          <button
                            onClick={() => navigate('/result', { state: { result: { attemptId: attempt._id, isPassed: true, score: attempt.score, totalMarks: attempt.totalMarks } } })}
                            className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>View / Download</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Not Eligible</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}