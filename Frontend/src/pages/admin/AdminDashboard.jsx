import React from 'react';
import MainLayout from '../../components/MainLayout';
import { Users, UserCheck, FileCheck, ShieldAlert, Check, X } from 'lucide-react';

export default function AdminDashboard() {
  const pendingRecruiters = [
    { id: '1', name: 'John Doe', company: 'TechCorp Solutions', email: 'john@techcorp.com' },
    { id: '2', name: 'Sarah Smith', company: 'InnovateX', email: 'sarah@innovatex.io' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">System Admin Control</h1>
          <p className="text-slate-400 text-sm mt-1">Manage recruiters, categories, and platform oversight.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Pending Approvals" value="2" icon={<UserCheck className="text-amber-400" />} />
          <StatCard title="Total Candidates" value="142" icon={<Users className="text-indigo-400" />} />
          <StatCard title="Live Assessments" value="38" icon={<FileCheck className="text-emerald-400" />} />
        </div>

        {/* Pending Recruiter Approvals Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Pending Recruiter Approvals</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-500 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pendingRecruiters.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-medium text-white">{rec.name}</td>
                    <td className="p-3">{rec.company}</td>
                    <td className="p-3 text-slate-400">{rec.email}</td>
                    <td className="p-3 flex justify-end space-x-2">
                      <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition">
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-slate-800/50 rounded-xl">{icon}</div>
    </div>
  );
}